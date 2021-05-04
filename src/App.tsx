import React, {useEffect} from 'react';
import Commerce from '@chec/commerce.js';

const commerce = new Commerce(process.env.REACT_APP_COMMERCEJS_PUBLIC_KEY);


const  App = () =>  {
  useEffect(() => {
    console.log(commerce)
  }, [])


  return (
    <div className="App">
      <p>Thisis typescript app</p>
    </div>
  );
}

export default App;
