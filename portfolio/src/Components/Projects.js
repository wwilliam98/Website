import React from 'react'
import SectionHeading from './SectionHeading'
import ProjectCard from './ProjectCard'

import OCRGIF from "../Images/OCR.gif"
import OCRPoster from "../Images/OCR_poster.jpg"
import AlignmentGIF from "../Images/Alignment.gif"
import AlignmentPoster from "../Images/Alignment_poster.jpg"
import PathfinderGIF from "../Images/pathfinder.gif"
import PathfinderPoster from "../Images/pathfinder_poster.jpg"
import SudokuGIF from "../Images/SudokuSolver.gif"
import DMTGIF from "../Images/DareMightyThings.gif"
import DMTPoster from "../Images/DareMightyThings_poster.jpg"
import GoogleTechTeam from "../Images/GoogleTech_Team.png"
import OldPortfolioSS from "../Images/oldPortfolioSS.png"
import LightProjectSS from "../Images/LightProjectSS.jpeg"

const featuredProjects = [
  {
    title: 'Optical Character Recognition',
    image: OCRGIF,
    poster: OCRPoster,
    metric: 'S$1M/yr saved · −90% manufacturing scrap',
    tags: ['Python', 'OpenCV', 'OCR'],
    description: [
      'Architected a Python-based wafer ID detection pipeline replacing legacy manual verification, eliminating human error and vendor reliance.',
      'Automated wafer ID verification eliminated production mismatches.',
      'Engineered precise data extraction for industrial files, improving document quality control.',
    ],
  },
  {
    title: 'Wafer Alignment',
    image: AlignmentGIF,
    poster: AlignmentPoster,
    metric: 'Real-time computer-vision monitoring',
    tags: ['Python', 'OpenCV'],
    description: [
      'Real-time monitoring verifies wafer positioning during loading, eliminating costly drops from vacuum pin misalignment.',
      'CV alignment system ensures precise placement on 3 vacuum chucks, preventing scrap.',
      'Automated alignment checks reduced material waste and improved production yield.',
    ],
  },
  {
    title: 'Pathfinding Visualizer',
    image: PathfinderGIF,
    poster: PathfinderPoster,
    metric: 'Live demo — try it yourself',
    link: '/PathFindingVisualizer',
    tags: ['JavaScript', 'Dijkstra', 'A*'],
    description: [
      'Interactive web app visualizing shortest paths between two nodes.',
      'Implements Dijkstra, A*, BFS, and DFS with OOP JavaScript and jQuery.',
      'Deployed on AWS EC2.',
    ],
  },
]

const moreProjects = [
  {
    title: 'Sudoku Solver',
    image: SudokuGIF,
    link: '/SudokuSolver',
    summary: 'Full-stack app with login that solves sudoku via a backtracking algorithm. Node.js, MongoDB, AWS EC2.',
    tags: ['Node.js', 'MongoDB'],
  },
  {
    title: 'Dare Mighty Things 2019',
    image: DMTGIF,
    poster: DMTPoster,
    summary: '1st place hackathon win — property description text generation for JLL using Flask and Google Cloud.',
    tags: ['Python', 'Flask', 'GCP'],
  },
  {
    title: 'Google Tech Challenge',
    image: GoogleTechTeam,
    link: 'https://techchallenge.withgoogle.com/',
    summary: 'Top 10 finalist — led a team of 5 through coding challenges and riddles at Google Chicago.',
    tags: ['Algorithms', 'Teamwork'],
  },
  {
    title: 'Old Portfolio',
    image: OldPortfolioSS,
    link: '/oldPortfolio',
    summary: 'Interactive canvas portfolio — walk a character around and interact with objects. Collision detection included.',
    tags: ['JavaScript', 'Canvas'],
  },
  {
    title: 'Automated Desk Light',
    image: LightProjectSS,
    summary: 'iOS-controlled desk light. Raspberry Pi 4 client with Firebase real-time sync and a Swift mobile UI.',
    tags: ['Raspberry Pi', 'Swift', 'Firebase'],
  },
]

function Projects() {
  return (
    <div className='max-w-6xl mx-auto px-6 py-24 text-center'>
      <SectionHeading>Projects</SectionHeading>

      <div className='grid md:grid-cols-3 gap-6'>
        {featuredProjects.map((project, i) => (
          <ProjectCard key={project.title} featured delay={i * 0.1} {...project} />
        ))}
      </div>

      <p className='text-sm uppercase tracking-wider text-gray-400 mt-12 mb-6 text-left'>More projects</p>
      <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {moreProjects.map((project, i) => (
          <ProjectCard key={project.title} delay={i * 0.05} {...project} />
        ))}
      </div>
    </div>
  )
}

export default Projects
