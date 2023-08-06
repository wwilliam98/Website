import React from 'react'
import LightProjectSS from "../Images/LightProjectSS.jpeg"

function LightProject() {
  return (
    <div className='w-screen flex-shrink-0 snap-center flex flex-col space-y-10 items-center justify-start p-5 md:pd-20'>
        <img
            src={LightProjectSS}
            alt='LightProjectSS'
            className='w-[400px] h-[200px] sm:w-[600px] sm:h-[300px] md:w-[800px] md:h-[400px] transition-all duration-300 rounded-lg filter grayscale hover:grayscale-0'
            // className='max-w-7xl h-[400px]'
        />

        <div className='space-y-10 px-0 md:pd-10 max-w-6xl'>
            <h4 className='text-4xl font-semibold text-center'> 
                <span>Project 6 of 6:</span>{" "}
                <a href="" className='underline decoration-[#F7Ab0A]/50 transition-all duration-300 opacity-50 hover:opacity-100'>Automated Desk Light</a>
            </h4>

            <p className='text-sm sm:text-lg text-center md:text-left'>
                • Created an Automated Desk Light using Raspberry 4, and XCode environment to control light status using mobile phone (ios). <br></br>
                • Successfully implemented 2 way communication using Raspberry Pi 4 as the client and Firebase as the server <br></br>
                • Utilized python to push/retrieve data in real time and swift to create the user interface (UI) for mobile application
            </p>
        </div>
    </div>
  )
}

export default LightProject