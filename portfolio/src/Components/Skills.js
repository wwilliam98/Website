import React from 'react'
import { motion } from 'framer-motion'
import Skill from './Skill'

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

const skills = [
  { logo: PythonLogo,  name: 'Python',     proficiency: 100 },
  { logo: MysqlLogo,   name: 'MySQL',      proficiency: 100 },
  { logo: JsLogo,      name: 'JavaScript', proficiency: 100 },
  { logo: HtmlLogo,    name: 'HTML',       proficiency: 100 },
  { logo: ReactLogo,   name: 'React',      proficiency: 90  },
  { logo: MongoDBLogo, name: 'MongoDB',    proficiency: 90  },
  { logo: NodejsLogo,  name: 'Node.js',    proficiency: 90  },
  { logo: ExpressLogo, name: 'Express',    proficiency: 90  },
  { logo: PhpLogo,     name: 'PHP',        proficiency: 90  },
  { logo: TailwindLogo,name: 'Tailwind',   proficiency: 90  },
  { logo: CssLogo,     name: 'CSS',        proficiency: 80  },
  { logo: PandasLogo,  name: 'Pandas',     proficiency: 80  },
  { logo: LinuxLogo,   name: 'Linux',      proficiency: 85  },
  { logo: JavaLogo,    name: 'Java',       proficiency: 70  },
  { logo: CppLogo,     name: 'C++',        proficiency: 70  },
  { logo: PerlLogo,    name: 'Perl',       proficiency: 70  },
]

function Skills() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className='flex relative flex-col min-h-dvh justify-center items-center mx-auto px-6 max-w-5xl'
    >
      <div className='text-center mb-8 inline-block mx-auto'>
        <h3 className='text-2xl font-bold uppercase tracking-[8px] text-[#38BDF8]'>
          Technical Skills
        </h3>
        <div className='w-full h-[2px] bg-[#38BDF8]/60 mt-2 rounded-full' />
      </div>

      <div className='grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-8 gap-3 md:gap-4 place-items-center'>
        {skills.map((skill) => (
          <Skill key={skill.name} {...skill} />
        ))}
      </div>
    </motion.div>
  )
}

export default Skills
