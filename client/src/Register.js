import React, { Component } from 'react';
import axios from "axios";
import Popup from "./Popup";


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name:"",
            mail:"",
            password:"",
            error: {
                status: false,
                message: "",
                name: false,
                mail: false,
                password: false
            }
        }
    }

    saveName = (e) => {
        this.setState({
            name: e.target.value
        });
    };
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
    putUserToDB = async () => {

        try {
            let error = this.state.error;
            if (this.state.mail === "" || this.state.password === "" || this.state.error.name === ""){
                this.showPopup(true, "Enter all fields");
            }
            else {
                const user =  await axios.post("http://localhost:3001/api/signup", {
                    name: this.state.name,
                    mail: this.state.mail,
                    password: this.state.password

                });
                if(user.data.data === null) {
                    this.showPopup(true, "You sign up");
                }
                else {
                    this.showPopup(true, "User already exist");
                }
            }

            if (this.state.name === "") {
                error.name = true
            } else {
                error.name = false
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
        } catch (error) {
            console.log("error in put user to db, ", error);
        }
    };

    showPopup = (status, message) => {
        let state = this.state;
        state.error.status = status;
        state.error.message = message;
        this.setState({
            error: state.error
        });
    };
    render() {
        return(
            <div className="field">
                <Popup error={this.state.error}
                       showPopup={this.showPopup}
                />
                <div className="login">
                    <h1>Register form</h1>
                    <div className="input">
                        <p>
                            Name
                        </p>
                        <input className={`input__text input__text_login ${this.state.error.name ? "_error" : ""}`} type="text"
                               value={this.state.name} onChange={this.saveName} />
                        <p>
                            &nbsp;
                        </p>
                    </div>
                    <div className="input">
                        <p>
                            E-mail
                        </p>
                        <input className={`input__text input__text_login ${this.state.error.mail ? "_error" : ""}`} type="text"
                               value={this.state.mail} onChange={this.saveLogin} />
                        <p>
                            &nbsp;
                        </p>
                    </div>
                    <div className="input">
                        <p>
                            Password
                        </p>
                        <input className={`input__text input__text_login ${this.state.error.password ? "_error" : ""}`} type="password"
                               value={this.state.password} onChange={this.savePassword} />
                        <p>
                            &nbsp;
                        </p>
                    </div>
                    <button className={"btn"} onClick={this.putUserToDB}>Register</button>
                </div>
            </div>
        );
    }
}

export default Login;

