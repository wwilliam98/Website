import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion'
import ExperienceCard from './ExperienceCard'
import ExperienceCard2 from './ExperienceCard2'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

function WorkExperience() {
  const [activePage, setActivePage] = useState(0);
  const containerRef = useRef(null);
  const pages = [<ExperienceCard />, <ExperienceCard2 />];

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollLeft = containerRef.current.scrollLeft;
      const pageWidth = containerRef.current.clientWidth;
      const newActivePage = Math.round(scrollLeft / pageWidth);
      setActivePage(newActivePage);
    }
  };

  // 2. Add Scroll Functions
  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -containerRef.current.clientWidth,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: containerRef.current.clientWidth,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        whileInView= {{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        // className='flex flex-col h-dvh relative overflow-hidden text-left max-w-full justify-evenly mx-auto items-center px-10'
        className='flex flex-col h-dvh flex-shrink-0 relative overflow-hidden text-left max-w-full justify-evenly mx-auto items-center z-0'
    >
        <h3 className='top-16 p-1 mt-10 uppercase tracking-[20px] text-gray-400 text-base font-bold'>
        {/* <h3 className="top-16 p-4 uppercase tracking-[20px] text-gray-400 text-base font-bold"> */}
          Experience
          <motion.span
            // initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 0.4, 0.6, 0.8, 1, 0.8, 0.4, 0.2] }}
            transition={{ duration: 1, delay: 0.4, repeat: Infinity }}
          >
            →
          </motion.span>
        </h3>

        {/* 3. Add Left Button (Hidden on Mobile) */}
        <button 
            className="absolute left-4 top-1/2 z-30 p-2 bg-gray-500/30 rounded-full hover:bg-gray-500/50 transition-all hidden md:block"
            onClick={scrollLeft}
        >
            <ChevronLeftIcon className="h-8 w-8 text-white/70" />
        </button>

        {/* 4. Add Right Button (Hidden on Mobile) */}
        <button 
            className="absolute right-4 top-1/2 z-30 p-2 bg-gray-500/30 rounded-full hover:bg-gray-500/50 transition-all hidden md:block"
            onClick={scrollRight}
        >
            <ChevronRightIcon className="h-8 w-8 text-white/70" />
        </button>

        <div
          ref={containerRef}
          className="relative w-full flex overflow-x-scroll overflow-y-hidden snap-x snap-mandatory z-20 no-scrollbar"
        >
          {pages.map((PageComponent, index) => (
            <div key={index} className="w-dvw flex-shrink-0 snap-center flex flex-col space-y-7 items-center justify-start p-2 md:pd-20">
              {PageComponent}
            </div>
          ))}
        </div>

        {/* Dot Indicators */}
        <div className="bottom-10 flex space-x-2">
          {pages.map((_, index) => (
            <span
              key={index}
              className={`h-3 w-3 rounded-full ${
                activePage === index ? 'bg-blue-800' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
    </motion.div>
  )
}

export default WorkExperience