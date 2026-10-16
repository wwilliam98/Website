import React from 'react'
import SectionHeading from './SectionHeading'
import ProjectCard from './ProjectCard'
import content from '../data/content.json'

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

// Project text lives in data/content.json (shared with the chat assistant); media is keyed by project id
const media = {
  'ocr': { image: OCRGIF, poster: OCRPoster },
  'wafer-alignment': { image: AlignmentGIF, poster: AlignmentPoster },
  'pathfinding-visualizer': { image: PathfinderGIF, poster: PathfinderPoster },
  'sudoku-solver': { image: SudokuGIF },
  'dare-mighty-things': { image: DMTGIF, poster: DMTPoster },
  'google-tech-challenge': { image: GoogleTechTeam },
  'old-portfolio': { image: OldPortfolioSS },
  'desk-light': { image: LightProjectSS },
}

const withMedia = (project) => ({ ...project, ...media[project.id] })
const featuredProjects = content.featuredProjects.map(withMedia)
const moreProjects = content.moreProjects.map(withMedia)

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
