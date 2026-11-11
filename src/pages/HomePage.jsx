import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Clock3, Coffee } from 'lucide-react';
import { useMenuData } from '../hooks/useMenuData.js';
import { categories } from '../data/menu.js';
import { cafeHeroImage, cafeStoryImage } from '../data/images.js';
import FoodCard from '../components/menu/FoodCard.jsx';
import CategoryCard from '../components/menu/CategoryCard.jsx';

export default function HomePage() {
  const { items: dishes } = useMenuData();

  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-line" /> YOUR NEIGHBOURHOOD HIDEAWAY
          </div>
          <h1>
            Good food.
            <br />
            <em>Good mood.</em>
          </h1>
          <p>
            A cozy corner for slow mornings, long lunches, and one more cup of artisan coffee.
          </p>

          <div className="hero-buttons">
            <Link className="button button-dark" to="/menu">
              Explore the menu <ArrowRight size={17} />
            </Link>
            <a className="text-link" href="#story">
              Our little story <ArrowUpRight size={16} />
            </a>
          </div>

          <div className="social-proof">
            <div className="avatars">
              <span>R</span>
              <span>A</span>
              <span>M</span>
              <span>S</span>
            </div>
            <div>
              <div className="stars">★★★★★</div>
              <small>Loved by 10,000+ happy guests</small>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <img
            src={cafeHeroImage}
            alt="Sunlit neighborhood cafe interior"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = cafeHeroImage;
            }}
          />
          <div className="image-note">
            <span className="note-icon">
              <Coffee size={17} />
            </span>
            <span>
              Made with care,
              <br />
              <b>served with a smile.</b>
            </span>
          </div>
          <div className="open-badge">
            <span className="open-dot" /> OPEN TODAY <small>8:00 AM — 10:00 PM</small>
          </div>
        </div>
      </section>

      {/* Welcome Ribbon */}
      <section className="welcome-strip">
        <span>Seasonal ingredients</span>
        <i>✳</i>
        <span>Thoughtfully sourced</span>
        <i>✳</i>
        <span>Made fresh, every day</span>
        <i>✳</i>
        <span>A seat saved for you</span>
      </section>

      {/* Categories Section */}
      <section className="section categories-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">A LITTLE SOMETHING FOR EVERYONE</div>
            <h2>
              Find your <em>favourite.</em>
            </h2>
          </div>
          <Link className="text-link" to="/menu">
            View full menu <ArrowRight size={16} />
          </Link>
        </div>

        <div className="category-grid">
          {categories.slice(0, 4).map((c, i) => (
            <CategoryCard category={c} index={i} total={4} key={c.name} />
          ))}
        </div>
      </section>

      {/* Featured Dishes Section */}
      <section className="section featured-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">MADE FRESH, JUST FOR YOU</div>
            <h2>
              Today’s <em>favourites.</em>
            </h2>
          </div>
          <Link className="text-link" to="/menu">
            See everything <ArrowRight size={16} />
          </Link>
        </div>

        <div className="food-grid">
          {dishes
            .filter((x) => x.featured || x.popularity > 0)
            .slice(0, 4)
            .map((item, i) => (
              <FoodCard item={item} key={item.id} index={i} />
            ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section" id="story">
        <div className="story-photo">
          <img
            src={cafeStoryImage}
            alt="Warm cafe counter"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = cafeStoryImage;
            }}
          />
          <span className="story-stamp">
            EST. WITH
            <br />
            LOVE · 2019
          </span>
        </div>
        <div className="story-copy">
          <div className="eyebrow">A TABLE THAT FEELS LIKE HOME</div>
          <h2>
            Little rituals,
            <br />
            <em>big feelings.</em>
          </h2>
          <p>
            We believe the best days begin with something warm, something familiar, and a place
            that knows your name. Every cup is poured with care, every plate brings warmth, and
            there’s always room for one more friend at our table.
          </p>
          <Link className="button button-outline" to="/menu">
            Come on in <ArrowRight size={16} />
          </Link>
          <div className="handwritten">
            See you soon! <span>♡</span>
          </div>
        </div>
      </section>

      {/* Reviews / Quote Section */}
      <section className="quote-section">
        <div className="quote-mark">“</div>
        <p>
          The kind of place where your coffee arrives before you ask, and the afternoon
          disappears in the nicest way.
        </p>
        <div className="quote-author">
          <div className="stars">★★★★★</div>
          <span>MEGHA S. <i>·</i> REGULAR SINCE 2021</span>
        </div>
      </section>

      {/* Visit Section */}
      <section className="visit-section" id="visit">
        <div>
          <div className="eyebrow">YOUR CORNER OF THE CITY</div>
          <h2>
            Pop in for a <em>little pause.</em>
          </h2>
          <p>12, Rosewood Lane, Indiranagar, Bengaluru 560038</p>
        </div>
        <div className="visit-info">
          <span>
            <Clock3 size={17} /> Every day, 8am – 10pm
          </span>
          <a
            href="https://maps.google.com/?q=Indiranagar+Bengaluru"
            target="_blank"
            rel="noreferrer"
          >
            Get directions <ArrowUpRight size={15} />
          </a>
        </div>
      </section>
    </main>
  );
}
