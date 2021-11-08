import React from 'react';
import {Link, useHistory} from 'react-router-dom';

function Navbar(){

    return(
        <div className="navbar-light ">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <nav className="navbar navbar-expand-lg">
                            <div className="container-fluid">
                                <Link to="/home" className="navbar-brand text-dark">Music Beat</Link>
                            </div>

                        </nav>
                    </div>
                </div>
            </div>
        </div>
        
    );
}
export default Navbar;