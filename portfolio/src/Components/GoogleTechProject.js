import React from 'react'
import GoogleTechSS from "../Images/GoogleTechSS.png"

function GoogleTechProject() {
  return (
    <div className='w-screen flex-shrink-0 snap-center flex flex-col space-y-10 items-center justify-start p-5 md:pd-20'>
        <img
            src={GoogleTechSS}
            alt='GoogleTechSS'
            className='w-[400px] h-[200px] sm:w-[600px] sm:h-[300px] md:w-[800px] md:h-[400px] transition-all duration-300 rounded-lg filter grayscale hover:grayscale-0'
            // className='max-w-7xl h-[400px]'
        />

        <div className='space-y-10 px-0 md:pd-10 max-w-6xl'>
            <h4 className='text-4xl font-semibold text-center'> 
                <span>Project 3 of 5:</span>{" "}
                <a href="https://techchallenge.withgoogle.com/" className='underline decoration-[#F7Ab0A]/50 transition-all duration-300 opacity-50 hover:opacity-100'>Google Tech Challenge</a>
            </h4>

            <p className='text-sm sm:text-lg text-center md:text-left'>
                • Built a team of 5 students in a national tech game competition to solve 5 levels of difficulties of puzzles which include 3 coding challenges and 2 riddle challenges in 2 hours <br></br>
                • Solved coding and logical problems, algorithm puzzles, and riddles as much as possible in a given time
            </p>
        </div>
    </div>
  )
}

export default GoogleTechProject