import React from 'react'
import PathfindingSS from "../Images/PathfindingSS.png"
import AlignmentGIF from "../Images/Alignment.gif"

function AlignmentProject() {
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
            src={AlignmentGIF}
            alt='AlignmentSS'
            className='w-[400px] h-[200px] sm:w-[600px] sm:h-[300px] md:w-[800px] md:h-[400px] transition-all duration-300 rounded-lg'
            // className='max-w-7xl h-[400px]'
        />

        <div className='space-y-10 px-0 md:pd-10 max-w-6xl'>
            <h4 className='text-4xl font-semibold text-center'> 
                <span>Project 2 of 8:</span>{" "}
                <a href="" className='underline decoration-[#F7Ab0A]/50 transition-all duration-300 opacity-50 hover:opacity-100'>Wafer Alignment</a>
            </h4>

            <p className='text-sm sm:text-lg text-center md:text-left'>
                • Developed a real-time monitoring tool to verify wafer positioning during loading, eliminating costly drops caused by vacuum pin misalignment. <br></br>
                • Engineered a computer vision alignment system that ensures precise wafer placement on 3 vacuum chucks, preventing improper suction and potential scrap. <br></br>
                • Optimized the machine loading process by implementing automated alignment checks, which significantly reduced material waste and improved production yield.
            </p>
        </div>
    </div>
  )
}

export default AlignmentProject