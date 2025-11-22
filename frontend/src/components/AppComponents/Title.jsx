import React from 'react'

import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import SachdevaLogo from '../../assets/SachdevaLogo'

function Title() {
  return (
    <>
        <Link to="/" >
        <div className="flex items-center space-x-3">
            
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg pt-2">
              <SachdevaLogo
                src={assets.sechdeva_icon}  // use your real logo image path
                size={50}
                color="#ffffff"
              />
            
            </div>

            <h1 className=' text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent capitalize'>
                sechdeva RoadLines
            </h1>
        </div>
        </Link>
        
    </>
  )
}

export default Title