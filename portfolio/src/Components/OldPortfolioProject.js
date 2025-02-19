import React from 'react'
import oldPortfolioSS from "../Images/oldPortfolioSS.png"

function OldPortfolioProject() {
  return (
    <div className='w-screen flex-shrink-0 snap-center flex flex-col space-y-10 items-center justify-start p-5 md:pd-20'>
        <a href='/oldPortfolio'>
        <img
            src={oldPortfolioSS}
            alt='oldPortfolioSS'
            className='w-[400px] h-[200px] sm:w-[600px] sm:h-[300px] md:w-[800px] md:h-[400px] duration-300 rounded-lg'
            // className='max-w-7xl h-[400px]'
        />
        </a>

        <div className='space-y-10 px-0 md:pd-10 max-w-6xl'>
            <h4 className='text-4xl font-semibold text-center'> 
                <span>Project 5 of 6:</span>{" "}
                <a href="/oldPortfolio" className='underline decoration-[#F7Ab0A]/50 transition-all duration-300 opacity-50 hover:opacity-100'>Old Portfolio</a>
            </h4>

            <p className='text-sm sm:text-lg text-center md:text-left'>
                • Built an interactive portfolio that allow user to move around a character and interact with objects<br></br>
                • Developed using HTML, CSS, Javascript and utilized the Canvas API to render and animate objects<br></br>
                • Implement algorithms to move objects, collision detection and responsive to user input
            </p>
        </div>
    </div>
  )
}

export default OldPortfolioProject