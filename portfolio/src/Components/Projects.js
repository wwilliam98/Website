import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import ProjectCard from './ProjectCard'

import OCRGIF from "../Images/OCR.gif"
import AlignmentGIF from "../Images/Alignment.gif"
import PathfinderGIF from "../Images/pathfinder.gif"
import SudokuGIF from "../Images/SudokuSolver.gif"
import DMTGIF from "../Images/DareMightyThings.gif"
import GoogleTech_Team from "../Images/GoogleTech_Team.png"
import GoogleTech_Solo from "../Images/GoogleTech_Solo.png"
import GoogleTechSS from "../Images/GoogleTechSS.png"
import OldPortfolioSS from "../Images/oldPortfolioSS.png"
import LightProjectSS from "../Images/LightProjectSS.jpeg"

const projects = [
  {
    title: 'Optical Character Recognition',
    image: OCRGIF,
    description: '• Architected a Python-based ID detection pipeline to replace legacy manual verification, eliminating human error, minimized vendor reliance and saved S$1M in annual costs.\n• Developed an automated wafer ID verification system that eliminated production mismatches and reduced manufacturing scrap by 90%.\n• Streamlined manufacturing workflows and improved document quality control by engineering a precise data extraction tool for industrial files.',
  },
  {
    title: 'Wafer Alignment',
    image: AlignmentGIF,
    description: '• Developed a real-time monitoring tool to verify wafer positioning during loading, eliminating costly drops caused by vacuum pin misalignment.\n• Engineered a computer vision alignment system that ensures precise wafer placement on 3 vacuum chucks, preventing improper suction and potential scrap.\n• Optimized the machine loading process by implementing automated alignment checks, which significantly reduced material waste and improved production yield.',
  },
  {
    title: 'Pathfinding Visualizer',
    image: PathfinderGIF,
    link: '/PathFindingVisualizer',
    description: '• Built an Interactive Web-Application that allow user to Visualize Shortest Path between 2 nodes.\n• Utilized Object Oriented Programming, JQuery and Popular Pathfinding Algorithms such as Dijkstra, A*, BFS, and DFS.\n• Implemented in Javascript, HTML, CSS and AWS(EC2) as web service.',
  },
  {
    title: 'Sudoku Solver',
    image: SudokuGIF,
    link: '/SudokuSolver',
    description: '• Built a full-stack web application to allow user to login and visualize outcomes of sudoku using Javascript, HTML, CSS.\n• Utilized Node.js as the framework, MongoDB as the database, and AWS(EC2) as web service.\n• Using object oriented design, built a backtracking algorithm that could solve a partially completed sudoku board in Javascript.',
  },
  {
    title: 'DareMightyThings Hackathon 2019',
    image: DMTGIF,
    description: '• Won 1st place to implement a generated text application for a multi-billion dollar real estate company (JLL).\n• Successfully created an application that takes an address and writes a paragraph generally about the property and location.\n• Utilized Python, Java, HTML, CSS, and Javascript with support of Flask as the framework, Google Cloud, and NarrativeGenerator API.',
  },
  {
    title: 'Google Tech Challenge',
    carousel: [GoogleTech_Team, GoogleTech_Solo, GoogleTechSS],
    link: 'https://techchallenge.withgoogle.com/',
    description: '• Built a team of 5 students in a national tech game competition to solve 5 levels of difficulties of puzzles which include 3 coding challenges and 2 riddle challenges in 2 hours.\n• Solved coding and logical problems, algorithm puzzles, and riddles as much as possible in a given time.',
  },
  {
    title: 'Old Portfolio',
    image: OldPortfolioSS,
    link: '/oldPortfolio',
    description: '• Built an interactive portfolio that allows users to move around a character and interact with objects.\n• Developed using HTML, CSS, Javascript and utilized the Canvas API to render and animate objects.\n• Implemented algorithms to move objects, collision detection and responsive to user input.',
  },
  {
    title: 'Automated Desk Light',
    image: LightProjectSS,
    description: '• Created an Automated Desk Light using Raspberry Pi 4 and Xcode environment to control light status using mobile phone (iOS).\n• Successfully implemented 2-way communication using Raspberry Pi 4 as the client and Firebase as the server.\n• Utilized Python to push/retrieve data in real time and Swift to create the user interface (UI) for mobile application.',
  },
]

function Projects() {
  const containerRef = useRef(null)

  const scrollLeft = () => {
    containerRef.current?.scrollBy({ left: -containerRef.current.clientWidth, behavior: 'smooth' })
  }

  const scrollRight = () => {
    containerRef.current?.scrollBy({ left: containerRef.current.clientWidth, behavior: 'smooth' })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className='flex flex-col h-dvh relative overflow-hidden text-left max-w-full justify-evenly mx-auto items-center z-0'
    >
      <div className='text-center mt-6'>
        <h3 className='text-2xl font-bold uppercase tracking-[8px] text-[#38BDF8]'>
          Projects
          <motion.span
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            {' '}→
          </motion.span>
        </h3>
        <div className='w-full h-[2px] bg-[#38BDF8]/60 mt-2 rounded-full' />
      </div>

      <button
        className='absolute left-4 top-1/2 z-30 p-2 border border-[#38BDF8]/40 rounded-full hover:bg-[#38BDF8]/20 transition-all hidden md:block'
        onClick={scrollLeft}
      >
        <ChevronLeftIcon className='h-8 w-8 text-[#38BDF8]/70' />
      </button>

      <button
        className='absolute right-4 top-1/2 z-30 p-2 border border-[#38BDF8]/40 rounded-full hover:bg-[#38BDF8]/20 transition-all hidden md:block'
        onClick={scrollRight}
      >
        <ChevronRightIcon className='h-8 w-8 text-[#38BDF8]/70' />
      </button>

      <div
        ref={containerRef}
        className='relative w-full flex overflow-x-scroll overflow-y-hidden snap-x snap-mandatory z-20 no-scrollbar'
      >
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            index={index + 1}
            total={projects.length}
            {...project}
          />
        ))}
      </div>

      <div className='w-full absolute top-[30%] bg-[#7393B3]/10 left-0 h-[500px] -skew-y-12' />
    </motion.div>
  )
}

export default Projects
