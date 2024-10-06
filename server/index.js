const keys = require("./keys");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const redis = require("redis");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// postgres setup
const { Pool } = require("pg");
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
  ssl:
    process.env.NODE_ENV !== "production"
      ? false
      : { rejectUnauthorized: false },
});

pgClient.on("connect", (client) => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.error(err));
});

// redis client setup
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

const redisPublisher = redisClient.duplicate();

// express route handlers
app.get("/", (req, res) => {
  res.send("hi");
});

// return all indexes submitted and saved in postgress
app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("select * from values");

  res.send(values.rows);
});

// query redis hash
app.get("/values/current", async (req, res) => {
  redisClient.hgetall("values", (err, values) => {
    res.send(values);
  });
});

// get posted value from client
app.post("/values", async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }

  // put a new index into hash. It has not yet have any calculated value
  redisClient.hset("values", index, "Nothing yet");

  // send message to worker process and tell it to calculate value for index
  // this "insert" must have "insert" inside worker. Worker is subscriber to this "insert" topic or whatever it is
  redisPublisher.publish("insert", index);

  pgClient.query("insert into values (number) values ($1)", [index]);

  res.send({ working: true });
});

app.listen(5000, (err) => {
  console.log("Listening");
});
