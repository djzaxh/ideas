import React, { useState } from 'react';
import TaskList from './TaskList';
import TaskInput from './TaskInput';

function MainContent({ selectedGroup }) {
  const [tasks, setTasks] = useState([]);

  const addTask = (content) => {
    const newTask = { id: Date.now().toString(), content, completed: false };
    setTasks([...tasks, newTask]);
  };

  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  return (
    <div>
      <h2>{selectedGroup.name} Tasks</h2>
      <TaskInput addTask={addTask} />
      <TaskList tasks={tasks} toggleTaskCompletion={toggleTaskCompletion} />
    </div>
  );
}

export default MainContent;
