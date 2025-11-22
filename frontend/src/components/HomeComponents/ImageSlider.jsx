// import { useState, useEffect } from "react";
// import {assets} from '../../assets/assets';

// const sliderImageData = [
//   {url: assets.slide1img },
//   {url: assets.slide2img },
//   {url: assets.slide3img },
//   {url: assets.slide4img },
//   {url: assets.slide5img },
//   {url: assets.slide6img },
// ] 

// export const ImageSlider = () => {
//   // const {url, title} = sliderImage 

//   const [ currentIndex, setCurrentIndex ] = useState(0);

//   const goToPrevious = () => {
//     const isFirstSlide = currentIndex === 0;
//     //    Length 7 but item 6                0   ?     7 -1 = 6      : 0 -1 = -1
//     const newIndex = isFirstSlide ? sliderImageData.length - 1 : currentIndex - 1;
//     setCurrentIndex(newIndex)
//   }

//   const goToNext = () => {
//     const isLastSlider = currentIndex === sliderImageData.length -1; 
//     const nextSlider = isLastSlider ? 0 : currentIndex + 1;   // 7 ? 0 : 0+1 = 1
//     setCurrentIndex(nextSlider) 
//   }

//   const goToSlide = (slideIndex) => {
//     setCurrentIndex(slideIndex)
//   }

//   // Auto change slide every 3 seconds
  
//   useEffect(() => {
//     // image slider null controll
//     if (sliderImageData.length === 0) return;

//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) =>
//       prevIndex === 0 ? sliderImageData.length - 1 : prevIndex - 1
//     );
//     },4000 ) // 4000ms = 3s
    
//     // Cleanup on unmount
//     return () => clearInterval(interval); 
//   }, [sliderImageData.length]);
 
//   return (
//     <div  className='w-[100%] h-[540px] mx-auto mb-10 relative flex-wrap box-border rounded-b-xl' 
//       style={{boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px"}}>
     
//       <div 
//         style={{backgroundImage: `url(${sliderImageData[currentIndex].url})`}} 
//         className='w-full h-full rounded-b-xl bg-cover bg-center'>
//       </div>

//       <div 
//         className=" absolute z-10 text-5xl text-white cursor-pointer right-4 hover:text-[darkcyan] top-1/2 -translate-y-1/2" 
//         onClick={goToPrevious}> &#10097; </div>
//       <div 
//         className="absolute z-10 text-5xl text-white cursor-pointer left-4 hover:text-[darkcyan] top-1/2 -translate-y-1/2" 
//         onClick={goToNext}> &#10096; </div>
      
//       <div
//         className="absolute left-26 max-w-xl w-full bottom-[17%]">
//         <h1 
//           className=" text-5xl md:text-8xl font-extrabold text-white text-shadow-2xs text-shadow-pink-500 ">
//           Sachdeva Roadlines
//         </h1>
//       </div>

//       <div className="absolute bottom-4 gap-3 z-10 left-1/2 -translate-x-1/2">
        
//         {sliderImageData.map((slid, index) => (
//           <span key={index} 
//             onClick={() => goToSlide(index)} 
//             style={{color: currentIndex === index ? "darkmagenta": null }}
//             className="text-3xl text-cyan-600 mx-1 cursor-pointer"
//           >&#9679;</span>
//         ))}
//       </div>      
//     </div>
//   )
// } 


import { useState, useEffect } from "react";
import { assets } from '../../assets/assets';

const sliderImageData = [
  { url: assets.slide1img },
  { url: assets.slide2img },
  { url: assets.slide3img },
  { url: assets.slide4img },
  { url: assets.slide5img },
  { url: assets.slide6img },
];

export const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirst = currentIndex === 0;
    setCurrentIndex(isFirst ? sliderImageData.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    const isLast = currentIndex === sliderImageData.length - 1;
    setCurrentIndex(isLast ? 0 : currentIndex + 1);
  };

  const goToSlide = (index) => setCurrentIndex(index);

  // Auto slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderImageData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-64 sm:h-96 md:h-[540px] mx-auto mb-10 rounded-b-xl overflow-hidden shadow-[0px_54px_55px_rgba(0,0,0,0.25),0px_-12px_30px_rgba(0,0,0,0.12),0px_4px_6px_rgba(0,0,0,0.12),0px_12px_13px_rgba(0,0,0,0.17),0px_-3px_5px_rgba(0,0,0,0.09)]">
      
      {/* Background Image */}
      <div
        style={{ backgroundImage: `url(${sliderImageData[currentIndex].url})` }}
        className="w-full h-full bg-cover bg-center transition-all duration-700"
      ></div>

      {/* Navigation Arrows */}
      <div
        className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 text-3xl sm:text-5xl text-white cursor-pointer hover:text-cyan-400 z-10"
        onClick={goToPrevious}
      >
        &#10096;
      </div>
      <div
        className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 text-3xl sm:text-5xl text-white cursor-pointer hover:text-cyan-400 z-10"
        onClick={goToNext}
      >
        &#10097;
      </div>

      {/* Title */}
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 text-center px-4 sm:px-0">
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl sm:text-nowrap font-extrabold text-white drop-shadow-lg">
          Sachdeva Roadlines
        </h1>
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {sliderImageData.map((_, index) => (
          <span
            key={index}
            onClick={() => goToSlide(index)}
            className={`cursor-pointer text-xl sm:text-3xl ${
              currentIndex === index ? "text-magenta-700" : "text-cyan-400"
            }`}
          >
            &#9679;
          </span>
        ))}
      </div>
    </div>
  );
};

