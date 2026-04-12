import React from 'react'
import { motion } from 'framer-motion'
import STLogo from "../Images/STMicroelectronicLogo.png"
import JavascriptLogo from "../Images/jslogo.png"
import PythonLogo from "../Images/pythonlogo.jpeg"
import PHPLogo from "../Images/phplogo.jpeg"
import PerlLogo from "../Images/perllogo.jpeg"
import MysqlLogo from "../Images/MysqlLogo.png"
import pandaslogo from "../Images/pandaslogo.png"
import OpenCVlogo from "../Images/OpenCVlogo.png"

function ExperienceCard() {
  return (
    <article className='flex flex-shrink-0 flex-col max-w-xs md:max-w-3xl items-center justify-center bg-[#292929] rounded-2xl shadow-[0_0_10px_gray] px-10 py-5 md:p-20'>
        <motion.img
            initial={{
                y: -100,
                opactity: 0,
            }} 
            transition={{ duration: 1.2 }}
            whileInView={{ opacity: 1, y: 0}}
            viewport={{ once:true }}
            className='m-3 w-24 h-24 md:w-32 md:h-32 lg:w-32 lg:h-32 rounded-full object-cover object-center'
            src={STLogo}
        />

        <div className='max-w-2xl'>
            <h4 className='text-3xl sm:text-4xl font-light text-center'>STMicroelectronics</h4>
            <p className='font-bold text-xl sm:text-2xl mt-1 text-center'>Software Engineer II</p>
            <div className='flex space-x-2 my-1 justify-center'>
                <img 
                    className='h-10 w-10 rounded-full'
                    src={PythonLogo}
                    alt="Tech Used"
                />
                <img 
                    className='h-10 w-10 rounded-full'
                    src={pandaslogo}
                    alt="Tech Used"
                />
                <img 
                    className='h-10 w-10 rounded-full'
                    src={OpenCVlogo}
                    alt="Tech Used"
                />
            </div>
            <p className='uppercase py-3 sm:py-5 text-gray-300'>May 2024 - Present</p>
            <ul className='list-disc space-y-2 ml-5 text-xs md:text-lg text-justify text-gray-400'>
                <li>Designed and deployed AI applications system for cross functional team using Convolution Neural Network architecture.</li>
                <li>Developed AI-driven computer vision solutions using Raspberry Pi, Python, and YOLO model, automating defect detection.</li>
                <li>Developed LSTM predictive models for Epitaxy gas flow optimization planning cycle forecasting, improving process efficiency and scheduling accuracy.</li>
                <li>Led the AI Community consisting of 100 people, conducting quarterly training on Python, ML, and computer vision helping the company to scale up AI awareness.</li>
            </ul>
        </div>
    </article>
  )
}

export default ExperienceCard