import React, { Component } from 'react';
import {NavLink} from "react-router-dom";
const sha256 = require('js-sha256');

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    logoutUser = () => {
            localStorage.removeItem(sha256("id"));
            localStorage.removeItem(sha256("name"));
            localStorage.removeItem(sha256("auth"));
            document.location.href="/";


    };

    render() {
        if(this.props.params.auth === 'true'){
            return(
                <div className="header">
                    <div className="header__greet">
                        Hi, {this.props.params.name}
                    </div>
                    <div className="header__reg">
                        <NavLink className="header__button" to="/" onClick={this.logoutUser}>
                            Logout
                        </NavLink>
                    </div>
                </div>
            );
        }
        else {
            return(
                <div className="header">
                    <div className="header__greet">

                    </div>
                    <div className="header__reg">
                        <NavLink className="header__button" to="/signin">
                            Login
                        </NavLink>
                        <NavLink className="header__button" to="/signup">
                            Register
                        </NavLink>
                    </div>
                </div>
            )
        }
    }
}

export default Header;

