import React from 'react'
import { motion } from 'framer-motion'
import STLogo from "../Images/STMicroelectronicLogo.png"
import JavascriptLogo from "../Images/jslogo.png"
import PythonLogo from "../Images/pythonlogo.jpeg"
import PHPLogo from "../Images/phplogo.jpeg"
import PerlLogo from "../Images/perllogo.jpeg"
import MysqlLogo from "../Images/MysqlLogo.png"

function ExperienceCard() {
  return (
    <article className='flex flex-shrink-0 flex-col max-w-sm md:max-w-3xl items-center justify-center bg-[#292929] rounded-2xl shadow-[0_0_10px_gray] px-10 py-5 md:p-20'>
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
            <p className='font-bold text-xl sm:text-2xl mt-1 text-center'>Software Engineer</p>
            <div className='flex space-x-2 my-1 justify-center'>
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
            <ul className='list-disc space-y-2 ml-5 text-xs md:text-lg text-justify text-gray-400'>
                {/* <li>Led the development and implementation of multiple AI-based Computer Vision projects aimed at preventing wafer scrap, utilizing Raspberry Pi, Python, and YOLOv8, and successfully saved 60 wafer lots by automating defect detection and process control.</li>
                <li>Developed and Maintained websites using PHP, HTML, Javascript, MySQL for Reticle Assembly Team to fracture data, enabling effective data management and analysis.</li>
                <li>Created a system for the HR training team to streamline operator training processes, enhancing efficiency and tracking capabilities.</li>
                <li>Migrate excel files to MySQL Database using Python Pandas, which streamlined the data management process and saved the company time and resources.</li>
                <li>Using Pandas and Matplotlib to move data from Excel files to a database and show the statistics on the website, making information more organized and accessible.</li> */}
                <li>Led the development and implementation of multiple AI-based Computer Vision projects aimed at preventing wafer scrap, utilizing Raspberry Pi, Python, and YOLOv8, successfully saving 60 wafer lots by automating defect detection and process control.</li>
                <li>Developed and maintained websites using PHP, HTML, JavaScript, and MySQL for the Reticle Assembly Team to fracture data, enabling effective data management and analysis.</li>
                <li>Migrated Excel files to a MySQL database using Python Pandas, streamlining the data management process and saving the company time and resources.</li>
                <li>Utilized Pandas and Matplotlib to transfer data from Excel files to a database and displayed statistics on the website, making information more organized and accessible.</li>
            </ul>
        </div>
    </article>
  )
}

export default ExperienceCard