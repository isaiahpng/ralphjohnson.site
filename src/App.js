
import React, { useState, useEffect } from 'react';
import { ReactComponent as Arrow } from './arrow.svg';
import { ReactComponent as Dot } from './dot.svg';
import './App.css';
import TagList from './TagList';
import { useRef } from 'react';


function App() {
  const videoRef = useRef(null);
  const overlayRef = useRef(null);

  const [videoVisible, setVideoVisible] = useState(false);

  const handleMouseEnter = () => {
    setVideoVisible(true);

    const video = videoRef.current;
    if (video) {
      video.muted = true; // Ensures autoplay works
      video.currentTime = 0;
      video.play().catch((err) => {
        console.warn('Autoplay failed:', err);
      });
    }
  };
  ;

  const handleMouseMove = (e) => {
    if (!videoVisible) return;

    const hoveredEl = document.elementFromPoint(e.clientX, e.clientY);
    const trigger = document.getElementById('overwatchHover');
    const overlay = overlayRef.current;

    if (
      hoveredEl !== trigger &&
      !overlay?.contains(hoveredEl)
    ) {
      const video = videoRef.current;
      if (video) {
        video.pause();
      }

      setVideoVisible(false);

      // Delay resetting currentTime until fade-out is done
      setTimeout(() => {
        if (video) {
          video.currentTime = 0;
        }
      }, 1000); // match your CSS transition duration (1s)
    }
  };


  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      // Pause and "hold" the current frame (last frame)
      video.pause();

      // Prevent accidental frame jump by setting a tiny offset back from the end
      const holdFrame = () => {
        video.currentTime = Math.max(0, video.duration - 0.05);
      };

      holdFrame(); // Make sure we stay at the end

      setVideoVisible(false); // Trigger fade-out

      // After fade-out, reset completely
      setTimeout(() => {
        video.currentTime = 0;
      }, 1000); // Match your fade-out duration
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, []);



  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [activeLink, setActiveLink] = useState('about');

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      const sections = document.querySelectorAll('section');
      const handleScroll = () => {
        let current = 'about';
        sections.forEach((section) => {
          const sectionTop = section.offsetTop;
          if (mainContent.scrollTop >= sectionTop - 60) {
            current = section.getAttribute('id');
          }
        });
        setActiveLink(current);
      };
      mainContent.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        mainContent.removeEventListener('scroll', handleScroll);
      };
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleNavLinkClick = (e, sectionId) => {
    e.preventDefault();
    document.getElementById(sectionId).scrollIntoView({
      behavior: 'smooth'
    });
    setActiveLink(sectionId);
  };


  return (
    <div className="pulsing-background" onMouseMove={handleMouseMove}>
      <div
        className="cursor-light"
        style={{ left: cursorPos.x, top: cursorPos.y }}
      />
      <div className="container">
        <div className="sidebar">
          <h1>Ralph Johnson</h1>
          <h2 style={{ paddingTop: 10, paddingBottom: 20 }}>Web Developer & Media Designer</h2>
          <p>I build digital experiences through  web design,<br></br> media production, and video editing.</p><br></br><br></br><br></br><br></br>
          <nav>
            <ul>
              <li><a href="#about" onClick={(e) => handleNavLinkClick(e, 'about')} className={activeLink === 'about' ? 'active' : ''}>ABOUT</a></li>
              <li><a href="#experience" onClick={(e) => handleNavLinkClick(e, 'experience')} className={activeLink === 'experience' ? 'active' : ''}>EXPERIENCE</a></li>
              <li><a href="#projects" onClick={(e) => handleNavLinkClick(e, 'projects')} className={activeLink === 'projects' ? 'active' : ''}>PROJECTS</a></li>
            </ul>
          </nav>
        </div>

        <div
          id="videoOverlay"
          ref={overlayRef}
          className={`video-overlay ${videoVisible ? 'visible' : ''}`}
        >
          <video
            ref={videoRef}
            width="540"
            height="460"
            muted
            autoPlay
          >
            <source src="/easteregg.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Right side */}
        <div className="main-content">
          <section id="about">
            <p className="bodyText" style={{ paddingTop: 10 }}>
              I'm a developer with a background in systems engineering and a strong interest in creative tech. I graduated from the University of Houston with a degree in Computer Science and a minor in Mathematics. I enjoy working on projects that are well built and thoughtfully designed, whether it's a tool, a tutorial, or something visual.<br></br><br></br>
              In college, I was part of the <strong>marketing team</strong> for <strong>CougarCS</strong>, the largest computer science organization on campus. I created content to promote events, including <strong>video editing</strong> and some <strong>animation</strong>, which got me interested in roles that mix technical work with communication and design.<br></br><br></br>
              I've worked in higher education, taught <strong>Python</strong> to hundreds of students, and helped faculty with tools like MATLAB and Excel. I’ve also worked in <strong>IT support</strong>, managed Microsoft 365 admin environments and configured networks across Windows systems.<br></br><br></br>
              These days, I’m spending more time with tools like <strong>React</strong> (yes, this site is built with it, so if something breaks, oops), <strong>Next.js</strong>, and <strong>MySQL Workbench</strong>.  I care about building smooth, intuitive interfaces and making tech more accessible.<br></br><br></br>
              Outside of work, I like editing videos for my friends, hiking, crocheting, and playing way too much
              <strong
                id="overwatchHover"
                className="easter-trigger"
                onMouseEnter={handleMouseEnter}
              > Overwatch
              </strong>.
            </p>
          </section>

          {/* Experience */}
          <section id="experience">
            <a style={{ textDecoration: 'none' }} href="https://www.bestbuy.com/" rel="noreferrer" target="_blank">
              <div className="expBox">
                <p className="expInfo">
                  <span className="expDate">
                    2024 — PRESENT
                  </span>

                  <span className="Title" style={{ marginLeft: '-.3em' }}>
                    Consultation Agent, Geek Squad <Dot style={{ marginLeft: '3px', marginRight: '3px' }} />Best Buy Co. <Arrow className="arrow" style={{ width: '.7em', height: '.7em' }} />
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

            <a style={{ textDecoration: 'none' }} href="https://dot.egr.uh.edu/" rel="noreferrer" target="_blank">
              <div className="expBox">
                <p className="expInfo">
                  <span className="expDate">
                    2022 — 2025
                  </span>

                  <span className="Title" style={{ marginLeft: '1.5em' }}>
                    Research Assistant <Dot style={{ marginLeft: '3px', marginRight: '3px' }} />University of Houston <Arrow className="arrow" style={{ width: '.7em', height: '.7em' }} />
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

            <a style={{ textDecoration: 'none' }} href="https://dot.egr.uh.edu/departments/hdcs/externally-funded-projects/designyou-code-camp" rel="noreferrer" target="_blank">
              <div className="expBox">
                <p className="expInfo">
                  <span className="expDate">
                    2022 — 2024
                  </span>

                  <span className="Title" style={{ marginLeft: '1.3em' }}>
                    Technical Instructor <Dot style={{ marginLeft: '3px', marginRight: '3px' }} /> DesignYou! Code Camp <Arrow className="arrow" style={{ width: '.7em', height: '.7em' }} />
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

            <a style={{ textDecoration: 'none' }} href="/RalphJohnsonResume.pdf" rel="noopener noreferrer" target="_blank">
              <div className="expBox" id='resume'>
                <p className="expInfo">

                  <span className="Title">
                    View Full Resume <Arrow className="arrow" style={{ width: '.7em', height: '.7em' }} />
                  </span>
                </p>
              </div>
            </a>
          </section>

          {/* Projects */}
          <section id="projects">
            <a
              style={{ textDecoration: 'none' }}
              href="https://isaiahpng.netlify.app/"
              rel="noreferrer"
              target="_blank"
            >
              <div className="projBox">
                <img
                  src="PortfolioWebsite.jpg"
                  alt="Portfolio Website"
                  className="projImage"
                />

                <div className="expText">
                  <span className="Title" style={{ marginLeft: '-.1em' }}>
                    My First Portfolio Site <Dot style={{ marginLeft: '3px', marginRight: '3px' }} /> isaiahpng.netlify.app <Arrow className="arrow" style={{ width: '.7em', height: '.7em' }} />
                  </span>

                  <p className="expInfo">
                    <div className="expBlurb" style={{ marginLeft: '-10.5em', textDecoration: 'none' }}>
                      This was the very first website I designed and built back in 2021. While it's rough around the edges and reflects the early stages of my journey, it's also a reminder of how far I've grown as a developer and designer since then.
                    </div>
                  </p>
                </div>
              </div>
            </a>

            <a
              style={{ textDecoration: 'none' }}
              href="https://palette-picker.netlify.app/"
              rel="noreferrer"
              target="_blank"
            >
              <div className="projBox">
                <img
                  src="PaletteGenerator.jpg"
                  alt="Palette Generator"
                  className="projImage"
                />

                <div className="expText">
                  <span className="Title" style={{ marginLeft: '-.1em' }}>
                    Palette Picker <Dot style={{ marginLeft: '3px', marginRight: '3px' }} /> palette-picker.netlify.app <Arrow className="arrow" style={{ width: '.7em', height: '.7em' }} />
                  </span>

                  <p className="expInfo">
                    <div className="expBlurb" style={{ marginLeft: '-10.5em', textDecoration: 'none' }}>
                      I built Palette Picker as a quick tool to help with my own design work. It lets you mix, match, and save color palettes on the fly! 
                      <br></br><br></br>
                      Nothing fancy, just something lightweight and easy to use when I need to get ideas moving.
                    </div>
                  </p>
                </div>
              </div>
            </a>

            <a
              style={{ textDecoration: 'none' }}
              href="https://github.com/isaiahpng/covid19-predictive-modeling"
              rel="noreferrer"
              target="_blank"
            >
              <div className="projBox">
                <img
                  src="CovidModel.jpg"
                  alt="Covid Model"
                  className="projImage"
                />

                <div className="expText">
                  <span className="Title" style={{ marginLeft: '-.1em' }}>
                    Covid Predictive Model <Dot style={{ marginLeft: '3px', marginRight: '3px' }} /> github.com/isaiahpng <Arrow className="arrow" style={{ width: '.7em', height: '.7em' }} />
                  </span>

                  <p className="expInfo">
                    <div className="expBlurb" style={{ marginLeft: '-10.5em', textDecoration: 'none' }}>
                      A data analytics project I completed for a course on predictive modeling. The goal was to forecast COVID-19 case trends using real-world data and linear regression. I handled data cleaning, visualization, and model implementation, and used the project to dive deeper into time series behavior and forecasting challenges.
                      <br></br><br></br>
                      Outside of web development, I’ve developed a strong interest in data analysis and modeling — I enjoy working with messy datasets and building tools that help make complex information easier to understand.
                    </div>
                  </p>
                </div>
              </div>
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
