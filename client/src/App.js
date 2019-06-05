import React from 'react';
import Field from './Field';
import Login from './Login';
import Register from './Register';
import {Route} from 'react-router-dom';

import './reset.css';
import './styles.css';
import Header from './Header';

const sha256 = require('js-sha256');

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: localStorage.getItem(sha256('auth')),
            name: localStorage.getItem(sha256('name'))
        }
    }
    render() {
        return (
            <div>
                <Header params={this.state}/>

                <Route path="/" exact component={Field}/>

                <Route path='/signin' render={() => (
                    <Login auth={this.state.auth} setAuth={this.setAuth}/>
                )}/>
                <Route path="/signup" component={Register}/>
            </div>
        );
    }
}

export default App;
