import Navbar from '../components/layout/Navbar'
import Hero from '../components/sections/Hero'
import About from '../components/sections/About'
import Projects from '../components/sections/Projects'
import Certificates from '../components/sections/Certificates'
import Contact from '../components/sections/Contact'
import Footer from '../components/layout/Footer'
import Experience from '../components/sections/Experience'

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Certificates />
      <Experience />
      <Contact />
      <Footer />
    </>
  )
}

export default Home