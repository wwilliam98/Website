import React from 'react'
import DMTSS from "../Images/DMTSS.png"

function DareMightyThings() {
  return (
    <div className='w-screen flex-shrink-0 snap-center flex flex-col space-y-5 items-center justify-evenly p-5 md:pd-20 h-screen'>
        <img
            src={DMTSS}
            alt='DareMightyThings'
            className='w-[600px] h-[300px] md:w-[800px] md:h-[400px] transition-all duration-300 rounded-lg filter grayscale hover:grayscale-0'
            // className='max-w-7xl h-[400px]'
        />

        <div className='space-y-10 px-0 md:pd-10 max-w-6xl'>
            <h4 className='text-4xl font-semibold text-center'> 
                <span>Project 2 of 4:</span>{" "}
                <a href="https://techchallenge.withgoogle.com/" className='underline decoration-[#F7Ab0A]/50 transition-all duration-300 opacity-50 hover:opacity-100'>DareMightyThings Hackaton 2019</a>
            </h4>

            <p className='text-sm sm:text-lg text-center md:text-left'>
                • Won 1st place to implement a generated text application for a multi-billion dollar real estate company (JLL)<br></br>
                • Successfully created an application that takes an address and write a paragraph long generally about the property and location<br></br>
                • Utilized Python, Java, HTML, CSS, and Javascript with support of Flask as the framework, Google Cloud, and NarrativeGenerator API
            </p>
        </div>
    </div>
  )
}

export default DareMightyThings