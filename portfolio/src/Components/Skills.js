import React from 'react'
import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'

import PythonLogo from "../Images/pythonlogo.jpeg"
import MysqlLogo from "../Images/MysqlLogo.png"
import JsLogo from "../Images/jslogo.png"
import HtmlLogo from "../Images/HTMLlogo.jpeg"
import PhpLogo from "../Images/phplogo.jpeg"
import ReactLogo from "../Images/reactlogo.png"
import MongoDBLogo from "../Images/mongodblogo.png"
import ExpressLogo from "../Images/expresslogo.png"
import TailwindLogo from "../Images/tailwindlogo.png"
import NodejsLogo from "../Images/Nodejslogo.png"
import PandasLogo from "../Images/pandaslogo.png"
import LinuxLogo from "../Images/LinuxLogo.png"
import PerlLogo from "../Images/perllogo.jpeg"
import JavaLogo from "../Images/javalogo.png"
import CppLogo from "../Images/cpplogo.png"
import CssLogo from "../Images/CSSlogo.png"
import OpenCVLogo from "../Images/OpenCVlogo.png"

const skillGroups = [
  {
    category: 'Languages',
    skills: [
      { logo: PythonLogo, name: 'Python' },
      { logo: JsLogo, name: 'JavaScript' },
      { logo: JavaLogo, name: 'Java' },
      { logo: CppLogo, name: 'C++' },
      { logo: PhpLogo, name: 'PHP' },
      { logo: PerlLogo, name: 'Perl' },
    ],
  },
  {
    category: 'AI & data',
    skills: [
      { logo: OpenCVLogo, name: 'OpenCV' },
      { logo: PandasLogo, name: 'Pandas' },
      { logo: MysqlLogo, name: 'MySQL' },
      { logo: MongoDBLogo, name: 'MongoDB' },
    ],
  },
  {
    category: 'Web',
    skills: [
      { logo: ReactLogo, name: 'React' },
      { logo: NodejsLogo, name: 'Node.js' },
      { logo: ExpressLogo, name: 'Express' },
      { logo: TailwindLogo, name: 'Tailwind' },
      { logo: HtmlLogo, name: 'HTML' },
      { logo: CssLogo, name: 'CSS' },
    ],
  },
  {
    category: 'Tools',
    skills: [
      { logo: LinuxLogo, name: 'Linux' },
    ],
  },
]

function Skills() {
  return (
    <div className='max-w-4xl mx-auto px-6 py-24 text-center'>
      <SectionHeading>Technical skills</SectionHeading>

      <div className='space-y-8 text-left'>
        {skillGroups.map((group, gi) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: gi * 0.1 }}
            viewport={{ once: true }}
          >
            <p className='text-sm uppercase tracking-wider text-gray-400 mb-3'>{group.category}</p>
            <div className='flex flex-wrap gap-2.5'>
              {group.skills.map(({ logo, name }) => (
                <span
                  key={name}
                  className='flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-200 hover:border-[#38BDF8]/50 hover:bg-[#38BDF8]/10 transition-colors duration-200'
                >
                  <img src={logo} alt="" loading="lazy" className='w-5 h-5 rounded-full object-cover' />
                  {name}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Skills
