import React, {Component} from 'react';

import doneIcon from './img/done.svg';
import itemIcon from './img/not-done.svg';
import delIcon from './img/delete.svg';

class Task extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isInput: false
        }
    };

    changeStatus = () => {
        let item = this.props.item;
        item.checked = !this.props.item.checked;
        this.props.updateSingleTask(item);
    };

    removeTask = () => {
        this.props.removeSingleTask(this.props.item);
    };

    replaceInput = () => {
        this.setState({
            isInput: true
        });
    };
    updateTask = (e) => {
        this.props.renewSingleTask(this.props.item, e.target.value);
    };

    saveTask = (e) => {
        if (e.key === 'Enter') {
            this.setState({
                isInput: false
            });
        }
    };
    stopPropagation = (e) => {
      e.stopPropagation();
    };
    render() {
        return (
            <div className="todo-item">
                <div className="todo-item__container" onClick={this.changeStatus}>
                    <div className="todo-item__check">
                        <img className="todo-item__icon" src={(this.props.item.checked) ? doneIcon : itemIcon} alt=""
                             />
                    </div>
                    <div className={`todo-item__title ${(this.props.item.checked) ? '_done' : ''}`} onClick={this.stopPropagation}>
                        {this.state.isInput && <div className="input">
                            <input className="input__text input__text_add" type="text"
                                   value={this.props.item.text} onKeyDown={this.saveTask} onChange={this.updateTask}/>
                        </div>}
                        {!this.state.isInput && <p className="todo-item__text" onDoubleClick={this.replaceInput}>
                            {this.props.item.text}
                        </p>}

                    </div>

                </div>
                <div className="todo-item__delete">
                    <img className="todo-item__icon todo-item__icon_delete" src={delIcon} alt=""
                         onClick={this.removeTask}/>
                </div>
            </div>
        );
    }
}

export default Task;

