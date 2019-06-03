import React, {Component} from 'react';

const sha256 = require('js-sha256');

class Popup extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    closePopup = () => {
        this.props.showPopup(false);
    };
    render() {
        return (
            <div className={`popup ${this.props.error.status ? "_active" : ""}`}>
                <div className="popup__error"> {this.props.error.message}
                </div>
                {
                    localStorage.getItem(sha256('auth')) ?
                    document.location.href="/" :
                    <div></div>
                }
                <p className="popup__close" onClick={this.closePopup}>X</p>
            </div>
        );
    }
}

export default Popup;

