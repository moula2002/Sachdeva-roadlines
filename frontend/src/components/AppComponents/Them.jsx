import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { Moon, Sun } from 'lucide-react'


export default function Them() {
    const { them, setThem } = useContext(AppContext);
  return (
        
    <div className='bg-zinc-300 p-1  rounded-lg dark:bg-zinc-600/80 inline-block sm:block '>
      <button 
          className={` bg-transparent p-1 hover:bg-zinc-400 rounded-sm dark:hover:bg-zinc-600 hover:cursor-pointer font-bold 
              ${them ? "bg-zinc-500" :"bg-zinc-200 " }`} 
          onClick={() => setThem(!them)}>
              {them 
              ? <Moon className='w-5 h-5 text-sky-600'/> 
              : <Sun className='w-5 h-5 text-yellow-500'/>}
      </button>
    </div>
    
  )
}
