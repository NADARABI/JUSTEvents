// src/components/Events/CategoryFilterStrip.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner'; 
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
  const [currentCategory, setCurrentCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  // Initialize category based on URL
  useEffect(() => {
    const categoryParam = new URLSearchParams(location.search).get('category');
    if (categoryParam) {
      setCurrentCategory(categoryParam);
    } else {
      setCurrentCategory('All');
    }
  }, [location.search]);

  // Handle category click
  const handleClick = (category) => {
    if (category !== currentCategory) {
      setLoading(true); // Start loading spinner
      const query = category === 'All' ? '' : `?category=${encodeURIComponent(category)}`;
      navigate(`/events${query}`);
      setCurrentCategory(category);
      setTimeout(() => setLoading(false), 800); // Mock a network request delay
    }
  };

  return (
    <div className="category-strip-wrapper">
      <div className="category-strip">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-pill ${currentCategory === cat ? 'active' : ''}`}
            onClick={() => handleClick(cat)}
            disabled={currentCategory === cat || loading} // Disable if active or loading
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="loading-wrapper">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default CategoryFilterStrip;
