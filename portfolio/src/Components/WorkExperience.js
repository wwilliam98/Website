import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import ExperienceCard from './ExperienceCard'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

import STLogo from "../Images/STMicroelectronicLogo.png"
import OpenSlotPic from "../Images/OpenSlot.png"
import PythonLogo from "../Images/pythonlogo.jpeg"
import PHPLogo from "../Images/phplogo.jpeg"
import JsLogo from "../Images/jslogo.png"
import PerlLogo from "../Images/perllogo.jpeg"
import MysqlLogo from "../Images/MysqlLogo.png"
import PandasLogo from "../Images/pandaslogo.png"
import OpenCVLogo from "../Images/OpenCVlogo.png"
import HTMLLogo from "../Images/HTMLlogo.jpeg"

const experiences = [
  {
    logo: STLogo,
    company: 'STMicroelectronics',
    title: 'Software Engineer II',
    period: 'May 2024 – Present',
    techStack: [
      { src: PythonLogo, alt: 'Python' },
      { src: PandasLogo, alt: 'Pandas' },
      { src: OpenCVLogo, alt: 'OpenCV' },
    ],
    bullets: [
      'Designed and deployed AI applications system for cross functional team using Convolution Neural Network architecture.',
      'Developed AI-driven computer vision solutions using Raspberry Pi, Python, and YOLO model, automating defect detection.',
      'Developed LSTM predictive models for Epitaxy gas flow optimization planning cycle forecasting, improving process efficiency and scheduling accuracy.',
      'Led the AI Community consisting of 100 people, conducting quarterly training on Python, ML, and computer vision helping the company to scale up AI awareness.',
    ],
  },
  {
    logo: STLogo,
    company: 'STMicroelectronics',
    title: 'Software Engineer',
    period: 'May 2022 – April 2024',
    techStack: [
      { src: PythonLogo, alt: 'Python' },
      { src: PHPLogo,    alt: 'PHP' },
      { src: JsLogo,     alt: 'JavaScript' },
      { src: PerlLogo,   alt: 'Perl' },
      { src: MysqlLogo,  alt: 'MySQL' },
    ],
    bullets: [
      'Designed RESTful APIs to facilitate data integration across teams, enhancing system interoperability.',
      'Built and maintained PHP-based websites with MySQL for the Reticle Assembly Team, enhancing data management and analysis.',
      'Migrated Excel data to MySQL databases using Python Pandas, streamlining data management and conserving resources.',
      'Utilized Pandas and Matplotlib to transfer Excel data to databases and visualized statistics on websites for improved accessibility.',
    ],
  },
  {
    logo: OpenSlotPic,
    company: 'OpenSlot Inc.',
    title: 'Quality Assurance',
    period: 'Summer 2018, Summer 2019',
    techStack: [
      { src: JsLogo,   alt: 'JavaScript' },
      { src: HTMLLogo, alt: 'HTML' },
    ],
    bullets: [
      'Collaborated to identify and document faults in the OpenSlot application, reducing faults by 50%.',
      'Participated in code reviews, providing quality feedback.',
      'Identified and documented program issues to enhance product quality.',
      'Designed test plans with doctors and dentists, aligning application functionality with business needs.',
      'Offered usability and functionality recommendations to developers, improving application features.',
    ],
  },
]

function WorkExperience() {
  const [activePage, setActivePage] = useState(0)
  const containerRef = useRef(null)

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, clientWidth } = containerRef.current
      setActivePage(Math.round(scrollLeft / clientWidth))
    }
  }

  const scrollLeft = () => {
    containerRef.current?.scrollBy({ left: -containerRef.current.clientWidth, behavior: 'smooth' })
  }

  const scrollRight = () => {
    containerRef.current?.scrollBy({ left: containerRef.current.clientWidth, behavior: 'smooth' })
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className='flex flex-col h-dvh flex-shrink-0 relative overflow-hidden text-left max-w-full justify-evenly mx-auto items-center z-0'
    >
      <div className='text-center mt-6'>
        <h3 className='text-2xl font-bold uppercase tracking-[8px] text-[#38BDF8]'>
          Experience
          <motion.span
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            {' '}→
          </motion.span>
        </h3>
        <div className='w-full h-[2px] bg-[#38BDF8]/60 mt-2 rounded-full' />
      </div>

      <button
        className='absolute left-4 top-1/2 z-30 p-2 border border-[#38BDF8]/40 rounded-full hover:bg-[#38BDF8]/20 transition-all hidden md:block'
        onClick={scrollLeft}
      >
        <ChevronLeftIcon className='h-8 w-8 text-[#38BDF8]/70' />
      </button>

      <button
        className='absolute right-4 top-1/2 z-30 p-2 border border-[#38BDF8]/40 rounded-full hover:bg-[#38BDF8]/20 transition-all hidden md:block'
        onClick={scrollRight}
      >
        <ChevronRightIcon className='h-8 w-8 text-[#38BDF8]/70' />
      </button>

      <div
        ref={containerRef}
        className='relative w-full flex overflow-x-scroll overflow-y-hidden snap-x snap-mandatory z-20 no-scrollbar'
      >
        {experiences.map((exp, index) => (
          <div key={index} className='w-dvw flex-shrink-0 snap-center flex flex-col items-center justify-center p-4'>
            <ExperienceCard {...exp} />
          </div>
        ))}
      </div>

      <div className='flex space-x-2 pb-2'>
        {experiences.map((_, index) => (
          <span
            key={index}
            className={`h-3 w-3 rounded-full transition-colors duration-300 ${
              activePage === index ? 'bg-[#38BDF8]' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default WorkExperience
