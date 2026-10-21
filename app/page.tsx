import About from '@/sections/About'
import Contact from '@/sections/Contact'
import Hero from '@/sections/Hero'
import Projects from '@/sections/Projects'
import Services from '@/sections/Services'

const Home = () => {
  return (
    <div>
      <Hero/>
      <About/>
      <Projects/>
      <Services/>
      <Contact/>
    </div>
  )
}

export default Home