import React from "react";
import TaskList from "./components/TaskList"; // Import TaskList

function App() {
  return (
    <div>
     <h1>Task Manager App</h1>
      <TaskList /> {/* TaskList Component ko yahan add kiya */}
    </div>
  );
}

export default App;
