import React from 'react';
import GroupItem from './GroupItem';

function Sidebar({ groups, onAddGroup, profilePicUrl, setSelectedGroup }) {
  return (
    <div className="sidebar">
      <button onClick={() => onAddGroup(prompt('Enter group name'))}>+</button>
      <div className="groups-list">
        {groups.map((group) => (
          <GroupItem
            key={group.id}
            group={group}
            setSelectedGroup={setSelectedGroup}
          />
        ))}
      </div>
      <div className="profile-pic">
        <img src={profilePicUrl} alt="Profile" />
      </div>
    </div>
  );
}

export default Sidebar;
