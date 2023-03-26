import React from 'react'
import { motion } from 'framer-motion'
import CoverPic from "../Images/pass-photo09Oct2022.jpeg"
import STLogo from "../Images/STMicroelectronicLogo.png"
import JavascriptLogo from "../Images/jslogo.png"
import PythonLogo from "../Images/pythonlogo.jpeg"
import PHPLogo from "../Images/phplogo.jpeg"
import PerlLogo from "../Images/perllogo.jpeg"
import MysqlLogo from "../Images/MysqlLogo.png"

function ExperienceCard() {
  return (
    // <article className='flex flex-col rounded-lg items-center space-y-7 flex-shrink-0 w-screen md:w-[600px] xl:w-[900px] snap-center bg-[#292929] p-10 hover:opacity-100 opacity-40 cursor-pointer transition-opacity duration-200 overflow-hidden'>
    <article className='flex flex-col rounded-lg items-center space-y-7 flex-shrink-0 w-screen md:w-[600px] xl:w-[900px] snap-center bg-[#292929] p-10 opacity-40 hover:opacity-100 cursor-pointer transition-opacity duration-200 overflow-x-scroll'>
        <motion.img
            initial={{
                y: -100,
                opactity: 0,
            }} 
            transition={{ duration: 1.2 }}
            whileInView={{ opacity: 1, y: 0}}
            viewport={{ once:true }}
            className='w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover object-center xl:w-[200px] xl:h-[200px]'
            src={STLogo}
        />

        <div className='px-5 md:px-10'>
            <h4 className='text-3xl sm:text-4xl font-light'>Software Engineer</h4>
            <p className='font-bold text-xl sm:text-2xl mt-1'>STMicroelectronics</p>
            <div className='flex space-x-2 my-1'>
                <img 
                    className='h-10 w-10 rounded-full'
                    src={PythonLogo}
                    alt="Tech Used"
                />
                <img 
                    className='h-10 w-10 rounded-full'
                    src={PHPLogo}
                    alt="Tech Used"
                />
                <img 
                    className='h-10 w-10 rounded-full'
                    src={JavascriptLogo}
                    alt="Tech Used"
                />
                <img 
                    className='h-10 w-10 rounded-full'
                    src={PerlLogo}
                    alt="Tech Used"
                />
                <img 
                    className='h-10 w-10 rounded-full'
                    src={MysqlLogo}
                    alt="Tech Used"
                />
            </div>
            <p className='uppercase py-3 sm:py-5 text-gray-300'>May 2022 - Present</p>
            <ul className='list-disc space-y-2 ml-5 text-sm sm:text-lg text-justify'>
                {/* <li>Maintained and developed website applications using PHP, HTML, and CSS, which resulted in a reduced run time and increased productivity by 80%.</li> */}
                <li>Maintain and develop website applications using PHP, HTML, and CSS reducing run time and increased productivity by 80%.</li>
                <li>Migrate excel files to MySQL Database using Python Pandas, which streamlined the data management process and saved the company time and resources.</li>
                <li>Design and implement a Mask Request Form web application using PHP, HTML, and CSS.</li>
                <li>Identify problems with program function, output, and content to improve quality of product</li>
            </ul>
        </div>
    </article>
  )
}

export default ExperienceCard