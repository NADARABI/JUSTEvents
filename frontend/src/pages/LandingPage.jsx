// src/pages/LandingPage.jsx
import React from 'react';
import './landingPage.css';
import HeroCarousel from '../components/Landing/HeroCarousel.jsx';
import Footer from '../components/common/Footer.jsx';
import NavBar from '../components/common/NavBar.jsx';
import CategoryFilterStrip from '../components/Landing/CategoryFilterStrip';
import FeaturedEventsSection from '../components/Landing/FeaturedEventsSection';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <NavBar />

      {/* Hero Carousel Section */}
      <section className="hero-carousel-section">
        <HeroCarousel />
      </section>
      <CategoryFilterStrip />
      <FeaturedEventsSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
