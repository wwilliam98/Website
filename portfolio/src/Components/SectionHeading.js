import React from 'react'

function SectionHeading({ children }) {
  return (
    <div className='inline-block mb-12'>
      <h3 className='text-2xl font-bold uppercase tracking-[6px] text-[#38BDF8]'>
        {children}
      </h3>
      <div className='w-full h-[2px] bg-[#38BDF8]/60 mt-2 rounded-full' />
    </div>
  )
}

export default SectionHeading
