import React from "react";
//@ts-ignore
import { Route, Redirect } from "react-router-dom";
import { useFirebaseContext } from "../../context/index";

//@ts-ignore
const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  //@ts-ignore
  const { currentUser } = useFirebaseContext();
  return (
    <Route
      {...rest}
      render={(routeProps: any) =>
        !!currentUser ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect to={"/login"} />
        )
      }
    />
  );
};
export default PrivateRoute;
