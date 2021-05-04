import React, {useEffect} from 'react';

import {useCommerceContext} from './context'





const  App = () =>  {
  const {cart } = useCommerceContext()
  useEffect(() => {
    console.log(cart)
  }, [])


  return (
    <div className="App">
      <p>Thisis typescript app</p>
    </div>
  );
}

export default App;
