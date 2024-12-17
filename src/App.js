import React, { useState } from 'react';
import Sidebar from './components/SideBar';
import MainContent from './components/MainContent';
import './styles.css';

function App() {
  const [groups, setGroups] = useState([{ id: '1', name: 'Personal', color: '#007aff' }]);
  const [selectedGroup, setSelectedGroup] = useState(groups[0]);
  const [showToast, setShowToast] = useState(false);
  const profilePicUrl = 'https://example.com/profile.jpg';

  const addGroup = (name) => {
    const newGroup = { id: Date.now().toString(), name, color: '#007aff' };
    setGroups([...groups, newGroup]);
    showNotification('Group added!');
  };

  const showNotification = (message) => {
    setShowToast(message);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="app-container">
      <Sidebar
        groups={groups}
        onAddGroup={addGroup}
        profilePicUrl={profilePicUrl}
        setSelectedGroup={setSelectedGroup}
      />
      <MainContent selectedGroup={selectedGroup} />
      {showToast && <div className="toast">{showToast}</div>}
    </div>
  );
}

export default App;
