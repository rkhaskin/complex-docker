import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import otherPage from "./otherPage";
import Fib from "./Fib";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React AAA</h1>
          <Link to="/">Home</Link>
          {/* <Link to="/otherpage">Other page</Link> */}
        </header>
        <div>
          <Route exact path="/" component={Fib} />
          {/* <Route path="/otherpage" component={otherPage} /> */}
        </div>
      </div>
    </Router>
  );
}

export default App;
