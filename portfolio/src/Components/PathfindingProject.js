import React from 'react'
import PathfindingSS from "../Images/PathfindingSS.png"
import PathfinderGIF from "../Images/pathfinder.gif"

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
        <a href='/PathFindingVisualizer'>
        <img
            src={PathfinderGIF}
            alt='PathfindingSS'
            className='w-[400px] h-[200px] sm:w-[600px] sm:h-[300px] md:w-[800px] md:h-[400px] transition-all duration-300 rounded-lg'
            // className='max-w-7xl h-[400px]'
        />
        </a>

        <div className='space-y-10 px-0 md:pd-10 max-w-6xl'>
            <h4 className='text-4xl font-semibold text-center'> 
                <span>Project 1 of 6:</span>{" "}
                <a href="/PathFindingVisualizer" className='underline decoration-[#F7Ab0A]/50 transition-all duration-300 opacity-50 hover:opacity-100'>Pathfinding Visualizer</a>
            </h4>

            <p className='text-sm sm:text-lg text-center md:text-left'>
                • Built an Interactive Web-Application that allow user to Visualize Shortest Path between 2 nodes. <br></br>
                • Utilized Object Oriented Programming, JQuery and Popular Pathfinding Algorithms such as Dijkstra, A*, BFS, and DFS. <br></br>
                • Implemented in Javascript, Html, CSS and AWS(EC2) as web service. 
            </p>
        </div>
    </div>
  )
}

export default SudokuProject