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
                message: ""
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
            const user =  await axios.post("http://localhost:3001/api/signup", {
                name: this.state.name,
                mail: this.state.mail,
                password: this.state.password

            });
            if(user.data.data === null) {
                //console.log("User added to DB");
            }
            else {
                console.log("User with this name is already exist");
                this.showPopup(true);
            }
            //console.log("user=", user);
        } catch (error) {
            console.log("error in put user to db, ", error);
        }
    };

    showPopup = (status) => {
        let state = this.state;
        state.error.status = status;
        state.error.message = "Такой пользователь уже есть";
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
                        <input className="input__text input__text_login" type="text"
                               value={this.state.name} onChange={this.saveName} />
                        <p>
                            &nbsp;
                        </p>
                    </div>
                    <div className="input">
                        <p>
                            E-mail
                        </p>
                        <input className="input__text input__text_login" type="text"
                               value={this.state.mail} onChange={this.saveLogin} />
                        <p>
                            &nbsp;
                        </p>
                    </div>
                    <div className="input">
                        <p>
                            Password
                        </p>
                        <input className="input__text input__text_login" type="password"
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

