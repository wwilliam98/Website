import { motion } from 'framer-motion'
import React, { useRef } from 'react'
import PathfindingProject from "./PathfindingProject.js"
import SudokuProject from "./SudokuProject.js"
import DareMightyThings from './DareMightyThingsProject.js'
import GoogleTechProject from './GoogleTechProject.js'
import OldPortfolioProject from './OldPortfolioProject.js'
import DeskLightProject from './DeskLightProject.js'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

function Projects() {
  // 3. Create the ref
  const containerRef = useRef(null);

  // 4. Add Scroll Functions
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

  return (
    <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1}}
        transition={{ duration: 1.5}}
        className='flex flex-col h-dvh relative overflow-hidden text-left max-w-full justify-evenly mx-auto items-center z-0'
        // className='flex flex-col w-full h-dvh relative text-left overflow-hidden px-10 max-w-full items-center md:flex-col justify-evenly mx-auto'
    >
        {/* <h3 className='top-16 uppercase tracking-[20px] text-gray-500 text-2xl'> */}
        <h3 className='top-16 p-1 mt-16 uppercase tracking-[20px] text-gray-400 text-base font-bold'>
            Projects
            <motion.span
                animate={{ opacity: [0.2, 0.4, 0.6, 0.8, 1, 0.8, 0.4, 0.2] }}
                transition={{ duration: 1, delay: 0.4, repeat: Infinity }}
            >
            →
          </motion.span>
        </h3>

        {/* 5. Add Left Button */}
        <button 
            className="absolute left-4 top-1/2 z-30 p-2 bg-gray-500/30 rounded-full hover:bg-gray-500/50 transition-all hidden md:block"
            onClick={scrollLeft}
        >
            <ChevronLeftIcon className="h-8 w-8 text-white/70" />
        </button>

        {/* 6. Add Right Button */}
        <button 
            className="absolute right-4 top-1/2 z-30 p-2 bg-gray-500/30 rounded-full hover:bg-gray-500/50 transition-all hidden md:block"
            onClick={scrollRight}
        >
            <ChevronRightIcon className="h-8 w-8 text-white/70" />
        </button>

        <div 
            ref={containerRef}
            className='relative w-full flex overflow-x-scroll overflow-y-hidden snap-x snap-mandatory z-20 no-scrollbar'
        >
            <PathfindingProject />
            <SudokuProject />
            <DareMightyThings />
            <GoogleTechProject />
            <OldPortfolioProject />
            <DeskLightProject />
        </div>

        <div className='w-full absolute top-[30%] bg-[#7393B3]/10 left-0 h-[500px] -skew-y-12' />

    </motion.div>
  )
}

export default Projects

