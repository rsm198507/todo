import React, {Component} from 'react';

class Popup extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <div className={`popup ${this.props.error.status ? "_active" : ""}`}>
                <div className="popup__error"> {this.props.error.message}
                </div>

                <p className="popup__close" onClick={this.props.showPopup(false)}>X</p>
            </div>
        );
    }
}

export default Popup;

