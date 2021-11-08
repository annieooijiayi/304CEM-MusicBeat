import React from 'react';
import {Route, Redirect} from 'react-router-dom';

function ProtectedRoute({component: Component, ...rest}){
    const isAuth = sessionStorage.getItem('token');        
  

    return (
        <Route 
            {...rest} 
            render ={(props) =>{
                if (isAuth){
                    return <Component />;
                }
                else{
                    return <Redirect to={{pathname:'/', state: {from: props.location}}}/>;
                }
            }} 
        />
    );
}
export default ProtectedRoute;