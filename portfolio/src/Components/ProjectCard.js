import React from 'react'
import { motion } from 'framer-motion'

function ProjectCard({ index, total, title, image, description, link, carousel }) {
  const counter = `${String(index).padStart(2, '0')} / ${String(total).padStart(2, '0')}`

  const renderImage = () => {
    const imgClass = 'w-[400px] h-[200px] sm:w-[600px] sm:h-[300px] md:w-[800px] md:h-[400px] rounded-lg object-cover'

    if (carousel) {
      return (
        <div className='overflow-hidden no-scrollbar w-[400px] h-[200px] sm:w-[600px] sm:h-[300px] md:w-[800px] md:h-[400px] rounded-lg'>
          <motion.div
            className='flex gap-4'
            initial={{ x: '33%' }}
            animate={{ x: '-133%' }}
            transition={{ repeat: Infinity, repeatType: 'loop', duration: 30, ease: 'linear' }}
          >
            {carousel.map((src, i) => (
              <img key={i} src={src} alt={`${title} ${i + 1}`} className={imgClass} />
            ))}
          </motion.div>
        </div>
      )
    }

    if (link) {
      return (
        <a href={link}>
          <img src={image} alt={title} className={`${imgClass} transition-all duration-300 hover:opacity-80`} />
        </a>
      )
    }

    return <img src={image} alt={title} className={`${imgClass} transition-all duration-300`} />
  }

  return (
    <motion.div
      initial={{ x: 80, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className='w-dvw flex-shrink-0 snap-center flex flex-col space-y-8 items-center justify-start pt-6 px-5 relative'
    >
      <span className='absolute top-4 right-6 text-6xl font-bold text-white/[0.06] select-none pointer-events-none'>
        {counter}
      </span>

      {renderImage()}

      <div className='space-y-4 max-w-3xl w-full px-4'>
        <h4 className='text-3xl md:text-4xl font-bold text-center'>
          <span className='text-[#38BDF8]/60 text-lg font-normal mr-3 uppercase tracking-widest'>Project {index} of {total}</span>
          <br />
          {link ? (
            <a href={link} className='underline decoration-[#38BDF8]/50 transition-all duration-300 opacity-70 hover:opacity-100'>
              {title}
            </a>
          ) : (
            <span className='opacity-90'>{title}</span>
          )}
        </h4>

        <p className='text-sm sm:text-base text-gray-400 text-center md:text-left leading-relaxed'>
          {description}
        </p>
      </div>
    </motion.div>
  )
}

export default ProjectCard
