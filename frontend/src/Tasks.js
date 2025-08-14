import React, { Component } from "react";
import {
    addTask,
    getTasks,
    updateTask,
    deleteTask,
} from "./services/taskServices";
import { Paper, TextField, Checkbox, Button } from "@material-ui/core";

class Tasks extends Component {
    state = { tasks: [], currentTask: "" };

    async componentDidMount() {
        try {
            const { data } = await getTasks();
            this.setState({ tasks: data });
        } catch (error) {
            console.log(error);
        }
    }

    handleChange = ({ currentTarget: input }) => {
        this.setState({ currentTask: input.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const originalTasks = this.state.tasks;
        try {
            const { data } = await addTask({ task: this.state.currentTask });
            const tasks = [...originalTasks, data]; // Append new task
            this.setState({ tasks, currentTask: "" });
        } catch (error) {
            this.setState({ tasks: originalTasks });
            console.log(error);
        }
    };

    handleUpdate = async (id) => {
        const originalTasks = this.state.tasks;
        try {
            const tasks = [...originalTasks];
            const index = tasks.findIndex((task) => task._id === id);
            tasks[index] = { ...tasks[index] };
            tasks[index].completed = !tasks[index].completed;
            this.setState({ tasks });
            await updateTask(id, {
                completed: tasks[index].completed,
            });
        } catch (error) {
            this.setState({ tasks: originalTasks });
            console.log(error);
        }
    };

    handleDelete = async (id) => {
        const originalTasks = this.state.tasks;
        try {
            const tasks = originalTasks.filter((task) => task._id !== id);
            this.setState({ tasks });
            await deleteTask(id);
        } catch (error) {
            this.setState({ tasks: originalTasks });
            console.log(error);
        }
    };

    render() {
        const { tasks, currentTask } = this.state;
        return (
            <Paper elevation={3} className="todo-container">
                <form onSubmit={this.handleSubmit} className="task-form">
                    <TextField
                        variant="outlined"
                        size="small"
                        className="task-input"
                        value={currentTask}
                        required={true}
                        onChange={this.handleChange}
                        placeholder="Add New TO-DO"
                    />
                    <Button className="add-task-btn" color="primary" variant="outlined" type="submit">
                        Add Task
                    </Button>
                </form>
                <div className="tasks-list">
                    {tasks.map((task) => (
                        <Paper key={task._id} className="task-item">
                            <Checkbox
                                checked={task.completed}
                                onClick={() => this.handleUpdate(task._id)}
                                color="primary"
                            />
                            <div className={task.completed ? "task-text completed" : "task-text"}>
                                {task.task}
                            </div>
                            <Button onClick={() => this.handleDelete(task._id)} color="secondary" className="delete-task-btn">
                                Delete
                            </Button>
                        </Paper>
                    ))}
                </div>
            </Paper>
        );
    }
}

export default Tasks;
