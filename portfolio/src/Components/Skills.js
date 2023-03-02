import React from 'react'
import { motion } from 'framer-motion'
import JsSkill from './JsSkill'
import PythonSkill from './PythonSkill'
import PhpSkill from './PhpSkill'
import MySQLSkill from './MySQLSkill'
import PerlSkill from './PerlSkill'
import HtmlSkill from './HtmlSkill'
import CSSSkill from './CSSSkill'

function Skills() {
  return (
    // <motion.div 
    // initial={{ opacity: 0 }}
    // whileInView= {{ opacity: 1 }}
    // transition={{ duration: 7 }}
    // className='flex relative flex-col text-center md:text-left xl:flex-row max-w-[2000px] xl:px-10 min-h-screen justify-center xl:space-y-0 mx-auto items-center'
    // >
    
    <div className='flex relative flex-col text-center md:text-left xl:flex-row max-w-[2000px] xl:px-10 min-h-screen justify-center xl:space-y-0 mx-auto items-center'>
    {/* <div className='flex flex-col h-screen relative text-left overflow-hidden px-10 max-w-full items-center md:flex-col justify-evenly mx-auto'> */}
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView= {{ opacity: 1 }}
          transition={{ duration: 1 }}
          className='absolute top-16 uppercase tracking-[20px] text-gray-500 text-2xl font-bold'
        >
          Skills
        </motion.h3>
        <h3 className='absolute top-36 uppercase tracking-[3px] text-gray-500 text-sm'>
          Hover over a skill for currency proficiency
        </h3>

        {/* <h3 className='absolute top-16 uppercase tracking-[20px] text-gray-500 text-2xl'> */}
        {/* <h3 className='top-16 uppercase tracking-[20px] text-gray-500 text-2xl'>
            Skills
        </h3> */}

        {/* <h3 className='absolute top-36 uppercase tracking-[3px]'>Hover Over a Skill for currency proficiency</h3> */}

        <div className='grid grid-cols-4 gap-5'>
            <PythonSkill />
            <PhpSkill />
            <MySQLSkill />
            <PerlSkill />
            <JsSkill />
            <HtmlSkill />
            <CSSSkill />
            <JsSkill />
            <JsSkill />
            <JsSkill />
            <JsSkill />
            <JsSkill />
        </div>
    </div>
    // </motion.div>
  )
}

export default Skills