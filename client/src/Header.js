import React, { Component } from 'react';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        if(this.props.auth){
            return(
                <div className="header">
                    <div className="header__greet">
                        Hi, name
                    </div>
                    <div className="header__reg">
                        <a className="header__button" href="/login">
                            Login
                        </a>
                        <a className="header__button" href="/register">
                            Register
                        </a>
                    </div>
                </div>
            );
        }
    }
}

export default Header;

