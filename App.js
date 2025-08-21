import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import TagList from './TagList';

function App() {
  const videoRef = useRef(null);
  const overlayRef = useRef(null);

  const [videoVisible, setVideoVisible] = useState(false);

  const handleMouseEnter = () => {
    setVideoVisible(true);
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.currentTime = 0;
      video.play().catch((err) => console.warn('Autoplay failed:', err));
    }
  };

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

  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [activeLink, setActiveLink] = useState('about');

  useEffect(() => {
    const handleMouseMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);

    const mainContent = document.querySelector('.main-content');
    const sections = document.querySelectorAll('section');

    const handleScroll = () => {
      let current = 'about';
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sidebarWidth = document.querySelector('.sidebar')?.offsetWidth || 0;
        const adjustedTop = rect.top - sidebarWidth; // optional tweak if sidebar overlaps
        if (adjustedTop >= 0 && adjustedTop < window.innerHeight / 2) {
          current = section.getAttribute('id');
        }
      });
      setActiveLink(current);
    };

    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mainContent) {
        mainContent.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleNavLinkClick = (e, sectionId) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    const mainContent = document.querySelector('.main-content');
    if (section && mainContent) {
      const top = section.offsetTop;
      mainContent.scrollTo({ top, behavior: 'smooth' });
      setActiveLink(sectionId); // immediate update

      // Force scroll spy to re-run after scroll finishes
      setTimeout(() => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
          setActiveLink(sectionId);
        }
      }, 500); // adjust delay if needed
    }
  };

  return (
    <div className="pulsing-background" onMouseMove={handleMouseMove}>
      <div
        className="cursor-light"
        style={{ left: cursorPos.x, top: cursorPos.y }}
      />
      {/* LEFT SIDE */}
      <div className="container">
        <div className="sidebar">
          <h1>Ralph Johnson</h1>
          <h2>Web Developer & Media Designer</h2>
          <p>I build digital experiences through web design, media production, and video editing.</p>
          <nav>
            <ul>
              <li><a href="#about" onClick={(e) => handleNavLinkClick(e, 'about')} className={activeLink === 'about' ? 'active' : ''}>ABOUT</a></li>
              <li><a href="#experience" onClick={(e) => handleNavLinkClick(e, 'experience')} className={activeLink === 'experience' ? 'active' : ''}>EXPERIENCE</a></li>
              <li><a href="#projects" onClick={(e) => handleNavLinkClick(e, 'projects')} className={activeLink === 'projects' ? 'active' : ''}>PROJECTS</a></li>
            </ul>
          </nav>
        </div>

        {/* RIGHT SIDE */}
        <div id="videoOverlay" ref={overlayRef} className={`video-overlay ${videoVisible ? 'visible' : ''}`}>
          <video ref={videoRef} muted autoPlay>
            <source src="/easteregg.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* MAIN BLURB */}
        <div className="main-content">
          <section id="about">
            <p className="bodyText">
              I'm a developer with a background in systems engineering and a strong interest in creative tech. I graduated from the University of Houston with a degree in Computer Science and a minor in Mathematics. I enjoy working on projects that are well built and thoughtfully designed, whether it's a tool, a tutorial, or something visual.<br /><br />
              In college, I was part of the <strong>marketing team</strong> for <strong>CougarCS</strong>, the largest computer science organization on campus. I created content to promote events, including <strong>video editing</strong> and some <strong>animation</strong>, which got me interested in roles that mix technical work with communication and design.<br /><br />
              I've worked in higher education, taught <strong>Python</strong> to hundreds of students, and helped faculty with tools like MATLAB and Excel. I’ve also worked in <strong>IT support</strong>, managed Microsoft 365 admin environments and configured networks across Windows systems.<br /><br />
              These days, I’m spending more time with tools like <strong>React</strong>, <strong>Next.js</strong>, and <strong>MySQL Workbench</strong>. I care about building smooth, intuitive interfaces and making tech more accessible.<br /><br />
              Outside of work, I like editing videos for my friends, hiking, crocheting, and playing way too much
              <strong id="overwatchHover" className="easter-trigger" onMouseEnter={handleMouseEnter}> Overwatch</strong>.
            </p>
          </section>

          {/* EXPERIENCE SECTION */}
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
                    Diagnosed and resolved tech issues for 50+ clients daily, building fast, adaptable troubleshooting skills across hardware, software, and networks.
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
                    <svg width="1.9em" height="1.8em" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none" className="arrow">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.657 15.657L4.343 4.343m0 0h9.9m-9.9 0v9.9" />
                    </svg>
                  </span>
                  <div className="expBlurb">
                    Provided end-user support across software and technical platforms, with a focus on Excel, MATLAB, and digital learning tools. Streamlined digital classroom management through Canvas, supporting instructional delivery and technical continuity. Ensured reliable performance of lab systems by diagnosing and resolving connectivity, access, and hardware issues.
                  </div>
                </p>
                <div className="tag-container">
                  <TagList tags={['MATLAB', 'RStudio', 'Excel', 'Canvas', 'BlackBoard']} />
                </div>
              </div>
            </a>

            <a href="https://dot.egr.uh.edu/departments/hdcs/externally-funded-projects/designyou-code-camp" rel="noreferrer" target="_blank" style={{ textDecoration: 'none' }}>
              <div className="contentBox">
                <p className="expInfo">
                  <span className="expDate">2022 — 2024</span>
                  <span className="Title">
                    Technical Instructor &middot; DesignYou! Code Camp
                    <svg width="1.9em" height="1.8em" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none" className="arrow">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.657 15.657L4.343 4.343m0 0h9.9m-9.9 0v9.9" />
                    </svg>
                  </span>
                  <div className="expBlurb">
                    Led instructional sessions in Python, JavaScript, and web development, delivering technical training in collaborative virtual environments using Microsoft Teams. Supported onboarding by configuring workstations and providing application and security training. Resolved AV and peripheral issues in real-time to maintain seamless live coding experiences.
                  </div>
                </p>
                <div className="tag-container">
                  <TagList tags={['Python', 'JavaScript', 'React', 'Microsoft Teams', 'Live Debugging']} />
                </div>
              </div>
            </a>

            <a href="/RalphJohnsonResume.pdf" rel="noopener noreferrer" target="_blank" style={{ textDecoration: 'none' }}>
              <div className="contentBox" id='resume'>
                <p className="expInfo">
                  <span className="Title">
                    View Full Resume
                    <svg width="1.9em" height="1.8em" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none" className="arrow">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.657 15.657L4.343 4.343m0 0h9.9m-9.9 0v9.9" />
                    </svg>
                  </span>
                </p>
              </div>
            </a>
          </section>
          {/* PROJECTS SECTION */}
          <section id="projects">
            <a href="https://isaiahpng.netlify.app/" rel="noreferrer" target="_blank" style={{ textDecoration: 'none' }}>
              <div className="contentBox">
                <p className="projInfo">
                  <div className="projImage-container">
                    <img src="PortfolioWebsite.jpg" alt="Portfolio Website" className="projImage" />
                    <span className="projTitle">
                      My First Portfolio Site &middot; isaiahpng.netlify.app
                      <svg width="1.9em" height="1.8em" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none" className="arrow">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.657 15.657L4.343 4.343m0 0h9.9m-9.9 0v9.9" />
                      </svg>
                    </span>
                  </div>
                  <div className="projBlurb">
                    This was the very first website I designed and built back in 2021. While it's rough around the edges and reflects the early stages of my journey, it's also a reminder of how far I've grown as a developer and designer since then.
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
                      <svg width="1.9em" height="1.8em" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none" className="arrow">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.657 15.657L4.343 4.343m0 0h9.9m-9.9 0v9.9" />
                      </svg>
                    </span>
                  </div>
                  <div className="projBlurb">
                    I built Palette Picker as a quick tool to help with my own design work. It lets you mix, match, and save color palettes on the fly!
                    <br></br><br></br>
                    Nothing fancy, just something lightweight and easy to use when I need to get ideas moving.
                  </div>
                </p>
              </div>
            </a>

            <a href="https://github.com/isaiahpng/covid19-predictive-modeling" rel="noreferrer" target="_blank" style={{ textDecoration: 'none' }}>
              <div className="contentBox">
                <p className="projInfo">
                  <div className="projImage-container">
                    <img src="CovidModel.jpg" alt="Portfolio Website" className="projImage" />
                    <span className="projTitle">
                      Covid Predictive Model &middot; github.com/isaiahpng
                      <svg width="1.9em" height="1.8em" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none" className="arrow">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.657 15.657L4.343 4.343m0 0h9.9m-9.9 0v9.9" />
                      </svg>
                    </span>
                  </div>
                  <div className="projBlurb">
                    A data analytics project I completed for a course on predictive modeling. The goal was to forecast COVID-19 case trends using real-world data and linear regression. I handled data cleaning, visualization, and model implementation, and used the project to dive deeper into time series behavior and forecasting challenges.
                    <br></br><br></br>
                    Outside of web development, I’ve developed a strong interest in data analysis and modeling — I enjoy working with messy datasets and building tools that help make complex information easier to understand.
                  </div>
                </p>
              </div>
            </a>
          </section>
        </div >
      </div >
    </div >
  );
}

export default App;
