import React from 'react';

function GroupItem({ group, onEdit, onDelete, setSelectedGroup }) {
  return (
    <div className="group-item" onClick={() => setSelectedGroup(group)}>
      <span>{group.name}</span>
      <button onClick={(e) => { e.stopPropagation(); onEdit(group.id, prompt('Rename group')); }}>✏️</button>
      <button onClick={(e) => { e.stopPropagation(); onDelete(group.id); }}>🗑️</button>
    </div>
  );
}

export default GroupItem;
