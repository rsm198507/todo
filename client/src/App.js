import React from 'react';
import Field from './Field';
import Login from './Login';
import Register from './Register';
import {Route, NavLink} from 'react-router-dom';

import './reset.css';
import './styles.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: true
        }
    }

    render() {
        return (
            <div>
                <div className="header">
                    <div className="header__greet">
                        Hi, name
                    </div>
                    <div className="header__reg">
                        <NavLink className="header__button" exact to="/">
                            Home
                        </NavLink>
                        <NavLink className="header__button" to="/signin">
                            Login
                        </NavLink>
                        <NavLink className="header__button" to="/signup">
                            Register
                        </NavLink>
                    </div>
                </div>
                <Route path="/" exact component={Field}/>
                <Route path="/signin" component={Login}/>
                <Route path="/signup" component={Register}/>
            </div>
        );
    }
}

export default App;
