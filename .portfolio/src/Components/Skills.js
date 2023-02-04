import React from 'react'
import { motion } from 'framer-motion'
import Skill from './Skill'

function Skills() {
  return (
    <motion.div 
    initial={{ opacity: 0 }}
    whileInView= {{ opacity: 1 }}
    transition={{ duration: 7 }}
    className='flex relative flex-col text-center md:text-left xl:flex-col max-w-[2000px] xl:px-10 min-h-screen justify-evenly xl:space-y-0 mx-auto items-center'
    >
        {/* <h3 className='absolute top-16 uppercase tracking-[20px] text-gray-500 text-2xl'> */}
        <h3 className='top-16 uppercase tracking-[20px] text-gray-500 text-2xl'>
            Skills
        </h3>

        {/* <h3 className='absolute top-36 uppercase tracking-[3px]'>Hover Over a Skill for currency proficiency</h3> */}

        <div className='grid grid-cols-3 gap-5'>
            <Skill />
            <Skill />
            <Skill />
            <Skill />
            <Skill />
            <Skill />
            <Skill />
            <Skill />
            <Skill />
            <Skill />
            <Skill />
            <Skill />
        </div>
    </motion.div>
  )
}

export default Skills