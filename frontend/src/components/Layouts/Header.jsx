import React from 'react'
import { Menu } from 'lucide-react'
import Them from '../AppComponents/Them';

function Header({ onToggleSidebar, onToggleMobile }) {
  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-0.5 sm:space-x-4">
          {/* ✅ Show button on all screens */}
          <button
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            // onClick={onToggleMobile}
            // Mobile toggle for small screens 
              onClick={() => {
                if (window.innerWidth < 640) onToggleMobile();
                else onToggleSidebar(); // Collapse toggle for sm and above
              }}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:block">
            <h1 className="text-2xl font-extrabold bg-gradient-to-l from-blue-500 via-pink-500 to-purple-600 bg-clip-text text-transparent capitalize">
              Sechdeva RoadLines
            </h1>
          </div>
          <div className="block md:hidden ">
            <h1 className="text-xl sm:text-lg font-extrabold bg-gradient-to-l from-blue-500 via-pink-500 to-purple-600 bg-clip-text text-transparent capitalize">
              Sechdeva RoadLines
            </h1>
          </div>
        </div>

        <div className="flex gap-3 md:gap-3 lg:gap-6 items-center">
          <div className='hidden sm:block'>
            <Them />
          </div>
        </div>
      </div>
    </div>
  );
}


export default Header