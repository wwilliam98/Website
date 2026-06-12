import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowTopRightOnSquareIcon, PlayIcon } from '@heroicons/react/24/solid'

function Tags({ tags }) {
  return (
    <div className='flex flex-wrap gap-2'>
      {tags.map((tag) => (
        <span key={tag} className='text-xs px-2.5 py-0.5 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20'>
          {tag}
        </span>
      ))}
    </div>
  )
}

function Title({ title, link }) {
  if (!link) return <h4 className='text-lg font-semibold'>{title}</h4>
  return (
    <a href={link} className='group/link flex items-center gap-1.5 text-lg font-semibold hover:text-[#38BDF8] transition-colors duration-200'>
      {title}
      <ArrowTopRightOnSquareIcon className='w-4 h-4 text-gray-500 group-hover/link:text-[#38BDF8]' />
    </a>
  )
}

function Media({ image, poster, title, link, featured }) {
  const [playing, setPlaying] = useState(false)
  const imgClass = `w-full object-cover ${featured ? 'h-48' : 'h-36'}`
  const img = (
    <img
      src={poster && !playing ? poster : image}
      alt={title}
      loading="lazy"
      className={imgClass}
    />
  )

  return (
    <div className='relative'>
      {link ? <a href={link}>{img}</a> : img}
      {poster && !playing && (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play ${title} preview`}
          className='absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/15 transition-colors duration-200'
        >
          <span className='w-12 h-12 rounded-full bg-[#38BDF8] flex items-center justify-center shadow-lg'>
            <PlayIcon className='w-6 h-6 text-gray-900 ml-0.5' />
          </span>
        </button>
      )}
    </div>
  )
}

function ProjectCard({ title, image, poster, metric, description, summary, link, tags, featured, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className='flex flex-col rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-[#38BDF8]/40 transition-colors duration-300'
    >
      <Media image={image} poster={poster} title={title} link={link} featured={featured} />

      {featured ? (
        <div className='flex flex-col flex-1 p-5 space-y-3 text-left'>
          <Title title={title} link={link} />
          {metric && <p className='text-sm font-semibold text-[#38BDF8]'>{metric}</p>}
          <ul className='list-disc ml-4 space-y-1.5 text-sm text-gray-300 leading-relaxed flex-1'>
            {description.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
          <Tags tags={tags} />
        </div>
      ) : (
        <div className='flex flex-col flex-1 p-4 space-y-2.5 text-left'>
          <Title title={title} link={link} />
          <p className='text-sm text-gray-400 leading-relaxed flex-1'>{summary}</p>
          <Tags tags={tags} />
        </div>
      )}
    </motion.div>
  )
}

export default ProjectCard
