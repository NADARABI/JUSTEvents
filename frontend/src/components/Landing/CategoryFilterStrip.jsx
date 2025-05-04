import React from 'react';
import { useNavigate } from 'react-router-dom';
import './categoryFilterStrip.css';

const categories = ['All', 'Tech', 'Workshops', 'Clubs', 'Competitions', 'Sports', 'Health'];

const CategoryFilterStrip = () => {
  const navigate = useNavigate();

  const handleFilterClick = (category) => {
    if (category === 'All') navigate('/events');
    else navigate(`/events?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="category-strip">
      {categories.map((cat) => (
        <button key={cat} className="category-button" onClick={() => handleFilterClick(cat)}>
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilterStrip;
