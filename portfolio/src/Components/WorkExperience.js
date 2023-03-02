import React from 'react'
import { motion } from 'framer-motion'
import ExperienceCard from './ExperienceCard'
import ExperienceCard2 from './ExperienceCard2'

function WorkExperience() {
  return (
    <motion.div 
        initial={{ opacity: 0 }}
        whileInView= {{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className='flex flex-col h-screen relative text-left overflow-hidden px-10 max-w-full items-center md:flex-col justify-evenly mx-auto'
    >
        {/* <h3 className='absolute top-16 uppercase tracking-[20px] text-gray-400 text-2xl'> */}
        <h3 className="top-16 p-1 mt-10 uppercase tracking-[20px] text-gray-400 text-base font-bold">
          Experience
          <motion.span
            // initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 0.4, 0.6, 0.8, 1, 0.8, 0.4, 0.2] }}
            transition={{ duration: 1, delay: 0.4, repeat: Infinity }}
          >
            →
          </motion.span>
          {/* <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, repeat: Infinity }}
          >
            →
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3, repeat: Infinity }}
          >
            →
          </motion.span> */}
        </h3>

        <div className='w-full flex space-x-5 overflow-x-scroll p-1 snap-x snap-mandatory'>
        {/* <div className='absolute w-full h-3/4 top-28 flex space-x-5 overflow-x-scroll snap-x snap-mandatory'> */}
        {/* <div className='mb-20 md:mb-0 flex-shrink-0 w-56 h-56 rounded-full object-cover md:rounded-lg md:w-64 md:h-95 xl:w-[500px] xl:h-[500px]'> */}
            <ExperienceCard />
            <ExperienceCard2 />
            <ExperienceCard />
            <ExperienceCard />
        </div>
    </motion.div>
  )
}

export default WorkExperience