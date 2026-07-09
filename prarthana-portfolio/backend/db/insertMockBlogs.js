const pool = require('../config/db')

const blogsData = [
  {
    title: "Building Fluid Layouts: The Art of Glassmorphism and Micro-Animations",
    summary: "Explore the design principles of glassmorphism, depth, and fluid motion-driven micro-animations in React, using CSS gradients, backdrop filters, and Framer Motion.",
    content: `# Building Fluid Layouts: The Art of Glassmorphism and Micro-Animations

In modern web design, building layouts that feel alive and premium is key to captivating users. Two concepts that achieve this beautifully are **Glassmorphism** and **Micro-Animations**. 

In this article, we'll dive deep into how to implement these designs using standard CSS and React's leading animation library: **Framer Motion**.

---

## What is Glassmorphism?
Glassmorphism is a design trend characterized by a translucent, glass-like appearance. It relies on a combination of:
1. **Translucency** (using opacity and HSL/RGBA backgrounds)
2. **Backdrop blur** (blurring the background elements behind the element)
3. **Subtle borders** (simulating light reflection on glass edges)
4. **Multi-layered shadows** (creating depth)

### The Glassmorphic CSS Formula
To create a true glassmorphic card, you can use the following CSS declaration:

\`\`\`css
.glass-card {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.08);
}
\`\`\`

---

## Adding Micro-Animations with Framer Motion
Static elements can feel sterile. Adding subtle micro-animations (like hovering effects, scaling, and organic floats) makes the interface interactive and responsive.

### Defining React Variants
Here is how you can set up a hovering glassmorphic card in React:

\`\`\`jsx
import { motion } from 'framer-motion';

const GlassCard = ({ children }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 20 
      }}
      className="glass-card"
      style={{ padding: '2rem' }}
    >
      {children}
    </motion.div>
  );
};
\`\`\`

### Guidelines for Micro-Animations
- **Keep it subtle**: Scale changes should be between 2% and 5% (e.g., \`scale: 1.02\` to \`1.05\`). Large scales feel jarring.
- **Fast transitions**: Keep duration under \`0.3s\` for hover responses. Users expect immediate visual feedback.
- **Organic springs**: Use spring physics rather than linear timing to mimic real-world materials.

---

## Conclusion
Combining a glassmorphic aesthetic with micro-animations produces web apps that feel extremely polished and state-of-the-art. Try adding these subtle interactions to your layouts and watch your user engagement soar!`,
    category: "Web Design",
    tags: ["design", "frontend", "react", "css"],
    image_url: "/uploads/glassmorphism_design_1781672342351.png",
    video_url: null,
    is_published: true
  },
  {
    title: "PostgreSQL Query Optimization: Scaling Database Performance for Modern APIs",
    summary: "A deep dive into writing high-performance SQL queries in PostgreSQL, understanding Indexes, analyzing execution plans, and managing connection pool sizing.",
    content: `# PostgreSQL Query Optimization: Scaling Database Performance for Modern APIs

As your application grows, the database often becomes the primary bottleneck. A poorly written query or a missing index can turn a sub-millisecond API call into a multi-second crawl. 

In this article, we'll explore concrete ways to locate slow queries, optimize them using indexes, and tune connection settings in PostgreSQL.

---

## 1. Finding Bottlenecks with EXPLAIN ANALYZE
Before changing anything, you must measure. PostgreSQL provides the \`EXPLAIN\` and \`EXPLAIN ANALYZE\` commands to inspect how the database plans to run your query.

\`\`\`sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
\`\`\`

Look for these red flags in the output:
- **Seq Scan**: Sequential Scan. This means PostgreSQL had to read the *entire table* line-by-line because no index was matching.
- **Cost / Time**: Compare the startup cost vs. total cost to identify which sub-operations are expensive.

---

## 2. Speeding Up Searches with B-Tree Indexes
Creating indexes is the easiest way to optimize lookups. By default, PostgreSQL uses B-Tree indexes, which are ideal for equality and range queries.

\`\`\`sql
-- Single column index
CREATE INDEX idx_users_email ON users(email);

-- Composite index for multi-column queries
CREATE INDEX idx_projects_status_date ON projects(status, created_at DESC);
\`\`\`

> [!NOTE]
> Indexes speed up read operations but slow down write operations (INSERT, UPDATE, DELETE) since the index must also be updated. Use them strategically.

---

## 3. Node.js Connection Pool Tuning
When writing API backend services, matching database connection pools is crucial. Reusing connections avoids the overhead of establishing a new TCP handshake for every request.

Using the \`pg\` library in Node:

\`\`\`javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,              // Limit the pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
\`\`\`

- **max**: Calculate based on your server capacity. A rule of thumb is \`(2 * CPU cores) + disk speed factor\`. Setting this too high consumes database memory and leads to connection starvation.

---

## Conclusion
Database tuning is an iterative process. Keep querying performance logs, use indexes appropriately, monitor sequential scans, and design your schemas for the queries they will serve.`,
    category: "Backend",
    tags: ["database", "postgres", "sql", "performance"],
    image_url: "/uploads/postgres_scaling_1781672356044.png",
    video_url: null,
    is_published: true
  },
  {
    title: "Neural Networks Demystified: An MCA Student's Practical Guide to Machine Learning",
    summary: "An intuitive guide explaining how neural networks learn, mapping abstract math back to codebase terms, and training a basic classifier using Python.",
    content: `# Neural Networks Demystified: An MCA Student's Practical Guide to Machine Learning

Neural networks are at the core of today's Artificial Intelligence boom. Yet, for many students, they can feel like a black box filled with complex mathematics. 

Let's break down the basic components of neural networks, map the terminology to regular programming concepts, and write a simple classifier from scratch in Python.

---

## Understanding the Core Components

A neural network is inspired by the human brain. It consists of layers of interconnected nodes (neurons):

1. **Neurons (Nodes)**: Holding units that contain numerical values.
2. **Weights**: Factors that determine the strength of connection between two neurons. (Think of it as the importance of a feature).
3. **Biases**: Shifts applied to the sum, allowing the network to fit models that don't pass through the origin.
4. **Activation Functions**: Non-linear functions (like ReLU or Sigmoid) that decide if a neuron should activate.

---

## The Forward & Backward Pass

Learning happens in two repeating phases:
- **Forward Propagation**: Input data flows through the network layers, multiply by weights, add biases, apply activation functions, and output a prediction.
- **Loss Calculation**: The model measures the error between its prediction and the true answer.
- **Backward Propagation**: The model calculates gradients (using calculus derivatives) and updates the weights using an optimization algorithm (like Gradient Descent) to reduce the loss.

---

## Building a Basic Classifier in Python

Using the popular library \`scikit-learn\`, we can initialize and train a Multi-Layer Perceptron (MLP) neural network in just a few lines:

\`\`\`python
from sklearn.neural_network import MLPClassifier
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split

# 1. Generate synthetic classification data
X, y = make_classification(n_samples=1000, n_features=20, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# 2. Define the Neural Network
# We set 2 hidden layers: first with 100 neurons, second with 50 neurons
clf = MLPClassifier(
    hidden_layer_sizes=(100, 50), 
    activation='relu', 
    solver='adam', 
    max_iter=500,
    random_state=42
)

# 3. Train the network
clf.fit(X_train, y_train)

# 4. Check accuracy
accuracy = clf.score(X_test, y_test)
print(f"✅ Model Accuracy: {accuracy * 100:.2f}%")
\`\`\`

---

## Watch the Visual Deep Dive
Check out the video explanation below to visualize how weights shift and gradients descend to optimize neural connections:`,
    category: "AI & ML",
    tags: ["python", "machinelearning", "mca", "ai"],
    image_url: "/uploads/neural_network_1781672371099.png",
    video_url: "https://www.youtube.com/watch?v=aircAruvnKk",
    is_published: true
  },
  {
    title: "Dockerizing Multi-Container Full-Stack Applications: A Complete Walkthrough",
    summary: "Learn to configure Dockerfiles, compose multi-container environments, build reverse proxies with Nginx, and manage container volumes for React and Express.",
    content: `# Dockerizing Multi-Container Full-Stack Applications: A Complete Walkthrough

Deploying applications can be a nightmare when dealing with "works on my machine" issues. **Docker** solves this by packaging code and dependencies into isolated container environments.

In this guide, we'll configure a multi-container local stack utilizing a React frontend, a Node/Express backend, and a PostgreSQL database.

---

## 1. Dockerfile for Express API Server
Inside the backend directory, we set up a lightweight Node container:

\`\`\`dockerfile
# /backend/Dockerfile
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000
CMD ["npm", "start"]
\`\`\`

---

## 2. Docker Compose Configuration
To manage all three components (Frontend, Backend, Database) simultaneously, we write a \`docker-compose.yml\` configuration in the root folder:

\`\`\`yaml
version: '3.8'

services:
  database:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: portfolio
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgres://user:password@database:5432/portfolio
    depends_on:
      - database

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend

volumes:
  pgdata:
\`\`\`

### Key Features of Compose:
- **depends_on**: Ensures database container starts before the backend API container.
- **volumes**: Mounts a persistent database directory (\`pgdata\`) on the host system. This ensures database records are *not* deleted when containers stop.

---

## 3. Running the App
Start the entire stack with a single command:

\`\`\`bash
docker-compose up --build
\`\`\`

To shut down the services and clean up containers:
\`\`\`bash
docker-compose down
\`\`\`

---

## Conclusion
Containerization provides an easy way to build reliable architectures. Docker Compose handles orchestrating services, managing volumes, and exposing ports, allowing you to deploy your full-stack application effortlessly!`,
    category: "DevOps",
    tags: ["docker", "devops", "deployment", "nginx"],
    image_url: "/uploads/docker_deployment_1781672387541.png",
    video_url: null,
    is_published: true
  },
  {
    title: "Web Application Security 101: Preventing Common Vulnerabilities",
    summary: "Identify and patch the most common security flaws in web applications: cross-site scripting (XSS), SQL injection, and broken authentication mechanisms.",
    content: `# Web Application Security 101: Preventing Common Vulnerabilities

Building functional applications is satisfying, but securing them is paramount. In this article, we'll analyze three common web vulnerabilities categorized under the **OWASP Top 10** guidelines and write secure Node/Express code to prevent them.

---

## 1. SQL Injection (SQLi)
SQL Injection occurs when untrusted user input is directly concatenated into a database query. This allows malicious actors to run unauthorized SQL statements.

### 🔴 Vulnerable Code:
\`\`\`javascript
// Insecure - string interpolation
const query = \`SELECT * FROM users WHERE email = '\${req.body.email}'\`;
const result = await pool.query(query);
\`\`\`

### 🟢 Secure Code (Parameterized Queries):
Always use parameterized queries. The database engine treats parameters as literal values rather than executable code.

\`\`\`javascript
// Secure - query placeholders
const query = 'SELECT * FROM users WHERE email = $1';
const result = await pool.query(query, [req.body.email]);
\`\`\`

---

## 2. Cross-Site Scripting (XSS)
XSS vulnerabilities let attackers inject malicious scripts (usually JavaScript) into web pages viewed by other users.

### 🔴 Vulnerable React Code:
\`\`\`jsx
// Insecure - rendering raw HTML without sanitization
<div dangerouslySetInnerHTML={{ __html: userInput }} />
\`\`\`

### 🟢 Secure Code:
By default, React escapes variables rendered in JSX (e.g., \`<div>{userInput}</div>\`), which prevents XSS. If you absolutely need to render raw HTML, sanitize it using libraries like \`dompurify\`:

\`\`\`jsx
import DOMPurify from 'dompurify';

const SafeHTML = ({ userInput }) => {
  const cleanHTML = DOMPurify.sanitize(userInput);
  return <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />;
};
\`\`\`

---

## 3. Storing Passwords Securely
Never store passwords in plain text. If the database is compromised, all user accounts will be exposed.

### 🟢 Secure Password Hashing with Bcrypt:
\`\`\`javascript
const bcrypt = require('bcrypt');

const registerUser = async (plainPassword) => {
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  
  // Save hashedPassword in database
  await pool.query('INSERT INTO users(password) VALUES($1)', [hashedPassword]);
};
\`\`\`

---

## Learn More from the Experts
Check out this full video summary on how security testing is structured and how web applications get hacked:`,
    category: "Cyber Security",
    tags: ["security", "owasp", "node", "express"],
    image_url: "/uploads/cyber_security_1781672400319.png",
    video_url: "https://www.youtube.com/watch?v=6y_xEl0-gSM",
    is_published: true
  }
]

async function run() {
  try {
    console.log('⏳ Clearing old blogs and inserting high-quality mock blogs...')
    
    // Clear old blogs first
    await pool.query("DELETE FROM blogs")
    console.log('🧹 Cleared old blogs table data!')

    // Insert new blogs
    for (const blog of blogsData) {
      await pool.query(
        `INSERT INTO blogs (title, summary, content, category, tags, image_url, video_url, is_published, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [
          blog.title,
          blog.summary,
          blog.content,
          blog.category,
          blog.tags,
          blog.image_url,
          blog.video_url,
          blog.is_published
        ]
      )
      console.log(`✅ Inserted: "${blog.title}"`)
    }

    console.log('🎉 Successfully seeded 5 detailed, high-quality blog posts!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Failed to seed blog database:', err.message)
    process.exit(1)
  }
}

run()
