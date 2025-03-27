import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [filter, setFilter] = useState("all"); // ✅ Filter State
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const addTask = () => {
    if (taskInput.trim() === "") return;
    const newTask = { text: taskInput, dueDate: taskDueDate, completed: false };
    setTasks([...tasks, newTask]);
    setTaskInput("");
    setTaskDueDate("");
  };

  const toggleTaskStatus = (index) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (index) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);
    setTasks(reorderedTasks);
  };

  // ✅ Sorting Tasks by Due Date
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  // ✅ Filtered Tasks
  const filteredTasks = sortedTasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true; // "all" case
  });

  return (
    <div className={`container mt-4 ${darkMode ? "dark-mode" : ""}`}>
      <div className="d-flex justify-content-center align-items-center mb-3">
        <h2 className="text-primary">Task Manager</h2>
      </div>

      {/* ✅ Filter Section */}
      <div className="d-flex justify-content-between mb-3">
        <select className="form-select w-25" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Tasks</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>

        <button className="btn btn-secondary" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* ✅ Input Fields */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Task"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        />
        <input
          type="date"
          className="form-control date-input"
          value={taskDueDate}
          onChange={(e) => setTaskDueDate(e.target.value)}
        />
        <motion.button
          className="btn btn-success"
          onClick={addTask}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Add Task
        </motion.button>
      </div>

      {/* ✅ Drag & Drop List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="taskList">
          {(provided) => (
            <ul className="list-group" {...provided.droppableProps} ref={provided.innerRef}>
              <AnimatePresence>
                {filteredTasks.map((task, index) => (
                  <Draggable key={index} draggableId={index.toString()} index={index}>
                    {(provided) => (
                      <motion.li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`list-group-item d-flex justify-content-between align-items-center ${
                          task.completed ? "list-group-item-success" : ""
                        }`}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div>
                          <span
                            style={{
                              textDecoration: task.completed ? "line-through" : "none",
                            }}
                          >
                            {task.text}
                          </span>
                          <small className="text-muted ms-3">
                            📅 {task.dueDate || "No Due Date"}
                          </small>
                        </div>
                        <div>
                          <motion.button
                            className={`btn btn-sm ${task.completed ? "btn-warning" : "btn-primary"} me-2`}
                            onClick={() => toggleTaskStatus(index)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {task.completed ? "Undo" : "Complete"}
                          </motion.button>
                          <motion.button
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteTask(index)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            ❌ Delete
                          </motion.button>
                        </div>
                      </motion.li>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TaskList;
