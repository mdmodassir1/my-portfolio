import React, { useState, useEffect, useRef } from 'react';
import './App.css';
// ADD YOUR PHOTO IMPORT HERE:
import profilePhoto from './Gemini_Generated_Image_qhbbkuqhbbkuqhbb.png';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const sectionRefs = useRef({});

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Loading simulation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  // Contact form submission handler - UPDATED WITH BETTER ERROR HANDLING
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitStatus(null);

  // Basic validation
  if (!formData.name || !formData.email || !formData.subject || !formData.message) {
    setSubmitStatus({
      type: 'error',
      message: 'Please fill in all fields'
    });
    setIsSubmitting(false);
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    setSubmitStatus({
      type: 'error',
      message: 'Please enter a valid email address'
    });
    setIsSubmitting(false);
    return;
  }

  try {
    console.log('📤 Sending form data:', formData); // Debug log

    const response = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    // Check if response is OK
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response');
    }

    const data = await response.json();

    if (data.success) {
      setSubmitStatus({
        type: 'success',
        message: 'Thank you! Your message has been sent successfully. I\'ll get back to you soon!'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } else {
      throw new Error(data.message || 'Failed to send message');
    }
    
  } catch (error) {
    console.error('❌ Contact form error:', error);
    
    // User-friendly error message
    let errorMessage = 'Failed to send message. ';
    
    if (error.message.includes('Failed to fetch')) {
      errorMessage += 'Cannot connect to server. Please make sure backend is running on port 5000.';
    } else if (error.message.includes('non-JSON')) {
      errorMessage += 'Server error. Please try again later.';
    } else if (error.message.includes('status:')) {
      errorMessage += 'Server is not responding properly.';
    } else {
      errorMessage += error.message || 'Please try again.';
    }
    
    setSubmitStatus({
      type: 'error',
      message: errorMessage
    });
  } finally {
    setIsSubmitting(false);
  }
};

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const setRef = (section) => (el) => {
    sectionRefs.current[section] = el;
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader">
          <div className="loader-circle"></div>
          <div className="pulse-ring"></div>
          <h2 className="loader-name">Md Modassir</h2>
          <p className="loader-text">Crafting Digital Experiences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Animated Background */}
      <div className="animated-bg"></div>

      {/* Navigation Bar - FIXED RESUME BUTTON */}
      <nav className="navbar glass">
        <div className="container">
          <div className="nav-brand">
            <div className="logo">
              <span className="logo-icon">⚡</span>
              <h2>Md Modassir</h2>
            </div>
          </div>
          
          <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <button 
              className={activeSection === 'home' ? 'nav-link active' : 'nav-link'} 
              onClick={() => scrollToSection('home')}
            >
              Home
            </button>
            <button 
              className={activeSection === 'about' ? 'nav-link active' : 'nav-link'} 
              onClick={() => scrollToSection('about')}
            >
              About
            </button>
            <button 
              className={activeSection === 'skills' ? 'nav-link active' : 'nav-link'} 
              onClick={() => scrollToSection('skills')}
            >
              Skills
            </button>
            <button 
              className={activeSection === 'education' ? 'nav-link active' : 'nav-link'} 
              onClick={() => scrollToSection('education')}
            >
              Education
            </button>
            <button 
              className={activeSection === 'projects' ? 'nav-link active' : 'nav-link'} 
              onClick={() => scrollToSection('projects')}
            >
              Projects
            </button>
            
            {/* FIXED RESUME BUTTON - Page reload nahi hoga */}
            <button 
              className="resume-nav-btn"
              onClick={(e) => {
                e.preventDefault();  // Page reload roktahai
                e.stopPropagation(); // Event bubbling rokta hai
                window.open('/resume.pdf.pdf', '_blank');
                return false;        // Extra safety
              }}
              type="button"
            >
              <span className="btn-text">📄 Resume</span>
              <span className="btn-icon">⬇️</span>
            </button>
            
            <button 
              className={activeSection === 'contact' ? 'nav-link active' : 'nav-link'} 
              onClick={() => scrollToSection('contact')}
            >
              Contact
            </button>
          </div>

          <div className="nav-actions">
            <div 
              className={`hamburger advanced ${isMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== HOME SECTION - 3D HERO ===== */}
      <section id="home" className="hero-3d" ref={setRef('home')}>
        <div className="hero-orbit">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="orbit-item" style={{ '--i': i }}>
              <div className="orbit-dot"></div>
            </div>
          ))}
        </div>
        
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 7}s`
            }}></div>
          ))}
        </div>
        
        <div className="container">
          <div className="hero-content-advanced">
            <div className="hero-badge">
              <span>🚀 Available for Opportunities</span>
            </div>
            
            <div className="hero-main">
              <div className="hero-text-advanced">
                <h1 className="hero-title">
                  <span className="title-line">Hi, I'm</span>
                  <span className="title-name">Md Modassir</span>
                </h1>
                <div className="hero-subtitle">
                  <span className="subtitle-text">Full Stack Developer</span>
                  <div className="typing-cursor"></div>
                </div>
                <p className="hero-description-advanced">
                  Crafting <span className="highlight">digital experiences</span> with modern technologies. 
                  Specialized in <span className="highlight">MERN Stack</span> development and 
                  creating <span className="highlight">scalable solutions</span>.
                </p>
                
                <div className="hero-stats">
                  <div className="stat">
                    <div className="stat-number"></div>
                    <div className="stat-label"></div>
                  </div>
                  <div className="stat">
                    <div className="stat-number"></div>
                    <div className="stat-label"></div>
                  </div>
                  <div className="stat">
                    <div className="stat-number"></div>
                    <div className="stat-label"></div>
                  </div>
                </div>
              </div>
              
              <div className="hero-visual">
                <div className="floating-shapes">
                  <div className="shape shape-1"></div>
                  <div className="shape shape-2"></div>
                  <div className="shape shape-3"></div>
                </div>
                
                {/* ADD YOUR PHOTO HERE - HOME PAGE */}
                <div className="home-profile-container">
                  <div className="home-profile-frame">
                    <div className="home-profile-image">
                      {/* UNCOMMENT AND USE THIS FOR YOUR ACTUAL PHOTO: */}
                      <img src={profilePhoto} alt="Md Modassir" className="home-profile-img" />
                    </div>
                    <div className="home-profile-glow"></div>
                    <div className="home-profile-orbit">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="orbit-dot" style={{ '--i': i }}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hero-actions">
              <button 
                className="btn-primary magnetic"
                onClick={() => scrollToSection('projects')}
              >
                <span className="btn-text">Explore My Work</span>
                <span className="btn-icon">🎯</span>
                <span className="magnetic-area"></span>
              </button>
              <button 
                className="btn-secondary magnetic"
                onClick={() => scrollToSection('contact')}
              >
                <span className="btn-text">Let's Connect</span>
                <span className="btn-icon">💬</span>
                <span className="magnetic-area"></span>
              </button>
            </div>
            
            <div className="scroll-indicator">
              <div className="scroll-line"></div>
              <span>Scroll to explore</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION - 3D STORY ===== */}
      <section id="about" className="about-3d" ref={setRef('about')}>
        <div className="section-particles">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 8}s`
            }}></div>
          ))}
        </div>
        
        <div className="container">
          <div className="section-header-3d">
            <div className="section-badge">01</div>
            <h2 className="section-title-3d">My Journey</h2>
            <div className="section-subtitle-3d">The story behind the code</div>
          </div>
          
          <div className="about-content-3d">
            <div className="about-visual-3d">
              {/* ADD YOUR PHOTO HERE - ABOUT PAGE */}
              <div className="about-profile-container">
                <div className="about-profile-frame">
                  <div className="about-profile-image">
                    {/* UNCOMMENT AND USE THIS FOR YOUR ACTUAL PHOTO: */}
                    <img src={profilePhoto} alt="Md Modassir" className="about-profile-img" />
                  </div>
                  <div className="about-profile-glow"></div>
                  <div className="about-profile-orbit">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="orbit-dot" style={{ '--i': i }}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="about-text-3d">
              <div className="story-timeline">
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content glass">
                    <h3>2021 - The Beginning</h3>
                    <p>Started my coding journey with basic web technologies. Fell in love with creating things that live on the internet.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content glass">
                    <h3>2022 - 2023 - Deep Dive</h3>
                    <p>Mastered JavaScript and discovered the power of React. Built my first Project .</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content glass">
                    <h3>2024 - MERN Stack</h3>
                    <p>Specialized in MongoDB, Express, React, and Node.js. Created scalable web applications with modern architecture.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content glass">
                    <h3>2025 - Beyond</h3>
                    <p>Exploring advanced concepts, contributing to open source, and ready for new challenges.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="about-stats-3d">
            <div className="stat-card-3d glass">
              <div className="stat-icon">🔥</div>
              <div className="stat-number">100+</div>
              <div className="stat-label">Hours Coding</div>
            </div>
            <div className="stat-card-3d glass">
              <div className="stat-icon">⚡</div>
              <div className="stat-number">10+</div>
              <div className="stat-label">Projects Built</div>
            </div>
            <div className="stat-card-3d glass">
              <div className="stat-icon">🚀</div>
              <div className="stat-number">10+</div>
              <div className="stat-label">Technologies</div>
            </div>
            <div className="stat-card-3d glass">
              <div className="stat-icon">💡</div>
              <div className="stat-number">∞</div>
              <div className="stat-label">Ideas</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SKILLS SECTION - 3D VISUALIZATION ===== */}
      <section id="skills" className="skills-3d" ref={setRef('skills')}>
        <div className="skills-orbit">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="orbit-item" style={{ '--i': i }}>
              <div className="orbit-tech">{['⚛️','🟨','🌐','🎨','🟢','🚂','🍃','🔗'][i]}</div>
            </div>
          ))}
        </div>
        
        <div className="container">
          <div className="section-header-3d">
            <div className="section-badge">02</div>
            <h2 className="section-title-3d">Tech Arsenal</h2>
            <div className="section-subtitle-3d">Technologies I wield with expertise</div>
          </div>
          
          <div className="skills-visualization-3d">
            <div className="skills-sphere">
              <div className="sphere-core"></div>
              {[
                { name: 'React', level: 85, icon: '⚛️', color: '#61DAFB' },
                { name: 'JavaScript', level: 80, icon: '🟨', color: '#F7DF1E' },
                { name: 'Node.js', level: 80, icon: '🟢', color: '#339933' },
                { name: 'MongoDB', level: 75, icon: '🍃', color: '#47A248' },
                { name: 'Express', level: 85, icon: '🚂', color: '#000000' },
                { name: 'HTML5', level: 90, icon: '🌐', color: '#E34F26' }
              ].map((skill, index) => (
                <div 
                  key={skill.name}
                  className="skill-orb"
                  style={{ 
                    '--index': index,
                    '--color': skill.color
                  }}
                >
                  <div className="orb-icon">{skill.icon}</div>
                  <div className="orb-glow"></div>
                </div>
              ))}
            </div>
            
            <div className="skills-details-3d">
              <div className="skills-categories-3d">
                <div className="skill-category-3d glass">
                  <div className="category-header-3d">
                    <div className="category-icon">🎨</div>
                    <h3>Frontend Mastery</h3>
                  </div>
                  <div className="skills-list-3d">
                    {[
                      { name: 'React.js', level: 85 },
                      { name: 'JavaScript (ES6+)', level: 80 },
                      { name: 'HTML5 & CSS3', level: 90 },
                      { name: 'Tailwind CSS', level: 75 }
                    ].map((skill, index) => (
                      <div key={skill.name} className="skill-item-3d">
                        <div className="skill-info-3d">
                          <span className="skill-name">{skill.name}</span>
                          <span className="skill-percent">{skill.level}%</span>
                        </div>
                        <div className="skill-bar-3d">
                          <div 
                            className="skill-progress-3d" 
                            style={{width: `${skill.level}%`}}
                            data-level={skill.level}
                          >
                            <div className="progress-sparkle"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="skill-category-3d glass">
                  <div className="category-header-3d">
                    <div className="category-icon">⚙️</div>
                    <h3>Backend Excellence</h3>
                  </div>
                  <div className="skills-list-3d">
                    {[
                      { name: 'Node.js', level: 80 },
                      { name: 'Express.js', level: 85 },
                      { name: 'MongoDB', level: 75 },
                      { name: 'REST APIs', level: 85 }
                    ].map((skill, index) => (
                      <div key={skill.name} className="skill-item-3d">
                        <div className="skill-info-3d">
                          <span className="skill-name">{skill.name}</span>
                          <span className="skill-percent">{skill.level}%</span>
                        </div>
                        <div className="skill-bar-3d">
                          <div 
                            className="skill-progress-3d" 
                            style={{width: `${skill.level}%`}}
                            data-level={skill.level}
                          >
                            <div className="progress-sparkle"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="skills-tools-3d">
                <div className="tools-header">
                  <h3>🛠️ Development Tools</h3>
                </div>
                <div className="tools-grid">
                  {['Git & GitHub', 'VS Code', 'Postman', 'NPM', 'Chrome DevTools', 'Figma', 'MongoDB Compass', 'Netlify'].map((tool, index) => (
                    <div key={tool} className="tool-item glass">
                      <span className="tool-name">{tool}</span>
                      <div className="tool-glow"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== EDUCATION SECTION - 3D TIMELINE ===== */}
      <section id="education" className="education-3d" ref={setRef('education')}>
        <div className="education-particles">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}></div>
          ))}
        </div>
        
        <div className="container">
          <div className="section-header-3d">
            <div className="section-badge">03</div>
            <h2 className="section-title-3d">Learning Path</h2>
            <div className="section-subtitle-3d">My academic and self-taught journey</div>
          </div>
          
          <div className="education-timeline-3d">
            <div className="timeline-track"></div>
            
            {[
              {
                year: '2022-2026',
                icon: '🎓',
                title: 'B.Tech Computer Science',
                institution: 'Global Group of Institutes, Amritsar',
                status: 'In Progress',
                description: 'Pursuing degree in Computer Science with focus on software engineering, algorithms, and modern web technologies.',
                achievements: ['Data Structures', 'Algorithms', 'Web Development', 'Database Systems'],
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              },
              {
                year: '2020-2022',
                icon: '📚',
                title: 'Self-Taught Development',
                institution: 'Online Platforms & Projects',
                status: 'Completed',
                description: 'Intensive self-learning through online courses, documentation, and building real-world projects.',
                achievements: ['HTML', 'CSS', 'JavaScript ES6+', 'Git & GitHub'],
                gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              },
              {
                year: '2018-2020',
                icon: '🏫',
                title: 'Intermediate (12th Grade)',
                institution: 'Bihar School Examination Board',
                status: 'Completed',
                description: 'Completed higher secondary education with focus on Science stream including Mathematics and English.',
                achievements: ['Physics', 'Chemistry', 'Mathematics', 'English'],
                gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
              },
              {
                year: '2017-2018',
                icon: '📖',
                title: 'Matriculation (10th Grade)',
                institution: 'Bihar School Examination Board',
                status: 'Completed',
                description: 'Completed secondary education with strong foundation in sciences and mathematics.',
                achievements: ['Science', 'Mathematics', 'English', 'Social Studies'],
                gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
              }
            ].map((edu, index) => (
              <div key={index} className="timeline-item-3d">
                <div className="timeline-node" style={{background: edu.gradient}}>
                  <div className="node-icon">{edu.icon}</div>
                  <div className="node-glow"></div>
                </div>
                
                <div className="timeline-content-3d glass">
                  <div className="edu-badge-3d">{edu.status}</div>
                  <div className="edu-year">{edu.year}</div>
                  <h3>{edu.title}</h3>
                  <p className="edu-institution-3d">{edu.institution}</p>
                  <p className="edu-description-3d">{edu.description}</p>
                  
                  <div className="edu-achievements">
                    {edu.achievements.map((achievement, i) => (
                      <span key={i} className="achievement-tag">{achievement}</span>
                    ))}
                  </div>
                  
                  <div className="edu-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{width: edu.status === 'In Progress' ? '70%' : '100%'}}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {edu.status === 'In Progress' ? 'In Progress (70%)' : 'Completed (100%)'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROJECTS SECTION - 3D SHOWCASE ===== */}
      <section id="projects" className="projects-3d" ref={setRef('projects')}>
        <div className="projects-orbit">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="orbit-item" style={{ '--i': i }}>
              <div className="orbit-project">🚀</div>
            </div>
          ))}
        </div>
        
        <div className="container">
          <div className="section-header-3d">
            <div className="section-badge">04</div>
            <h2 className="section-title-3d">Creative Portfolio</h2>
            <div className="section-subtitle-3d">Projects that bring ideas to life</div>
          </div>
          
          <div className="projects-showcase-3d">
            {[
              {
                title: 'E-Commerce Platform',
                description: 'A full-stack e-commerce solution with user authentication, product management, shopping cart, and payment integration.',
                image: '🛒',
                technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'JWT', 'Stripe API'],
                features: ['User Authentication', 'Product Catalog', 'Shopping Cart', 'Payment Processing', 'Order Management'],
                liveUrl: '#',
                githubUrl: '#',
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                status: 'Completed'
              },
              {
                title: 'Task Management App',
                description: 'A productivity application with drag-and-drop functionality, real-time updates, and team collaboration features.',
                image: '📋',
                technologies: ['MERN Stack', 'Socket.io', 'Material UI', 'Context API'],
                features: ['Drag & Drop', 'Real-time Sync', 'Team Collaboration', 'Progress Tracking', 'Notifications'],
                liveUrl: '#',
                githubUrl: '#',
                gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                status: 'Completed'
              },
              {
                title: 'Weather Dashboard',
                description: 'Real-time weather application with location-based forecasts, interactive charts, and severe weather alerts.',
                image: '🌤️',
                technologies: ['React', 'Chart.js', 'Weather API', 'Geolocation API'],
                features: ['Live Data', 'Interactive Charts', 'Location Search', 'Weather Alerts', '5-day Forecast'],
                liveUrl: '#',
                githubUrl: '#',
                gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                status: 'Completed'
              },
              {
                title: 'Social Media App',
                description: 'A modern social platform with real-time messaging, post sharing, and user interactions.',
                image: '💬',
                technologies: ['React Native', 'Firebase', 'Redux', 'Node.js'],
                features: ['Real-time Chat', 'Post Sharing', 'Like & Comment', 'User Profiles', 'Push Notifications'],
                liveUrl: '#',
                githubUrl: '#',
                gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                status: 'In Progress'
              }
            ].map((project, index) => (
              <div key={project.title} className="project-card-3d">
                <div className="project-header-3d" style={{background: project.gradient}}>
                  <div className="project-image">{project.image}</div>
                  <div className="project-status">{project.status}</div>
                  <div className="project-overlay-3d"></div>
                  <div className="project-glow"></div>
                </div>
                
                <div className="project-body-3d glass">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  
                  <div className="project-features-3d">
                    <h4>Key Features:</h4>
                    <div className="features-grid">
                      {project.features.map((feature, i) => (
                        <span key={i} className="feature-item">
                          <span className="feature-dot"></span>
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="project-technologies-3d">
                    <h4>Technologies:</h4>
                    <div className="tech-tags">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="project-actions-3d">
                    <button className="project-btn-3d live-demo magnetic">
                      <span className="btn-text">Live Demo</span>
                      <span className="btn-icon">🌐</span>
                      <span className="magnetic-area"></span>
                    </button>
                    <button className="project-btn-3d github magnetic">
                      <span className="btn-text">GitHub</span>
                      <span className="btn-icon">💻</span>
                      <span className="magnetic-area"></span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RESUME SECTION ===== */}
      <section id="resume" className="resume-section-3d" ref={setRef('resume')}>
        <div className="resume-particles">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 6}s`
            }}></div>
          ))}
        </div>
        
        <div className="container">
          <div className="section-header-3d">
            <div className="section-badge">05</div>
            <h2 className="section-title-3d">Professional Resume</h2>
            <div className="section-subtitle-3d">My qualifications and experience at a glance</div>
          </div>
          
          <div className="resume-content-3d">
            {/* Resume Preview Card */}
            <div className="resume-preview-card glass">
              <div className="resume-preview-header">
                <div className="resume-icon">📄</div>
                <h3>Md Modassir - Full Stack Developer</h3>
                <p>Updated: March 2026</p>
              </div>
              
              <div className="resume-preview-body">
                <div className="resume-highlights">
                  <div className="highlight-item">
                    <span className="highlight-icon">🎓</span>
                    <div className="highlight-text">
                      <strong>Education</strong>
                      <p>B.Tech Computer Science (2022-2026)</p>
                    </div>
                  </div>
                  <div className="highlight-item">
                    <span className="highlight-icon">💼</span>
                    <div className="highlight-text">
                      <strong>Experience</strong>
                      <p>Full Stack Developer | 10+ Projects</p>
                    </div>
                  </div>
                  <div className="highlight-item">
                    <span className="highlight-icon">🚀</span>
                    <div className="highlight-text">
                      <strong>Skills</strong>
                      <p>MERN Stack, JavaScript, React, Node.js</p>
                    </div>
                  </div>
                  <div className="highlight-item">
                    <span className="highlight-icon">🏆</span>
                    <div className="highlight-text">
                      <strong>Achievements</strong>
                      <p>10+ Completed Projects</p>
                    </div>
                  </div>
                </div>
                
                <div className="resume-actions">
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = '/resume.pdf.pdf';
                      link.download = 'Md_Modassir_Resume.pdf';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="resume-download-btn magnetic"
                  >
                    <span className="btn-icon">⬇️</span>
                    <span className="btn-text">Download Resume (PDF)</span>
                    <span className="magnetic-area"></span>
                  </button>
                  
                  <button 
                    onClick={() => window.open('/resume.pdf.pdf', '_blank')}
                    className="resume-view-btn magnetic"
                  >
                    <span className="btn-icon">👁️</span>
                    <span className="btn-text">View Online</span>
                    <span className="magnetic-area"></span>
                  </button>
                </div>
              </div>
              
              <div className="resume-preview-footer">
                <p>📧 faizimd57@gmail.com | 📱 +91 7033177333</p>
                <p>💻 github.com/mdmodassir | 💼 linkedin.com/in/md-modassir</p>
              </div>
            </div>
            
            {/* Resume Features Grid */}
            <div className="resume-features-grid">
              <div className="resume-feature-card glass">
                <div className="feature-icon">📊</div>
                <h4>Technical Skills</h4>
                <ul>
                  <li>React.js & Next.js</li>
                  <li>Node.js & Express</li>
                  <li>MongoDB & SQL</li>
                  <li>RESTful APIs</li>
                  <li>Tailwind CSS</li>
                </ul>
              </div>
              
              <div className="resume-feature-card glass">
                <div className="feature-icon">💼</div>
                <h4>Professional Experience</h4>
                <ul>
                  <li>Full Stack Developer (Freelance)</li>
                  <li>10+ Client Projects</li>
                  <li>Team Collaboration</li>
                  <li>Agile Methodology</li>
                </ul>
              </div>
              
              <div className="resume-feature-card glass">
                <div className="feature-icon">📜</div>
                <h4>Certifications</h4>
                <ul>
                  <li>MERN Stack Certification</li>
                  <li>JavaScript Algorithms</li>
                  <li>React Advanced Concepts</li>
                  <li>Node.js API Development</li>
                </ul>
              </div>
              
              <div className="resume-feature-card glass">
                <div className="feature-icon">🌐</div>
                <h4>Languages</h4>
                <ul>
                  <li>English (Professional)</li>
                  <li>Hindi (Native)</li>
                  <li>Urdu (Conversational)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT SECTION - 3D INTERACTIVE ===== */}
      <section id="contact" className="contact-3d" ref={setRef('contact')}>
        <div className="contact-particles">
          {[...Array(25)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${4 + Math.random() * 8}s`
            }}></div>
          ))}
        </div>
        
        <div className="container">
          <div className="section-header-3d">
            <div className="section-badge">06</div>
            <h2 className="section-title-3d">Let's Connect</h2>
            <div className="section-subtitle-3d">Ready to bring your ideas to life?</div>
          </div>
          
          <div className="contact-content-3d">
            <div className="contact-visual-3d">
              <div className="contact-sphere">
                <div className="sphere-core-contact"></div>
                {[
                  { icon: '📧', type: 'Email', info: 'faizimd57@gmail.com' },
                  { icon: '📱', type: 'Phone', info: '+91 7033177333' },
                  { icon: '💼', type: 'LinkedIn', info: 'Md Modassir' },
                  { icon: '💻', type: 'GitHub', info: 'mdmodassir' },
                 ].map((contact, index) => (
                  <div 
                    key={contact.type}
                    className="contact-orb"
                    style={{ '--index': index }}
                  >
                    <div className="orb-icon-contact">{contact.icon}</div>
                    <div className="orb-info">
                      <strong>{contact.type}</strong>
                      <span>{contact.info}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="contact-form-3d">
              <div className="form-container glass">
                <div className="form-header-3d">
                  <h3>Send Me a Message</h3>
                  <p>I'll get back to you within 24 hours</p>
                </div>
                
                <form className="advanced-form-3d" onSubmit={handleSubmit}>
                  <div className="form-grid-3d">
                    <div className="form-group-3d">
                      <input 
                        type="text" 
                        placeholder=" " 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                      <label>Your Name</label>
                      <div className="input-border-3d"></div>
                    </div>
                    
                    <div className="form-group-3d">
                      <input 
                        type="email" 
                        placeholder=" " 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                      <label>Email Address</label>
                      <div className="input-border-3d"></div>
                    </div>
                  </div>
                  
                  <div className="form-group-3d">
                    <input 
                      type="text" 
                      placeholder=" " 
                      required 
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                    <label>Subject</label>
                    <div className="input-border-3d"></div>
                  </div>
                  
                  <div className="form-group-3d">
                    <textarea 
                      placeholder=" " 
                      required 
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                    <label>Your Message</label>
                    <div className="input-border-3d"></div>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="submit-btn-3d magnetic"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="btn-spinner"></span>
                        <span className="btn-text">Sending...</span>
                      </>
                    ) : (
                      <>
                        <span className="btn-text">Send Message</span>
                        <span className="btn-icon">🚀</span>
                      </>
                    )}
                    <span className="magnetic-area"></span>
                  </button>
                  
                  {submitStatus && (
                    <div className={`submit-message ${submitStatus.type}`}>
                      {submitStatus.message}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
          
          <div className="contact-social-3d">
            <div className="social-links-3d">
              {[
                { name: '💻 GitHub', url: 'https://github.com/mdmodassir' },
                { name: '💼 LinkedIn', url: 'https://www.linkedin.com/in/md-modassir-9316702bb/' },
               { name: '📷 Instagram', url: 'https://www.instagram.com/itz_modo/?__pwa=1' }
              ].map((social, index) => (
                <a 
                  key={social.name} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link-3d magnetic"
                >
                  <span className="social-text">{social.name}</span>
                  <span className="magnetic-area"></span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="footer-3d">
        <div className="container">
          <div className="footer-content-3d">
            <div className="footer-main-3d">
              <div className="footer-brand-3d">
                <div className="footer-logo">
                  <span className="logo-icon">⚡</span>
                  <h3>Md Modassir</h3>
                </div>
                <p>Full Stack Developer crafting digital experiences with passion and precision.</p>
              </div>
              
              <div className="footer-nav-3d">
                <div className="nav-group">
                  <h4>Explore</h4>
                  {['Home', 'About', 'Skills', 'Education', 'Projects', 'Resume', 'Contact'].map((link) => (
                    <button 
                      key={link} 
                      onClick={() => scrollToSection(link.toLowerCase())}
                      className="footer-nav-button"
                    >
                      {link}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="footer-bottom-3d">
              <div className="footer-copyright">
                <p>&copy; 2024 Md Modassir. All rights reserved.</p>
                <p>Built with ❤️ using React & Node.js</p>
              </div>
              
              <button className="back-to-top-3d" onClick={() => scrollToSection('home')}>
                <span>↑</span>
                <span>Back to Top</span>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;