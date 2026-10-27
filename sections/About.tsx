import AboutContent from '@/components/AboutContent'
import AboutGallery from '@/components/AboutGallery'
import React from 'react'

const About = () => {
  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-24 text-neutral-900">
      <AboutGallery />
      <AboutContent />
    </section>
  )
}

export default About