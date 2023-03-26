import React from 'react'
import SudokuSS from "../Images/SudokuSS.png"

function SudokuProject() {
  return (
    <div className='w-screen flex-shrink-0 snap-center flex flex-col space-y-10 items-center justify-start p-5 md:pd-20'>
        {/* <motion.img
            initial={{
                y: -300,
                opacity: 0,
            }}
            transition={{ duration: 1.2 }}
            whileInView={{ opacity:1, y:0 }} */}
        <a href='/SudokuSolver'>
        <img
            src={SudokuSS}
            alt='SudokuSS'
            className='w-[400px] h-[200px] sm:w-[600px] sm:h-[300px] md:w-[800px] md:h-[400px] transition-all duration-300 rounded-lg cursor-pointer filter grayscale hover:grayscale-0'
            // className='max-w-7xl h-[400px]'
        />
        </a>

        <div className='space-y-10 px-0 md:pd-10 max-w-6xl'>
            <h4 className='text-4xl font-semibold text-center'> 
                <span>Project 1 of 4:</span>{" "}
                <a href="/SudokuSolver" className='underline decoration-[#F7Ab0A]/50 transition-all duration-300 opacity-50 hover:opacity-100'>Sudoku Solver</a>
            </h4>

            <p className='text-sm sm:text-lg text-center md:text-left'>
                • Built a full-stack web application to allow user to login and visualize outcomes of sudoku using Javascript, Html, CSS. <br></br>
                • Utilized Node.js as the framework, MongoDB as the database, and AWS(EC2) as web service. <br></br>
                • Using object oriented design, built a backtracking algorithm that could solve a partially completed sudoku board in Javascript.
            </p>
        </div>
    </div>
  )
}

export default SudokuProject