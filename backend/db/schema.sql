CREATE DATABASE prarthana_portfolio;

\c prarthana_portfolio;

DROP TABLE IF EXISTS admin CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS experience CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS social_links CASCADE;

CREATE TABLE admin (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  technologies TEXT[],
  achievements TEXT,
  github_link VARCHAR(255),
  live_link VARCHAR(255),
  image_url VARCHAR(255),
  document_url VARCHAR(255),
  is_featured BOOLEAN DEFAULT false,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(255),
  description TEXT,
  proficiency_level VARCHAR(255),
  organization VARCHAR(255),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE certificates (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  platform VARCHAR(100),
  description TEXT,
  issued_date DATE,
  credential_url VARCHAR(255),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE experience (
  id SERIAL PRIMARY KEY,
  job_title VARCHAR(100) NOT NULL,
  company VARCHAR(100) NOT NULL,
  location VARCHAR(100),
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  icon VARCHAR(50),
  image_url VARCHAR(255),
  offer_letter VARCHAR(255),
  completion_certificate VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  date_achieved DATE,
  icon VARCHAR(50),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE site_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE social_links (
  id SERIAL PRIMARY KEY,
  platform VARCHAR(50) UNIQUE NOT NULL,
  url VARCHAR(255) NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Seed Data

-- Admin Account (password: admin123)
INSERT INTO admin (username, password) VALUES
('admin', '$2b$10$H9cm1ozBDlYoW9fpNRcYpuZKtouYxnMETIUWe5V8L6zOnq6h044kC');

-- Site Settings
INSERT INTO site_settings (key, value) VALUES
('hero_title', 'Hi, I''m Prarthana Bhandari'),
('hero_subtitle', 'Full Stack Developer'),
('hero_description', 'Passionate Full Stack Developer who loves building user-friendly web applications and solving real-world problems.'),
('about_text', 'I am Prarthana Bhandari, an MCA student with a passion for full-stack web development. I enjoy turning ideas into beautiful, functional web experiences with clean design and smooth animations.'),
('years_experience', '2'),
('projects_count', '10'),
('certificates_count', '4');

-- Social Links
INSERT INTO social_links (platform, url) VALUES
('github', 'https://github.com/prarthanabhandari'),
('linkedin', 'https://www.linkedin.com/in/prarthana-bhandari-ab2a5a293/'),
('youtube', 'https://youtube.com/@prarthana'),
('instagram', 'https://instagram.com/prarthana');

-- Skills
INSERT INTO skills (name, icon, description, proficiency_level, organization, is_featured) VALUES
('Python', 'logos:python', 'General-purpose programming language for scripting, machine learning, and automation.', 'Intermediate', 'K.B.Joshi Institute of IT', true),
('JavaScript', 'logos:javascript', 'Web development scripting language used across both frontend and backend stacks.', 'Advanced', 'Self-taught', true),
('Java', 'logos:java', 'Core Java programming language and object-oriented principles.', 'Intermediate', 'Oracle Academy', true),
('Node.js', 'logos:nodejs-icon', 'Asynchronous event-driven JavaScript runtime environment for scalable backends.', 'Advanced', 'Self-taught', true),
('Express.js', 'simple-icons:express', 'Minimalist web application framework for Node.js REST API creation.', 'Advanced', 'Self-taught', true),
('React.js', 'logos:react', 'Component-based UI library for creating single-page web applications.', 'Advanced', 'Self-taught', true),
('PostgreSQL', 'logos:postgresql', 'Powerful, open-source object-relational database system.', 'Intermediate', 'K.B.Joshi Institute of IT', true),
('MongoDB', 'logos:mongodb-icon', 'Document-oriented database for modern MERN-stack applications.', 'Intermediate', 'Self-taught', true),
('Git & GitHub', 'logos:git-icon', 'Distributed version control systems for tracking changes in code.', 'Advanced', 'Self-taught', true),
('RESTful APIs', 'carbon:api', 'Designing and implementing structured REST API endpoints for secure frontend-backend communication.', 'Advanced', 'Graphura India Pvt. Ltd.', true),
('Bootstrap', 'logos:bootstrap', 'Responsive CSS framework for rapid and clean mobile-first web interface development.', 'Advanced', 'Self-taught', true),
('SQL & Database Design', 'dashicons:database', 'Relational database querying, schema design, normalization, and optimization.', 'Intermediate', 'K.B.Joshi Institute of IT', true),
('Agile Development', 'carbon:recycle', 'Software development practices focusing on iterative progress, team collaboration, and adaptability.', 'Intermediate', 'Self-taught', false);

-- Projects
INSERT INTO projects (title, description, technologies, github_link, live_link, is_featured, start_date, end_date) VALUES
('BookVerse - Book Review & Community Platform', 'BookVerse is a web-based community platform designed to simplify the way users explore, review, and manage books. Users can write reviews, rate books, and discuss in a community-driven environment.', ARRAY['Node.js', 'Express.js', 'PostgreSQL', 'JavaScript', 'HTML5', 'CSS3'], 'https://github.com/prarthanabhandari/BookVerse-Book-Review-Community-Platform', NULL, true, '2026-05-01', '2026-06-16'),
('Bookida - Book Review Platform', 'A digital book review and community forum where readers can catalog books, create custom reading lists, and publish detailed reviews.', ARRAY['JavaScript', 'Node.js', 'Express.js', 'PostgreSQL', 'HTML5', 'CSS3'], 'https://github.com/prarthanabhandari/-BOOKIDA-Book-Review-Community-Platform', NULL, false, '2026-04-01', '2026-04-24'),
('Bookida Web App', 'A simplified web interface for Bookida, a platform to discover, review, and catalog books.', ARRAY['JavaScript', 'Node.js', 'Express.js', 'HTML5', 'CSS3'], 'https://github.com/prarthanabhandari/Bookida', NULL, false, '2026-04-01', '2026-04-24'),
('First Contributions (Forked)', 'A contribution to the open source community, helping beginners understand Git workflow and complete their first pull request.', ARRAY['Git', 'GitHub', 'Markdown'], 'https://github.com/prarthanabhandari/first-contributions', NULL, false, '2026-04-01', '2026-04-21'),
('Research Paper Archive', 'A repository tracking research materials, summaries, and paper analyses for academic projects.', ARRAY['Markdown', 'LaTeX', 'Research'], 'https://github.com/prarthanabhandari/Reaserch-Paper', NULL, false, '2026-04-01', '2026-04-20'),
('Udemy Certifications', 'A centralized repository showcasing course certificates, practice exercises, and study guides completed on Udemy.', ARRAY['HTML5', 'CSS3', 'JavaScript'], 'https://github.com/prarthanabhandari/Certificate_Udemy', NULL, false, '2026-04-01', '2026-04-20'),
('Keeper App', 'A Google Keep clone built using React.js to add, organize, and delete quick notes with an interactive user interface.', ARRAY['React.js', 'JavaScript', 'HTML5', 'CSS3'], 'https://github.com/prarthanabhandari/Keeper-App', NULL, false, '2026-04-01', '2026-04-20'),
('Parts of Speech (POS) Tagging', 'An interactive tool designed to help language learners identify and tag parts of speech in sentences.', ARRAY['JavaScript', 'HTML5', 'CSS3'], 'https://github.com/prarthanabhandari/PosTagginig', NULL, false, '2026-04-01', '2026-04-19'),
('MERN Restaurant Website', 'A modern, responsive restaurant website featuring online reservation management, dynamic digital menus, and interactive user reviews.', ARRAY['React.js', 'Vite', 'Node.js', 'Express.js', 'MongoDB', 'CSS3'], 'https://github.com/prarthanabhandari/MERN_PROJECT', NULL, true, '2026-03-01', '2026-04-19'),
('Dice Game', 'A classic two-player interactive Dice Game. Play by rolling the dice to compete and determine the winner using random number generation.', ARRAY['HTML5', 'CSS3', 'JavaScript'], 'https://github.com/prarthanabhandari/Dice-Game-', NULL, false, '2026-04-01', '2026-04-19'),
('Flag Quiz Game', 'An educational game testing players on world flags. Built using Node.js, Express, EJS templating, and PostgreSQL to track scores and flags.', ARRAY['Node.js', 'Express.js', 'EJS', 'PostgreSQL', 'CSS3'], 'https://github.com/prarthanabhandari/Flag-Quiz-Project', NULL, true, '2026-04-01', '2026-04-19'),
('Family Travel Tracker', 'A full-stack tracking application allowing family members to log visited countries and visualize them on an interactive world map.', ARRAY['Node.js', 'Express.js', 'EJS', 'PostgreSQL', 'JavaScript', 'CSS3'], 'https://github.com/prarthanabhandari/Family-Travel-Tracker', NULL, true, '2026-03-01', '2026-04-19'),
('Simple Chatbot', 'A lightweight web-based chatbot assistant that answers queries with pre-programmed smart responses and micro-animations.', ARRAY['HTML5', 'CSS3', 'JavaScript'], 'https://github.com/prarthanabhandari/ChatBot', NULL, false, '2026-04-01', '2026-04-18'),
('Permalist To-Do App', 'A persistent To-Do list manager featuring CRUD operations, integrated with a PostgreSQL database to save items across sessions.', ARRAY['Node.js', 'Express.js', 'EJS', 'PostgreSQL', 'CSS3'], 'https://github.com/prarthanabhandari/Permalist', NULL, false, '2026-04-01', '2026-04-18'),
('GeoQuiz World Capitals', 'A geography quiz application testing world capital knowledge. Built for learning database queries, Express backend routing, and user session scoring.', ARRAY['Node.js', 'Express.js', 'EJS', 'PostgreSQL', 'CSS3'], 'https://github.com/prarthanabhandari/GeoQuiz', NULL, false, '2026-04-01', '2026-04-18'),
('Drum Kit Website', 'An interactive drum kit simulator. Trigger realistic drum sounds using mouse clicks or keyboard keys for an engaging audio experience.', ARRAY['HTML5', 'CSS3', 'JavaScript'], 'https://github.com/prarthanabhandari/Drump-Kit', NULL, false, '2026-04-01', '2026-04-18'),
('Simon Memory Game', 'The classic Simon memory game that challenges users to repeat increasingly complex patterns of colors and sounds.', ARRAY['HTML5', 'CSS3', 'JavaScript', 'jQuery'], 'https://github.com/prarthanabhandari/Simon-Game', NULL, false, '2026-04-01', '2026-04-16'),
('Terminal Story Project', 'A terminal-based adventure story game using basic command line navigation and standard input stream control.', ARRAY['Bash', 'Shell', 'Command Line'], 'https://github.com/prarthanabhandari/Story', NULL, false, '2026-02-01', '2026-02-17'),
('QR Code Generator', 'A handy tool that converts input URLs or text strings into custom QR code images instantly.', ARRAY['Node.js', 'JavaScript', 'HTML5', 'CSS3'], 'https://github.com/prarthanabhandari/QR-Generator', NULL, false, '2026-02-01', '2026-02-14'),
('Name Letter Counter', 'A simple web tool that calculates and displays the count of letters in a user''s name dynamically.', ARRAY['Node.js', 'Express.js', 'EJS', 'CSS3'], 'https://github.com/prarthanabhandari/Name-Letter-Count', NULL, false, '2026-02-01', '2026-02-14'),
('Personal Portfolio Website', 'A responsive developer portfolio showing personal resume details, skills, experience, and contact forms.', ARRAY['HTML5', 'CSS3', 'JavaScript'], 'https://github.com/prarthanabhandari/portfolio', NULL, false, '2025-06-01', '2025-07-05');

-- Update BookVerse with full README specifications
UPDATE projects 
SET description = 'A full-stack book review and community platform featuring three user roles: Guests (browse, read, search, and submit reviews), Members (manage personal dashboards, edit own reviews, profile pages, and like/comment on posts), and Admins (moderate reviews, manage platform users, view contact messages, and analyze registration distributions via Chart.js). Supports dynamic category feeds, full-text exploration searches, month-based archives, and an ISBN cover fetch integration powered by the Open Library API.',
    achievements = 'Developed a weighted book quality score algorithm sorting entries by average ratings, total comment volumes, and like counts. Implemented a zero-flicker CSS theme preset system (Classic Brown, Retro Blue, Sunset Warm, Vintage Earth), Chart.js data visualizations for admin tracking, and secure JWT/bcrypt authentication middleware.'
WHERE title = 'BookVerse - Book Review & Community Platform';

-- Certificates
INSERT INTO certificates (title, platform, description, issued_date, credential_url) VALUES
('The Complete Full-Stack Web Development Bootcamp', 'Udemy', 'Full-stack course covering HTML, CSS, JavaScript, React, Node.js, Express, and Databases.', '2026-03-01', 'https://udemy.com'),
('Machine Learning with Python', 'LinkedIn Learning', 'Covers foundational machine learning models, regression, classification, and clustering with Python.', '2026-01-01', 'https://linkedin.com'),
('Core Java - Oracle Certified Associate', 'Oracle', 'Certified Java SE Programmer path covering types, controls, arrays, and OOP.', '2025-06-01', 'https://oracle.com'),
('Data Science 360', 'Rubicon Foundation + Nasscom Foundation', 'Professional data science fundamentals, data processing, and analysis techniques.', '2025-03-01', 'https://nasscom.in');

-- Experience
INSERT INTO experience (job_title, company, location, description, start_date, end_date, is_current, icon) VALUES
('Back-end Developer Intern', 'Graphura India Pvt. Ltd.', 'Pune', 'Building RESTful APIs using Node.js and Express.js for web-based enterprise applications. Integrating database schemas and managing server connections.', '2026-04-01', NULL, true, 'briefcase'),
('MERN Stack Developer Intern', 'Codec Technologies Pvt. Ltd.', 'Pune', 'Completed a 3-month AICTE & ICAC-approved internship program. Worked on MERN stack development (MongoDB, Express.js, React.js, Node.js). Designed responsive dashboards.', '2026-02-01', '2026-05-01', false, 'briefcase');

-- Achievements
INSERT INTO achievements (title, description, category, date_achieved, icon) VALUES
('1st Prize - Blind Coding Competition', 'Won the 1st Prize in the Blind Coding Competition held at K.B.Joshi Institute of Information Technology, Pune.', 'Competition', '2023-01-15', 'award'),
('Japanese Language Certificate (N5 Level)', 'Passed the Japanese Language Proficiency Test (JLPT) at N5 Level from Sumati Deshmukh Institute of Foreign Language.', 'Language', '2023-07-01', 'translate'),
('Avishkar Award', 'Received the prestigious Avishkar Award (2021-2022) for achieving 3rd Rank in BCA during the 2nd Semester.', 'Award', '2022-06-01', 'star');

CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  category VARCHAR(100),
  tags TEXT[],
  image_url VARCHAR(255),
  video_url VARCHAR(255),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);