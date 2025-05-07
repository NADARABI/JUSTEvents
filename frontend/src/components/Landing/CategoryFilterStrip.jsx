// src/components/Events/CategoryFilterStrip.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './categoryFilterStrip.css';

const categories = [
  'All',
  'General',
  'Social',
  'Sports',
  'Academic',
  'Tech',
  'Health',
  'Workshop',
];

const CategoryFilterStrip = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentCategory = new URLSearchParams(location.search).get('category') || 'All';

  const handleClick = (category) => {
    const query = category === 'All' ? '' : `?category=${encodeURIComponent(category)}`;
    navigate(`/events${query}`);
  };

  return (
    <div className="category-strip-wrapper">
      <div className="category-strip">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-pill ${currentCategory === cat ? 'active' : ''}`}
            onClick={() => handleClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilterStrip;
