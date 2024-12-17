import React from 'react';

function TaskItem({ task, toggleTaskCompletion }) {
  return (
    <li>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleTaskCompletion(task.id)}
      />
      <span>{task.content}</span>
    </li>
  );
}

export default TaskItem;
