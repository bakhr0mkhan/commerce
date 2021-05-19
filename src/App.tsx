import React from "react";

//@ts-ignore
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Dashboard, Cart, Register, Login, Checkout } from "./screens/index";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/cart">
          <Cart />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/checkout">
          <Checkout />
        </Route>
        <Route path="/">
          <Dashboard />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
