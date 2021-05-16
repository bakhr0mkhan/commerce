import React from 'react';




import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


import{ Dashboard, Cart, Register, Login }from './screens/index'



const  App = () =>  {
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
          <Route path="/">
            <Dashboard />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
