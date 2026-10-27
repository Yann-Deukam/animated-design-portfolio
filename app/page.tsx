"use client"

import SmoothScroll from '@/components/SmoothScroll'
import About from '@/sections/About'
import Contact from '@/sections/Contact'
import Hero from '@/sections/Hero'
import Projects from '@/sections/Projects'
import Services from '@/sections/Services'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'

gsap.registerPlugin(ScrollTrigger);


const Home = () => {
  return (
    <main>
          <Hero/>
          <About/>
          <Projects/>
          <Contact/>
    </main>
  )
}

export default Home