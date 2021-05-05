import React, {useEffect} from 'react';




import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


import {useCommerceContext} from './context'
import{ Dashboard, Cart }from './screens'



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
