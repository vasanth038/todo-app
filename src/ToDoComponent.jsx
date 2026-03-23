import React from "react"
import { useState ,useEffect } from "react";

const ToDoComponent = () => {
       const [tasks, setTasks] = useState(() => { 
        let savedTasks = localStorage.getItem("tasks");
        return savedTasks ? JSON.parse(savedTasks) : [
            { text: "Task 1", complete: false },
            { text: "Task 2", complete: false },
            { text: "Task 3", complete: false },
            { text: "Task 4", complete: false }
        ];
    });

    const [newTask, setNewTask] = useState("");

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    function handleInputChange(event) {
        setNewTask(event.target.value);
    }
    function handleKeyDown(event) {
        if (event.key === "Enter") {
            addTask();
        }
    }

    function addTask (){
        if(newTask.trim()!== ""){
            setTasks([...tasks,{text:newTask,complete:false}]);  
        setNewTask(""); 
        }
    }
    function doneTask(id){
       const updateTasks=  tasks.map((task,i) => {
        if(i === id) {
             return {...task, complete:!task.complete}
        }
            return task;
       });
       setTasks(updateTasks);
    };
function deleteTask(index){
    const newTaskList = tasks.filter((e,i) =>i !== index);
    setTasks(newTaskList);
}
   

    return (
        <div style={{ height: "80vh" }} className="container m-5 p-5 d-flex flex-column justify-content-center align-items-center ">
            <h1 className="text-light">TO-DO LIST</h1>
            <div className="add-task-box m-5">
                <input
                 type="text"
                 placeholder="Enter your task.."
                    value={newTask}
                    
                          onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                
                />
                <button onClick={addTask} className="add-btn">Add Task </button>
            </div>
            <ol className="all-task p-5">
                {tasks.map((task, index) => {
                    return (
                        <li key={index}>
                            <span className="d-flex justify-content-between" >
                               <span style={{textDecoration : task.complete ? "line-through" : "none" ,color : task.complete ? "green" : "white"}}>
                                {task.text}
                            </span>
                            
                                <div className="task-options">

                                    <i id ="done" onClick={() => doneTask(index) } className="fa-solid fa-check px-4"></i>
                                    <i id = "delete" onClick={ () => deleteTask(index)} className="fa-solid fa-trash px-4"></i>
                                </div>
                            </span><hr/>
                        </li>
                    )
                })}

            </ol>
        </div>
    )
}
export default ToDoComponent;