import React from 'react';

function CategoryNav({ currentCategory, setCurrentCategory }) {
  const categories = ['Personal', 'Work', 'Shopping'];

  return (
    <nav>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setCurrentCategory(category)}
          className={currentCategory === category ? 'active' : ''}
        >
          {category}
        </button>
      ))}
    </nav>
  );
}

export default CategoryNav;
