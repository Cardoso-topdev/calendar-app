import React from 'react';
import { Route, Redirect } from 'react-router';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  return (
    <Route
        {...rest}
        render={props =>
          userInfo && userInfo.isAdmin ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/signin",
                state: { from: props.location }
              }}
            />
          )
        }
      />
  
  )
}



export default PrivateRoute