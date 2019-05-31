import React, {Component} from 'react';
import axios from "axios";
import Popup from "./Popup";
const sha256 = require('js-sha256');

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mail: "",
            password: "",
            error: {
                status: false,
                message: ""
            },
            signIn: false
        }
    }
    /*
    * change(e) {
    *   this.setState({
    *       [e.target.name]: e.target.value
    * });
    * }
    *
    * */
    saveLogin = (e) => {
        this.setState({
            mail: e.target.value
        });
    };
    savePassword = (e) => {
        this.setState({
            password: e.target.value
        });
    };
    showPopup = (status, message) => {
        let state = this.state;
        state.error.status = status;
        state.error.message = message;

        this.setState({
            error: state.error
        });
    };
    getUserFromDb = async () => {

        try {
            const user = await axios.post("http://localhost:3001/api/signin", {
                mail: this.state.mail
            });
            return user;
        }

        catch (e) {
            return e.message;
        }


    };
    checkLogin = async () => {
        let mail = this.state.mail;
        let password = sha256(this.state.password);
        if (this.state.mail === "" || this.state.password === "") {
            this.showPopup(true, "Введите логин и пароль")
            }
        else {
            let user = await this.getUserFromDb();
            if (user.data.data === null) {
                this.showPopup(true, "User not found")
            }
        }
    };

    render() {
        return (
            <div className="field">
                <Popup error={this.state.error}
                       showPopup={this.showPopup}
                />

                <div className="login">
                    <h1>Login form</h1>

                    <div className="input">
                        <p>
                            E-mail
                        </p>
                        <input className={`input__text input__text_login ${this.state.error.status ? "_error" : ""}`} type="text"
                               value={this.state.mail} onChange={this.saveLogin}/>
                        <p>
                            &nbsp;
                        </p>
                    </div>
                    <div className="input">
                        <p>
                            Password
                        </p>
                        <input className="input__text input__text_login" type="password"
                               value={this.state.password} onChange={this.savePassword}/>
                        <p>
                            &nbsp;
                        </p>
                    </div>
                    <button className={"btn"} onClick={this.checkLogin}>Login</button>
                </div>
            </div>
        );
    }
}

export default Login;

