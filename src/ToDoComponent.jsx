import React, { useState, useEffect, useRef, useMemo } from "react";

const ToDoComponent = () => {

    const [tasks, setTasks] = useState(() => {
        try {
            const savedTasks = localStorage.getItem("tasks");
            return savedTasks ? JSON.parse(savedTasks) : [];
        } catch {
            return [];
        }
    });

    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");


    const [newTask, setNewTask] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [dueDate, setDueDate] = useState("");


    const [filter, setFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("None");
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");


    const [lastDeleted, setLastDeleted] = useState(null);
    const deleteTimeoutRef = useRef(null);

    const dragItem = useRef();
    const dragOverItem = useRef();


    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        document.body.className = theme;
        localStorage.setItem("theme", theme);
    }, [theme]);


    useEffect(() => {
        return () => {
            if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
        };
    }, []);


    const addTask = () => {
        if (newTask.trim() !== "") {
            const newTodo = {
                id: crypto.randomUUID(),
                text: newTask.trim(),
                complete: false,
                priority: priority,
                dueDate: dueDate || null
            };
            setTasks([newTodo, ...tasks]);
            setNewTask("");
            setDueDate("");
        }
    };

    const toggleDone = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, complete: !t.complete } : t));

    const deleteTask = (id) => {
        const taskToDelete = tasks.find(t => t.id === id);
        setLastDeleted(taskToDelete);
        setTasks(tasks.filter(t => t.id !== id));


        if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
        deleteTimeoutRef.current = setTimeout(() => setLastDeleted(null), 5000);
    };

    const undoDelete = () => {
        if (lastDeleted) {
            setTasks(prev => [lastDeleted, ...prev]);
            setLastDeleted(null);
            if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
        }
    };

    const startEditing = (task) => {
        setEditingId(task.id);
        setEditText(task.text);
    };

    const saveEdit = (id) => {
        if (editText.trim() === "") {
            setEditingId(null);
            return;
        }
        setTasks(tasks.map(t => t.id === id ? { ...t, text: editText.trim() } : t));
        setEditingId(null);
    };


    const dragStart = (e, id) => { dragItem.current = id; };
    const dragEnter = (e, id) => { dragOverItem.current = id; };
    const drop = () => {
        if (filter !== "All" || searchQuery !== "" || sortBy !== "None") return;

        const dragIndex = tasks.findIndex(t => t.id === dragItem.current);
        const hoverIndex = tasks.findIndex(t => t.id === dragOverItem.current);

        const copyListItems = [...tasks];
        const draggedItem = copyListItems[dragIndex];

        copyListItems.splice(dragIndex, 1);
        copyListItems.splice(hoverIndex, 0, draggedItem);

        setTasks(copyListItems);
        dragItem.current = null;
        dragOverItem.current = null;
    };


    const displayedTasks = useMemo(() => {
        let filtered = tasks.filter(task => {
            const matchesFilter = filter === "All" ||
                (filter === "Active" && !task.complete) ||
                (filter === "Completed" && task.complete);
            const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        });

        if (sortBy === "DueDate") {
            filtered.sort((a, b) => {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            });
        }

        return filtered;
    }, [tasks, filter, searchQuery, sortBy]);


    const isOverdue = (dateString) => {
        if (!dateString) return false;
        const today = new Date().setHours(0, 0, 0, 0);
        const taskDate = new Date(dateString).setHours(0, 0, 0, 0);
        return taskDate < today;
    };

    return (
        <div className={`app-container ${theme} min-vh-100 d-flex flex-column align-items-center py-5`}>


            <button
                className="theme-toggle position-absolute top-0 end-0 m-4 btn btn-outline-secondary rounded-circle"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
                {theme === "dark" ? "☀️" : "🌙"}
            </button>

            <h1 className="fw-bold mb-4">Task Master Pro</h1>


            <div className="w-75 max-w-800 d-flex flex-column gap-3 mb-4 glass-panel p-4 rounded">
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                    <input
                        type="text"
                        placeholder="What needs to be done?"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addTask()}
                        className="custom-input flex-grow-1"
                    />
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="custom-input"
                    />
                    <select value={priority} onChange={(e) => setPriority(e.target.value)} className="custom-input">
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                    <button onClick={addTask} className="btn-primary-custom px-4">Add</button>
                </div>

                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-2">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="custom-input w-25"
                    />

                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="custom-input">
                        <option value="None">Custom Order</option>
                        <option value="DueDate">Sort by Due Date</option>
                    </select>

                    <div className="filter-container m-0">
                        {["All", "Active", "Completed"].map(f => (
                            <span key={f} onClick={() => setFilter(f)} className={`filter-tab ${filter === f ? 'active' : ''}`}>
                                {f}
                            </span>
                        ))}
                    </div>
                </div>
            </div>


            <ol className="all-task p-4 w-75 max-w-800 glass-panel rounded list-unstyled">
                {displayedTasks.length === 0 ? (
                    <p className="text-center my-4 opacity-50">No tasks found. Time to chill! ☕</p>
                ) : (
                    displayedTasks.map((task) => (
                        <li
                            key={task.id}
                            className={`task-item mb-3 p-3 rounded ${task.complete ? 'opacity-75' : ''} ${isOverdue(task.dueDate) && !task.complete ? 'border-danger' : ''}`}
                            draggable={filter === "All" && searchQuery === "" && sortBy === "None"}
                            onDragStart={(e) => dragStart(e, task.id)}
                            onDragEnter={(e) => dragEnter(e, task.id)}
                            onDragEnd={drop}
                            onDragOver={(e) => e.preventDefault()}
                            style={{ cursor: (filter === "All" && searchQuery === "" && sortBy === "None") ? "grab" : "default" }}
                        >
                            <span className="d-flex justify-content-between align-items-center flex-wrap gap-2">

                                <div className="d-flex align-items-center gap-3 flex-grow-1">
                                    {filter === "All" && searchQuery === "" && sortBy === "None" && (
                                        <i className="fa-solid fa-grip-vertical text-secondary cursor-grab"></i>
                                    )}

                                    {editingId === task.id ? (
                                        <input
                                            type="text"
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") saveEdit(task.id);
                                                if (e.key === "Escape") setEditingId(null);
                                            }}
                                            onBlur={() => saveEdit(task.id)}
                                            autoFocus
                                            className="custom-input w-100"
                                        />
                                    ) : (
                                        <div className="d-flex flex-column">
                                            <span style={{ textDecoration: task.complete ? "line-through" : "none" }}>
                                                {task.text}
                                            </span>
                                            <div className="d-flex gap-2 mt-1" style={{ fontSize: "0.8rem" }}>
                                                <span className={`badge ${task.priority === 'High' ? 'bg-danger' : task.priority === 'Medium' ? 'bg-warning text-dark' : 'bg-success'}`}>
                                                    {task.priority}
                                                </span>
                                                {task.dueDate && (
                                                    <span className={`${isOverdue(task.dueDate) && !task.complete ? 'text-danger fw-bold' : 'text-secondary'}`}>
                                                        <i className="fa-regular fa-calendar me-1"></i>
                                                        {task.dueDate} {isOverdue(task.dueDate) && !task.complete && "(Overdue)"}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="task-options d-flex gap-3 align-items-center">
                                    <i onClick={() => startEditing(task)} className="fa-solid fa-pen text-warning cursor-pointer hover-scale"></i>
                                    <i onClick={() => toggleDone(task.id)} className="fa-solid fa-check text-success cursor-pointer hover-scale"></i>
                                    <i onClick={() => deleteTask(task.id)} className="fa-solid fa-trash text-danger cursor-pointer hover-scale"></i>
                                </div>
                            </span>
                        </li>
                    ))
                )}
            </ol>


            {lastDeleted && (
                <div className="position-fixed bottom-0 end-0 m-4 p-3 rounded glass-panel d-flex align-items-center gap-3 slide-up-animation" style={{ zIndex: 1000 }}>
                    <span>Task deleted.</span>
                    <button onClick={undoDelete} className="btn btn-sm btn-warning fw-bold">Undo</button>
                </div>
            )}
        </div>
    );
};

export default ToDoComponent;