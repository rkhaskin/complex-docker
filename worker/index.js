const keys = require("./keys");
const redis = require("redis");

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

// create subscriber
const sub = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;

  return fib(index - 1) + fib(index - 2);
}

// every time a new value is inserted, we will get a message
sub.on("message", (channel, message) => {
  console.log("aaaaaaaaa ", message);
  // run function when the message arrives

  // hashset "values" will be created. if not exist
  // message - key
  // response from fib is a value
  redisClient.hset("values", message, fib(parseInt(message)));
});

// subscribe to redis insert event
sub.subscribe("insert");
