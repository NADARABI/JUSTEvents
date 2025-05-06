import React from 'react';
import { useNavigate } from 'react-router-dom';
import './categoryFilterStrip.css';

const categories = ['All', 'Tech', 'Workshops', 'Clubs', 'Competitions', 'Sports', 'Health'];

const CategoryFilterStrip = () => {
  const navigate = useNavigate();

  const handleFilterClick = (category) => {
    const query = category === 'All' ? '' : `?category=${encodeURIComponent(category)}`;
    navigate(`/events${query}`);
  };

  return (
    <section className="category-strip">
      <div className="category-scroll-wrapper">
        {categories.map((cat) => (
          <button key={cat} className="category-button" onClick={() => handleFilterClick(cat)}>
            {cat}
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryFilterStrip;
