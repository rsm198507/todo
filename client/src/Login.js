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
                message: "",
                mail: false,
                password: false
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
    // componentDidMount() {
    //     console.log(this.props.auth)
    // }

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
        } catch (e) {
            return e.message;
        }
    };

    checkLogin = async () => {
        let mail = this.state.mail;
        let password = sha256(this.state.password);

        let error = this.state.error;
        if (this.state.mail === "" || this.state.password === "") {
            this.showPopup(true, "Enter login and password");
        } else {
            let user = await this.getUserFromDb();
            if (user.data.data === null) {
                this.showPopup(true, "User not found");
                return false
            }
            if (user.data.data.mail === mail && user.data.data.password === password) {
                this.showPopup(true, "You sign in");
                localStorage.setItem(sha256('id'), user.data.data._id);
                localStorage.setItem(sha256('name'), user.data.data.name);
                localStorage.setItem(sha256('auth'), 'true');
            }
            else {
                this.showPopup(true, "Login or password in incorrect");
            }
        }
        if (this.state.mail === "") {
            error.mail = true
        } else {
            error.mail = false
        }
        if (this.state.password === "") {
            error.password = true
        } else {
            error.password = false
        }
        this.setState({
            error: error
        })
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
                        <input className={`input__text input__text_login ${this.state.error.mail ? "_error" : ""}`}
                               type="text"
                               value={this.state.mail} onChange={this.saveLogin}/>
                        <p>
                            &nbsp;
                        </p>
                    </div>
                    <div className="input">
                        <p>
                            Password
                        </p>
                        <input className={`input__text input__text_login ${this.state.error.password ? "_error" : ""}`}
                               type="password"
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

