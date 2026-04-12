import React from 'react'
import PathfindingSS from "../Images/PathfindingSS.png"
import OCRGIF from "../Images/OCR.gif"

function OCRProject() {
  return (
    <div className='w-dvw flex-shrink-0 snap-center flex flex-col space-y-10 items-center justify-start p-5 md:pd-20'>
        {/* <motion.img
            initial={{
                y: -300,
                opacity: 0,
            }}
            transition={{ duration: 1.2 }}
            whileInView={{ opacity:1, y:0 }} */}
        <img
            src={OCRGIF}
            alt='OCRSS'
            className='w-[400px] h-[200px] sm:w-[600px] sm:h-[300px] md:w-[800px] md:h-[400px] transition-all duration-300 rounded-lg'
            // className='max-w-7xl h-[400px]'
        />

        <div className='space-y-10 px-0 md:pd-10 max-w-6xl'>
            <h4 className='text-4xl font-semibold text-center'> 
                <span>Project 1 of 8:</span>{" "}
                <a href="" className='underline decoration-[#F7Ab0A]/50 transition-all duration-300 opacity-50 hover:opacity-100'>Optical Character Recognition</a>
            </h4>

            <p className='text-sm sm:text-lg text-center md:text-left'>
                • Architected a Python-based ID detection pipeline to replace legacy manual verification, eliminating human error, minimized vendor reliance and saved S$1M in annual costs. <br></br>
                • Developed an automated wafer ID verification system that eliminated production mismatches and reduced manufacturing scrap by 90%. <br></br>
                • Streamlined manufacturing workflows and improved document quality control by engineering a precise data extraction tool for industrial files.
            </p>
        </div>
    </div>
  )
}

export default OCRProject