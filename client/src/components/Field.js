import React, {Component} from 'react';
import Task from './Task';
import axios from "axios/index";

const sha256 = require('js-sha256');

class Field extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            auth: localStorage.getItem(sha256('auth')),
            selectAll: true,
            total: 0,
            select: '',
            // select: {
            //     all: true,
            //     active: false,
            //     completed: false
            // },
            value: '',
            userID: localStorage.getItem(sha256('id'))
        }
    }

    componentDidMount() {
        this.getDataFromDb(localStorage.getItem(sha256('id')));
        document.addEventListener('keydown', this.handleSubmit);
    };

    getDataFromDb = async (id) => {
        try {
            const getTasks = await axios.post("http://localhost:3001/api/tasks", {
                userID: id
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem("token")
                }
            });
            if (getTasks) {
                for (let item of getTasks.data.data) {
                    item.visible = true
                }
            }
            this.setState({
                items: getTasks.data.data
            })
        } catch (e) {
            console.log(e);
        }

    };

    putDataToDB = async (text) => {
        try {
            return await axios.post("http://localhost:3001/api/data", {
                text: text,
                checked: false,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem("token")
                }
            });
        }
        catch (err) {
            console.log(err);
        }

    };

    deleteFromDB = async id => {
        try {
            await axios.delete("http://localhost:3001/api/data", {
                data: {
                    id: id
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem("token")
                }
            });
        } catch (e) {
            console.log(e)
        }
    };

    addTask = (e) => {
        this.setState({value: e.target.value});
    };

    handleSubmit = async (e) => {
        const value = this.state.value;
        if (e.key === 'Enter' && value !== '') {
            const received = await this.putDataToDB(value);
            if (received) this.getDataFromDb(localStorage.getItem(sha256('id')));
            this.setState({value: ''})
        }
    };

    removeSingleTask = async (value) => {
        try {
            let objIdToDelete = null;
            this.state.items.forEach(item => {
                if (item._id === value._id) {
                    objIdToDelete = item._id;
                }
            });
            await this.deleteFromDB(objIdToDelete);
            await this.getDataFromDb(localStorage.getItem(sha256('id')));
        } catch (e) {
            console.log(e);
        }

    };
    updateSingleTask = async item => {
        let items = this.state.items.slice();

        let objIdToUpdate = "";
        this.state.items.forEach(element => {
            if (item._id === element._id) {
                objIdToUpdate = element._id;
                item.checked = element.checked;
            }

        });
        this.setState({
            items: items
        }, () => {
            switch (this.state.select) {
                case "all": {this.selectAllTasks(); break;}
                case "active": {this.selectActiveTasks(); break;}
                case "completed": {this.selectCompletedTasks(); break;}
                default: {break;}
            }
        });
        return await axios.patch("http://localhost:3001/api/data", {
            _id: objIdToUpdate,
            text: item.text,
            checked: item.checked
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("token")
            }
        });
    };
    doneAllTasks = async () => {
        let selectAll = this.state.selectAll;
        let items = this.state.items.slice();
        for (let item of items) {
            item.checked = selectAll;
            this.updateSingleTask(item);
        }
        this.setState({
                items: items,
                selectAll: !selectAll
            }
        );
    };
    removeDoneTasks = () => {
        let items = this.state.items.slice();
        let removeDone = items.filter(item => {
            if (item.checked) {
                this.deleteFromDB(item._id);
            }
            return !item.checked
        });
        this.setState({
            items: removeDone
        });
    };
    selectAllTasks = () => {
        let items = this.state.items.slice();

        for (let item of items) {
            item.visible = true;
        }
        this.setState({
            items: items,
            select: 'all'
        });
    };
    selectActiveTasks = () => {
        let items = this.state.items.slice();

        for (let item of items) {
            item.visible = !item.checked;
        }
        this.setState({
            items: items,
            select: 'active'
        });
    };
    selectCompletedTasks = async () => {
        let items = this.state.items.slice();

        for (let item of items) {
            item.visible = item.checked;
        }
        this.setState({
            items: items,
            select: 'completed'

        });
    };
    calculateItems = () => {
        let items = this.state.items.slice();
        let total = 0;
        for (let item of items) {
            if (!item.checked) {
                total++;
            }
        }
        return total;
    };

    renewSingleTask = async (item, value) => {

        let items = this.state.items.slice();
        item.text = value;

        this.setState({
            items: items
        });
        return await axios.patch("http://localhost:3001/api/data", {
            _id: item._id,
            text: item.text,
            checked: item.checked
        });
    };


    render() {
        if (this.state.auth) {
            return (
                <div className="field">
                    <div className="todo">
                        <div className="todo-add">
                            <div className="todo-add__img" onClick={this.doneAllTasks}>
                                <svg className="todo-add__icon" x="0px" y="0px"
                                     width="306px" height="306px" viewBox="0 0 306 306">
                                    <polygon points="270.3,58.65 153,175.95 35.7,58.65 0,94.35 153,247.35 306,94.35"
                                             fill="#d3d3d3"/>
                                </svg>
                            </div>
                            <div className="todo-add__area">
                                <div className="input">
                                    <input className="input__text input__text_add" type="text"
                                           value={this.state.value}
                                           placeholder="What needs to be done?" onChange={this.addTask}/>
                                </div>
                            </div>
                        </div>
                        <div className="todo-list">
                            {this.state.items.map((item, i) => {
                                if (item.visible === true) {
                                    return (<Task
                                        item={item}
                                        updateSingleTask={this.updateSingleTask}
                                        removeSingleTask={this.removeSingleTask}
                                        renewSingleTask={this.renewSingleTask}
                                        key={`task-${i}`}/>)
                                }
                                return false;
                            })}
                        </div>
                        {this.state.items.length ?
                            <div className="todo-status">
                                <div className="todo-status__left">
                                    <p className="todo-status__title todo-status__title_margins">
                                        {this.calculateItems()} item{(this.calculateItems() > 1) ? "s" : ""} left
                                    </p>
                                </div>
                                <div className="todo-status__filter">
                                    <p className={`todo-status__title ${(this.state.select === 'all') ? '_active' : ''}`}
                                       onClick={this.selectAllTasks}>
                                        All
                                    </p>
                                    <p className={`todo-status__title ${(this.state.select === 'active') ? '_active' : ''}`}
                                       onClick={this.selectActiveTasks}>
                                        Active
                                    </p>
                                    <p className={`todo-status__title ${(this.state.select === 'completed') ? '_active' : ''}`}
                                       onClick={this.selectCompletedTasks}>
                                        Completed
                                    </p>
                                </div>
                                <div className="todo-status__clear">
                                    <p className="todo-status__title todo-status__title_margins todo-status__title_underline"
                                       onClick={this.removeDoneTasks}>
                                        Clear completed
                                    </p>
                                </div>
                            </div>
                            : <div></div>}
                    </div>
                </div>
            )
        } else {
            return (
                <div></div>
            )
        }
    }
}

export default Field;
