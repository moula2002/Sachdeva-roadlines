import React from 'react'
import { assets } from '../assets/assets';

export default function InitialImages({imageURL, title="Hubs"}) {
  return (
    <div
      className="w-full h-118 bg-center bg-cover bg-no-repeat flex items-center justify-center relative"
      style={{ backgroundImage: `url(${imageURL})` }}
    //   style={{ backgroundImage: `${imageURL}` }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content Layer */}
      <div className="relative z-10 text-center text-white">
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-4">Welcome to the {title}</h1>
        <p className="text-lg md:text-2xl">
          Manage your transport records and trucks {title.toLowerCase()} efficiently 
        </p>
      </div>
    </div>   
  );
}

export const Hub = () => <InitialImages imageURL={assets.i1} title={"Hub"} />;
export const Find = () => <InitialImages imageURL={assets.i2} title={"Find Hub"} />;
export const Filter = () => <InitialImages imageURL={assets.i3} title={"Filter"}  />;