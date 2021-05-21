import React from "react";

//@ts-ignore
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import {
  Dashboard,
  Cart,
  Register,
  Login,
  Checkout,
  Payment,
  PrivateRoute,
} from "./screens";

const App = () => {
  return (
    <Router>
      <Switch>
        <PrivateRoute exact path="/cart" component={Cart} />
        <PrivateRoute exact path="/checkout" component={Checkout} />
        <PrivateRoute exact path="/payment" component={Payment} />
        {/* <Route path="/cart">
          <Cart />
        </Route> */}
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        {/* <Route path="/checkout">
          <Checkout />
        </Route> */}
        {/* <Route path="/payment">
          <Payment />
        </Route> */}
        <Route path="/">
          <Dashboard />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
