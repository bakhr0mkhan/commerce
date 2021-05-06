import React from 'react';




import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


import{ Dashboard, Cart }from './screens/index.tsx'



const  App = () =>  {
  return (
    <Router>
        <Switch>
          <Route path="/cart">
            <Cart />
          </Route>
          <Route path="/">
            <Dashboard />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
