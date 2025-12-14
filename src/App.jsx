import { useState, useMemo, useCallback, memo, useRef, useEffect } from 'react'
import { menuData, restaurantInfo } from './menuData'
import OptimizedImage from './OptimizedImage'
import './App.css'

const MAPS_URL = "https://maps.app.goo.gl/vfRGC8KHMorh7fKV8"

const Header = memo(function Header({ onBack, showBack, categoryName, categoryIcon }) {
  return (
    <header className="header">
      <div className="header-bg"></div>
      <div className="header-content">
        {showBack ? (
          <>
            <button className="back-btn" onClick={onBack}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <div className="page-title-wrap">
              <span className="page-icon">{categoryIcon}</span>
              <h2 className="page-title">{categoryName}</h2>
            </div>
            <div className="header-spacer"></div>
          </>
        ) : (
          <>
            <div className="logo-section">
              <div className="logo-container">
                <div className="logo-glow"></div>
                <div className="logo-ring">
                  <span className="logo-icon">☕</span>
                </div>
              </div>
              <div className="logo-text">
                <h1 className="brand-name">KADOOLI</h1>
                <span className="brand-sub">TEA PALACE</span>
              </div>
            </div>
            <a href={`tel:${restaurantInfo.phone1}`} className="call-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </a>
          </>
        )}
      </div>
    </header>
  )
})

const HeroBanner = memo(function HeroBanner() {
  return (
    <div className="hero-banner">
      <div className="hero-content">
        <div className="tagline-badge">{restaurantInfo.tagline}</div>
        
        <div className="contact-pills">
          <a href={`tel:${restaurantInfo.phone1}`} className="pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            {restaurantInfo.phone1}
          </a>
          <a href={`tel:${restaurantInfo.phone2}`} className="pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
              <line x1="12" y1="18" x2="12.01" y2="18"/>
            </svg>
            {restaurantInfo.phone2}
          </a>
        </div>

        <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="location-card">
          <div className="location-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <span className="location-text">{restaurantInfo.address}</span>
          <span className="map-btn">View Map</span>
        </a>

        <div className="features-strip">
          <div className="feature-chip"><span className="check-icon">✓</span> Free Delivery</div>
          <div className="feature-chip"><span className="check-icon">✓</span> VAT Included</div>
          <div className="feature-chip"><span className="check-icon">✓</span> Cards Accepted</div>
        </div>
      </div>
    </div>
  )
})

const CategoryCard = memo(function CategoryCard({ categoryKey, category, onClick, index }) {
  return (
    <button 
      className="category-card" 
      onClick={() => onClick(categoryKey)}
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      <div className="card-image-wrap">
        <OptimizedImage 
          src={category.image} 
          alt={category.name}
          className="card-image"
          priority={index < 4}
        />
        <div className="card-overlay"></div>
        <div className="card-badge">{category.items.length}</div>
      </div>
      <div className="card-body">
        <div className="card-text">
          <h3 className="card-title">{category.name}</h3>
          <p className="card-subtitle">{category.nameAr}</p>
        </div>
        <svg className="card-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>
    </button>
  )
})

const MenuItem = memo(function MenuItem({ item, categoryImage, index }) {
  return (
    <div className="menu-item" style={{ animationDelay: `${index * 0.03}s` }}>
      <div className="item-image-wrap">
        <OptimizedImage 
          src={item.image || categoryImage} 
          alt={item.name}
          className="item-image"
          priority={index < 6}
        />
      </div>
      <div className="item-content">
        <h3 className="item-title">{item.name}</h3>
        <p className="item-subtitle">{item.nameAr}</p>
      </div>
      <div className="item-price-tag">
        <span className="price-currency">AED</span>
        <span className="price-value">{item.price}</span>
      </div>
    </div>
  )
})

const VirtualizedItem = memo(function VirtualizedItem({ item, categoryImage, index }) {
  const [isVisible, setIsVisible] = useState(index < 9)
  const ref = useRef(null)

  useEffect(() => {
    if (isVisible || index < 9) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '400px', threshold: 0 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [isVisible, index])

  if (!isVisible) {
    return <div ref={ref} className="menu-item-placeholder" style={{ height: '88px' }} />
  }

  return (
    <MenuItem 
      item={item} 
      categoryImage={categoryImage}
      index={index} 
    />
  )
})

const CategoryPage = memo(function CategoryPage({ category }) {
  return (
    <div className="category-page">
      <div className="category-header-banner">
        <OptimizedImage 
          src={category.image} 
          alt={category.name}
          className="banner-image"
          priority={true}
        />
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <div className="banner-icon-wrap">
            <span className="banner-icon">{category.icon}</span>
          </div>
          <h2 className="banner-title">{category.name}</h2>
          <p className="banner-subtitle">{category.nameAr}</p>
          <div className="banner-count">{category.items.length} items available</div>
        </div>
      </div>
      <div className="items-container">
        {category.items.map((item, idx) => (
          <VirtualizedItem 
            key={idx} 
            item={item} 
            categoryImage={category.image}
            index={idx} 
          />
        ))}
      </div>
    </div>
  )
})

const Footer = memo(function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-glow"></div>
        <div className="footer-content">
          <div className="footer-brand-section">
            <div className="footer-logo-container">
              <div className="footer-logo-glow"></div>
              <div className="footer-logo-ring">
                <span className="footer-logo-icon">☕</span>
              </div>
            </div>
            <div className="footer-brand-text">
              <span className="footer-name">KADOOLI</span>
              <span className="footer-tagline">TEA PALACE</span>
            </div>
          </div>
          
          <div className="footer-divider">
            <div className="divider-line"></div>
            <span className="divider-icon">✦</span>
            <div className="divider-line"></div>
          </div>
          
          <p className="footer-motto">"We serve happiness!"</p>
          
          <div className="footer-contact-grid">
            <a href={`tel:${restaurantInfo.phone1}`} className="footer-contact-card">
              <div className="contact-icon-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <span>{restaurantInfo.phone1}</span>
            </a>
            <a href={`tel:${restaurantInfo.phone2}`} className="footer-contact-card">
              <div className="contact-icon-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                  <line x1="12" y1="18" x2="12.01" y2="18"/>
                </svg>
              </div>
              <span>{restaurantInfo.phone2}</span>
            </a>
          </div>
          
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="footer-location-card">
            <div className="location-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div className="location-details">
              <span className="location-label">Find Us Here</span>
              <span className="location-text">{restaurantInfo.address}</span>
            </div>
            <div className="location-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </a>
          
          <div className="footer-features">
            <div className="footer-feature">
              <span className="feature-icon">🚚</span>
              <span>Free Delivery</span>
            </div>
            <div className="footer-feature">
              <span className="feature-icon">💳</span>
              <span>Cards Accepted</span>
            </div>
            <div className="footer-feature">
              <span className="feature-icon">✅</span>
              <span>VAT Included</span>
            </div>
          </div>
          
          <p className="footer-copyright">© 2024 Kadooli Tea Palace. All Rights Reserved.</p>
        </div>
      </div>
      
      <div className="developer-section">
        <div className="dev-container">
          <div className="dev-header">
            <div className="dev-line"></div>
            <div className="dev-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
              <span>Developed By</span>
            </div>
            <div className="dev-line"></div>
          </div>
          
          <div className="dev-profile">
            <div className="dev-avatar">
              <span>MF</span>
            </div>
            <h4 className="dev-name">Malik Faisal</h4>
            <p className="dev-title">Full Stack Developer</p>
          </div>
          
          <div className="dev-contacts">
            <a href="tel:+971563111168" className="dev-contact-card">
              <div className="dev-icon-wrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                  <line x1="12" y1="18" x2="12.01" y2="18"/>
                </svg>
              </div>
              <div className="dev-contact-info">
                <span className="dev-contact-label">Phone</span>
                <span className="dev-contact-value">+971 56 311 1168</span>
              </div>
            </a>
            <a href="mailto:contact@malikfaisal.com" className="dev-contact-card">
              <div className="dev-icon-wrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div className="dev-contact-info">
                <span className="dev-contact-label">Email</span>
                <span className="dev-contact-value">contact@malikfaisal.com</span>
              </div>
            </a>
            <a href="https://www.malikfaisal.com" target="_blank" rel="noopener noreferrer" className="dev-contact-card website-card">
              <div className="dev-icon-wrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <div className="dev-contact-info">
                <span className="dev-contact-label">Website</span>
                <span className="dev-contact-value">www.malikfaisal.com</span>
              </div>
              <div className="visit-arrow">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="7" y1="17" x2="17" y2="7"/>
                  <polyline points="7 7 17 7 17 17"/>
                </svg>
              </div>
            </a>
          </div>
          
          <p className="dev-tagline">Building Digital Experiences ✨</p>
        </div>
      </div>
    </footer>
  )
})

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  
  const categories = useMemo(() => Object.entries(menuData), [])
  const totalItems = useMemo(() => 
    Object.values(menuData).reduce((sum, cat) => sum + cat.items.length, 0), 
  [])

  const handleCategoryClick = useCallback((key) => {
    setSelectedCategory(key)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const handleBack = useCallback(() => {
    setSelectedCategory(null)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <div className="app">
      <Header 
        showBack={!!selectedCategory} 
        onBack={handleBack}
        categoryName={selectedCategory ? menuData[selectedCategory].name : ''}
        categoryIcon={selectedCategory ? menuData[selectedCategory].icon : ''}
      />
      
      {!selectedCategory ? (
        <>
          <HeroBanner />
          <main className="main-content">
            <div className="section-header">
              <h2 className="section-title">Our Menu</h2>
              <div className="section-stats">
                <span className="stat"><strong>{categories.length}</strong> Categories</span>
                <span className="stat-dot"></span>
                <span className="stat"><strong>{totalItems}</strong> Items</span>
              </div>
            </div>
            <div className="categories-grid">
              {categories.map(([key, category], index) => (
                <CategoryCard 
                  key={key}
                  categoryKey={key}
                  category={category}
                  onClick={handleCategoryClick}
                  index={index}
                />
              ))}
            </div>
          </main>
        </>
      ) : (
        <CategoryPage category={menuData[selectedCategory]} />
      )}
      
      <Footer />
    </div>
  )
}

export default App
