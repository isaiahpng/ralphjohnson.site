import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import TagList from './TagList';

function App() {
  // State for video overlay visibility
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const [videoVisible, setVideoVisible] = useState(false);

  // State for cursor position (used for desktop cursor-light)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // State for active navigation link
  const [activeLink, setActiveLink] = useState('about');

  // State to track if device is mobile (≤ 600px) for cursor vs. bouncing ball
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  // Handle mouse enter on "Overwatch" text to show Easter egg video
  const handleMouseEnter = () => {
    setVideoVisible(true);
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.currentTime = 0;
      video.play().catch((err) => console.warn('Autoplay failed:', err));
    }
  };

  // Handle mouse movement to hide video if cursor leaves trigger or overlay
  const handleMouseMove = (e) => {
    if (!videoVisible) return;

    const hoveredEl = document.elementFromPoint(e.clientX, e.clientY);
    const trigger = document.getElementById('overwatchHover');
    const overlay = overlayRef.current;

    if (hoveredEl !== trigger && !overlay?.contains(hoveredEl)) {
      const video = videoRef.current;
      if (video) video.pause();
      setVideoVisible(false);
      setTimeout(() => {
        if (video) video.currentTime = 0;
      }, 1000);
    }
  };

  // Handle video end event to reset and hide overlay
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      video.pause();
      video.currentTime = Math.max(0, video.duration - 0.05);
      setVideoVisible(false);
      setTimeout(() => {
        video.currentTime = 0;
      }, 1000);
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, []);

  // Handle cursor tracking, navigation highlighting, and mobile detection
  useEffect(() => {
    // Update cursor position for cursor-light effect on desktop
    const handleMouseMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);

    // Update isMobile state on window resize
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);

    // IntersectionObserver for highlighting nav links based on section visibility
    const mainContent = document.querySelector('.main-content');
    const sections = document.querySelectorAll('section');

    const observerOptions = {
      root: mainContent,
      rootMargin: '0px',
      threshold: 0.5, // Trigger when 50% of section is visible
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          setActiveLink(sectionId);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((section) => observer.observe(section));

    // Cleanup event listeners and observer on unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  // Handle navigation link clicks for smooth scrolling
  const handleNavLinkClick = (e, sectionId) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    const mainContent = document.querySelector('.main-content');
    if (section && mainContent) {
      const top = section.offsetTop;
      mainContent.scrollTo({ top, behavior: 'smooth' });
      setActiveLink(sectionId); // Immediately set active link
    }
  };

  return (
    <div className="pulsing-background" onMouseMove={handleMouseMove}>
      {/* Conditionally render cursor-light for desktop or bouncing-ball for mobile */}
      {isMobile ? (
        <div className="bouncing-ball" />
      ) : (
        <div className="cursor-light" style={{ left: cursorPos.x, top: cursorPos.y }} />
      )}
      <div className="container">
        <div className="sidebar">
          <h1>Ralph Johnson</h1>
          <h2>Web Developer & Media Designer</h2>
          <p>I build digital experiences through web design, media production, and video editing.</p>
          <nav>
            <ul>
              <li>
                <a
                  href="#about"
                  onClick={(e) => handleNavLinkClick(e, 'about')}
                  className={activeLink === 'about' ? 'active' : ''}
                >
                  ABOUT
                </a>
              </li>
              <li>
                <a
                  href="#experience"
                  onClick={(e) => handleNavLinkClick(e, 'experience')}
                  className={activeLink === 'experience' ? 'active' : ''}
                >
                  EXPERIENCE
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  onClick={(e) => handleNavLinkClick(e, 'projects')}
                  className={activeLink === 'projects' ? 'active' : ''}
                >
                  PROJECTS
                </a>
              </li>
            </ul>
          </nav>
          {/* Social links with embedded SVG icons, displayed horizontally at the bottom of the sidebar */}
          <div className="social-links">
            <a href="https://github.com/isaiahpng" className="github" target="_blank" rel="noreferrer" aria-label="GitHub Profile">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" className="social-icon">
                <path
                  fill="currentColor"
                  d="M36,12c13.255,0,24,10.745,24,24c0,10.656-6.948,19.685-16.559,22.818c0.003-0.009,0.007-0.022,0.007-0.022 s-1.62-0.759-1.586-2.114c0.038-1.491,0-4.971,0-6.248c0-2.193-1.388-3.747-1.388-3.747s10.884,0.122,10.884-11.491 c0-4.481-2.342-6.812-2.342-6.812s1.23-4.784-0.426-6.812c-1.856-0.2-5.18,1.774-6.6,2.697c0,0-2.25-0.922-5.991-0.922 c-3.742,0-5.991,0.922-5.991,0.922c-1.419-0.922-4.744-2.897-6.6-2.697c-1.656,2.029-0.426,6.812-0.426,6.812 s-2.342,2.332-2.342,6.812c0,11.613,10.884,11.491,10.884,11.491s-1.097,1.239-1.336,3.061c-0.76,0.258-1.877,0.576-2.78,0.576 c-2.362,0-4.159-2.296-4.817-3.358c-0.649-1.048-1.98-1.927-3.221-1.927c-0.817,0-1.216,0.409-1.216,0.876s1.146,0.793,1.902,1.659 c1.594,1.826,1.565,5.933,7.245,5.933c0.617,0,1.876-0.152,2.823-0.279c-0.006,1.293-0.007,2.657,0.013,3.454 c0.034,1.355-1.586,2.114-1.586,2.114s0.004,0.013,0.007,0.022C18.948,55.685,12,46.656,12,36C12,22.745,22.745,12,36,12z"
                />
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/ralph-uh/" className="linkedin" target="_blank" rel="noreferrer" aria-label="LinkedIn Profile">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" className="social-icon">
                <path
                  fill="currentColor"
                  d="M46.603,14C57.173,14,58,14.827,58,25.397v21.277C58,57.178,57.178,58,46.674,58H25.326C14.822,58,14,57.178,14,46.674 V25.326C14,14.822,14.822,14,25.326,14H46.603z M30.202,44.705V31.316h-4.161v13.389H30.202z M28.122,29.401 c1.337,0,2.425-1.088,2.425-2.426c0-1.337-1.088-2.425-2.425-2.425c-1.34,0-2.426,1.086-2.426,2.425S26.78,29.401,28.122,29.401z M45.812,44.705v-7.343c0-3.605-0.779-6.378-4.992-6.378c-2.024,0-3.381,1.11-3.937,2.162h-0.056v-1.829h-3.992v13.389h4.158v-6.624 c0-1.746,0.333-3.437,2.498-3.437c2.134,0,2.162,1.997,2.162,3.55v6.511H45.812z"
                />
              </svg>
            </a>
            <a href="https://discord.gg/333zay" className="discord" target="_blank" rel="noreferrer" aria-label="Discord Profile">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" className="social-icon">
                <path
                  fill="currentColor"
                  d="M54.657,19.077c0,0,8.343,9.663,8.343,27.069v3.65c0,0-10.536,6.866-13.747,6.866l-3.115-4.529 c1.936-0.867,4.577-2.372,4.577-2.372l-0.965-0.747c0,0-6.173,2.86-13.749,2.86s-13.749-2.86-13.749-2.86l-0.965,0.747 c0,0,2.641,1.505,4.577,2.372l-3.115,4.529C19.536,56.662,9,49.796,9,49.796v-3.65c0-17.406,8.343-27.069,8.343-27.069 s5.707-2.762,10.977-3.489l1.635,3.1c0,0,2.599-0.602,6.045-0.602s6.045,0.602,6.045,0.602l1.635-3.1 C48.95,16.315,54.657,19.077,54.657,19.077z M27.01,43.603c2.656,0,4.808-2.418,4.808-5.401c0-2.983-2.153-5.401-4.808-5.401 s-4.808,2.418-4.808,5.401C22.202,41.185,24.354,43.603,27.01,43.603z M44.99,43.603c2.656,0,4.808-2.418,4.808-5.401 c0-2.983-2.153-5.401-4.808-5.401c-2.656,0-4.808,2.418-4.808,5.401C40.182,41.185,42.334,43.603,44.99,43.603z"
                />
              </svg>
            </a>
          </div>
        </div>

        <div id="videoOverlay" ref={overlayRef} className={`video-overlay ${videoVisible ? 'visible' : ''}`}>
          <video ref={videoRef} muted autoPlay>
            <source src="/easteregg.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="main-content">
          <section id="about">
            <p className="bodyText">
              I'm a developer with a background in systems engineering and a strong interest in creative tech. I graduated
              from the University of Houston with a degree in Computer Science and a minor in Mathematics. I enjoy working
              on projects that are well built and thoughtfully designed, whether it's a tool, a tutorial, or something
              visual.
              <br />
              <br />
              In college, I was part of the <strong>marketing team</strong> for <strong>CougarCS</strong>, the largest
              computer science organization on campus. I created content to promote events, including{' '}
              <strong>video editing</strong> and some <strong>animation</strong>, which got me interested in roles that mix
              technical work with communication and design.
              <br />
              <br />
              I've worked in higher education, taught <strong>Python</strong> to hundreds of students, and helped faculty
              with tools like MATLAB and Excel. I’ve also worked in <strong>IT support</strong>, managed Microsoft 365 admin
              environments and configured networks across Windows systems.
              <br />
              <br />
              These days, I’m spending more time with tools like <strong>React</strong>, <strong>Next.js</strong>, and{' '}
              <strong>MySQL Workbench</strong>. I care about building smooth, intuitive interfaces and making tech more
              accessible.
              <br />
              <br />
              Outside of work, I like editing videos for my friends, hiking, crocheting, and playing way too much
              <strong id="overwatchHover" className="easter-trigger" onMouseEnter={handleMouseEnter}>
                {' '}
                Overwatch
              </strong>
              .
            </p>
          </section>

          <section id="experience">
            <a href="https://www.bestbuy.com/" rel="noreferrer" target="_blank" style={{ textDecoration: 'none' }}>
              <div className="contentBox">
                <p className="expInfo">
                  <span className="expDate">2024 — PRESENT</span>
                  <span className="titlePresent">
                    Consultation Agent, Geek Squad &middot; Best Buy Co.
                    <svg
                      width="1.9em"
                      height="1.8em"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      className="arrow"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.657 15.657L4.343 4.343m0 0h9.9m-9.9 0v9.9"
                      />
                    </svg>
                  </span>
                  <div className="expBlurb">
                    Diagnosed and resolved tech issues for 50+ clients daily, building fast, adaptable troubleshooting skills
                    across hardware, software, and networks.
                  </div>
                </p>
                <div className="tag-container">
                  <TagList tags={['Hardware Diagnostics', 'PC Repair', 'Windows', 'macOS Support', 'Customer Service']} />
                </div>
              </div>
            </a>

            <a href="https://dot.egr.uh.edu/" rel="noreferrer" target="_blank" style={{ textDecoration: 'none' }}>
              <div className="contentBox">
                <p className="expInfo">
                  <span className="expDate">2022 — 2025</span>
                  <span className="Title">
                    Research Assistant &middot; University of Houston
                    <svg
                      width="1.9em"
                      height="1.8em"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      className="arrow"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.657 15.657L4.343 4.343m0 0h9.9m-9.9 0v9.9"
                      />
                    </svg>
                  </span>
                  <div className="expBlurb">
                    Provided end-user support across software and technical platforms, with a focus on Excel, MATLAB, and
                    digital learning tools. Streamlined digital classroom management through Canvas, supporting
                    instructional delivery and technical continuity. Ensured reliable performance of lab systems by
                    diagnosing and resolving connectivity, access, and hardware issues.
                  </div>
                </p>
                <div className="tag-container">
                  <TagList tags={['MATLAB', 'RStudio', 'Excel', 'Canvas', 'BlackBoard']} />
                </div>
              </div>
            </a>

            <a
              href="https://dot.egr.uh.edu/departments/hdcs/externally-funded-projects/designyou-code-camp"
              rel="noreferrer"
              target="_blank"
              style={{ textDecoration: 'none' }}
            >
              <div className="contentBox">
                <p className="expInfo">
                  <span className="expDate">2022 — 2024</span>
                  <span className="Title">
                    Technical Instructor &middot; DesignYou! Code Camp
                    <svg
                      width="1.9em"
                      height="1.8em"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      className="arrow"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.657 15.657L4.343 4.343m0 0h9.9m-9.9 0v9.9"
                      />
                    </svg>
                  </span>
                  <div className="expBlurb">
                    Led instructional sessions in Python, JavaScript, and web development, delivering technical training in
                    collaborative virtual environments using Microsoft Teams. Supported onboarding by configuring
                    workstations and providing application and security training. Resolved AV and peripheral issues in
                    real-time to maintain seamless live coding experiences.
                  </div>
                </p>
                <div className="tag-container">
                  <TagList tags={['Python', 'JavaScript', 'React', 'Microsoft Teams', 'Live Debugging']} />
                </div>
              </div>
            </a>

            <a href="/RalphJohnsonResume.pdf" rel="noopener noreferrer" target="_blank" style={{ textDecoration: 'none' }}>
              <div className="contentBox" id="resume">
                <p className="expInfo">
                  <span className="Title">
                    View Full Resume
                    <svg
                      width="1.9em"
                      height="1.8em"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      className="arrow"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.657 15.657L4.343 4.343m0 0h9.9m-9.9 0v9.9"
                      />
                    </svg>
                  </span>
                </p>
              </div>
            </a>
          </section>

          <section id="projects">
            <a href="https://isaiahpng.netlify.app/" rel="noreferrer" target="_blank" style={{ textDecoration: 'none' }}>
              <div className="contentBox">
                <p className="projInfo">
                  <div className="projImage-container">
                    <img src="PortfolioWebsite.jpg" alt="Portfolio Website" className="projImage" />
                    <span className="projTitle">
                      My First Portfolio Site &middot; isaiahpng.netlify.app
                      <svg
                        width="1.9em"
                        height="1.8em"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        className="arrow"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.657 15.657L4.343 4.343m0 0h9.9m-9.9 0v9.9"
                        />
                      </svg>
                    </span>
                  </div>
                  <div className="projBlurb">
                    This was the very first website I designed and built back in 2021. While it's rough around the edges and
                    reflects the early stages of my journey, it's also a reminder of how far I've grown as a developer and
                    designer since then.
                  </div>
                </p>
              </div>
            </a>

            <a href="https://palette-picker.netlify.app/" rel="noreferrer" target="_blank" style={{ textDecoration: 'none' }}>
              <div className="contentBox">
                <p className="projInfo">
                  <div className="projImage-container">
                    <img src="PaletteGenerator.jpg" alt="Portfolio Website" className="projImage" />
                    <span className="projTitle">
                      Palette Picker &middot; palette-picker.netlify.app
                      <svg
                        width="1.9em"
                        height="1.8em"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        className="arrow"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.657 15.657L4.343 4.343m0 0h9.9m-9.9 0v9.9"
                        />
                      </svg>
                    </span>
                  </div>
                  <div className="projBlurb">
                    I built Palette Picker as a quick tool to help with my own design work. It lets you mix, match, and save
                    color palettes on the fly!
                    <br />
                    <br />
                    Nothing fancy, just something lightweight and easy to use when I need to get ideas moving.
                  </div>
                </p>
              </div>
            </a>

            <a
              href="https://github.com/isaiahpng/covid19-predictive-modeling"
              rel="noreferrer"
              target="_blank"
              style={{ textDecoration: 'none' }}
            >
              <div className="contentBox">
                <p className="projInfo">
                  <div className="projImage-container">
                    <img src="CovidModel.jpg" alt="Portfolio Website" className="projImage" />
                    <span className="projTitle">
                      Covid Predictive Model &middot; github.com/isaiahpng
                      <svg
                        width="1.9em"
                        height="1.8em"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        className="arrow"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.657 15.657L4.343 4.343m0 0h9.9m-9.9 0v9.9"
                        />
                      </svg>
                    </span>
                  </div>
                  <div className="projBlurb">
                    A data analytics project I completed for a course on predictive modeling. The goal was to forecast
                    COVID-19 case trends using real-world data and linear regression. I handled data cleaning,
                    visualization, and model implementation, and used the project to dive deeper into time series behavior
                    and forecasting challenges.
                    <br />
                    <br />
                    Outside of web development, I’ve developed a strong interest in data analysis and modeling — I enjoy
                    working with messy datasets and building tools that help make complex information easier to understand.
                  </div>
                </p>
              </div>
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;