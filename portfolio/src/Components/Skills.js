import React from 'react'
import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'
import content from '../data/content.json'

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

// Skill names live in data/content.json (shared with the chat assistant); logos are keyed by name
const logos = {
  'Python': PythonLogo, 'JavaScript': JsLogo, 'Java': JavaLogo, 'C++': CppLogo, 'PHP': PhpLogo, 'Perl': PerlLogo,
  'OpenCV': OpenCVLogo, 'Pandas': PandasLogo, 'MySQL': MysqlLogo, 'MongoDB': MongoDBLogo,
  'React': ReactLogo, 'Node.js': NodejsLogo, 'Express': ExpressLogo, 'Tailwind': TailwindLogo, 'HTML': HtmlLogo, 'CSS': CssLogo,
  'Linux': LinuxLogo,
}
const skillGroups = content.skillGroups.map((group) => ({
  ...group,
  skills: group.skills.map((name) => ({ name, logo: logos[name] })),
}))

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
