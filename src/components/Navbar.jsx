// import React, { useState, useMemo } from 'react';
// import { Home, Tag, Trophy, Music, User } from 'lucide-react';

// const navItems = [
//   { icon: Tag, name: 'Projects', index: 0 },
//   { icon: Trophy, name: 'Awards', index: 1 },
//   { icon: Home, name: 'Home', index: 2 },
//   { icon: Music, name: 'Media', index: 3 },
//   { icon: User, name: 'Profile', index: 4 },
// ];

// const NavItem = ({ icon: Icon, isActive, onClick, onMouseEnter, onMouseLeave }) => {
//   const baseClasses = "flex flex-1 items-center justify-center transition-colors duration-200 ease-in-out z-10 p-2 cursor-pointer";
  
//   const iconClasses = isActive
//     ? "text-white w-7 h-7 md:w-8 md:h-8" 
//     : "text-gray-500 w-6 h-6 md:w-7 md:h-7 group-hover:text-gray-700"; 

//   return (
//     <div 
//       className={`${baseClasses} group`} 
//       onClick={onClick}
//       onMouseEnter={onMouseEnter}
//       onMouseLeave={onMouseLeave}
//     >
//       <Icon className={iconClasses} />
//     </div>
//   );
// };

// const  Navbar = () => {

//   const [activeIndex, setActiveIndex] = useState(2);
//   const [hoverIndex, setHoverIndex] = useState(null);
//   const activeIndexToUse = hoverIndex !== null ? hoverIndex : activeIndex;

//   const totalItems = navItems.length;
//   const NAV_WIDTH_PX = totalItems * 80; 
//   const INDICATOR_SIZE_PX = 72;

//   const indicatorTransform = useMemo(() => {
//   const position = activeIndexToUse * (NAV_WIDTH_PX / totalItems);
    
//   const centerOffset = (NAV_WIDTH_PX / totalItems - INDICATOR_SIZE_PX) / 2;
    
//     return `translateX(${position + centerOffset}px)`;
//   }, [activeIndexToUse, totalItems]);

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
//       <div 
//         className="
//           relative 
//           bg-white 
//           py-2 
//           rounded-[48px] shadow-2xl 
//           flex justify-around items-center
//           overflow-visible 
//         "
//         style={{ width: `${NAV_WIDTH_PX}px` }}
//       >
//         <div
//           className="
//             absolute 
//             top-1/2 left-0 
//             rounded-full 
//             transition-all duration-500 ease-in-out
//             pointer-events-none 
//             flex items-center justify-center
            
//           "
//           style={{
//             width: `${INDICATOR_SIZE_PX}px`,
//             height: `${INDICATOR_SIZE_PX}px`,
//             transform: `${indicatorTransform} translateY(-50%) translateZ(0)`,

//             background: 'radial-gradient(circle at 50% 50%, #5A67D8 0%, #4F46E5 100%)',
//             boxShadow: '0 0 15px 7px rgba(99, 102, 241, 0.7), 0 0 30px 10px rgba(124, 58, 237, 0.5)',
//           }}
//         >
//           <div className="absolute w-full h-full rounded-full opacity-60" 
//                style={{ 
//                  background: 'radial-gradient(circle at 50% 50%, #818CF8 0%, transparent 70%)',
//                  filter: 'blur(15px)',
//                  transform: 'scale(1.3)'
//               }}
//           />
//         </div>

//         {/*  Nvigation Items */}
//         {navItems.map((item) => (
//           <NavItem 
//             key={item.index}
//             icon={item.icon}
//             isActive={activeIndexToUse === item.index}
//             onClick={() => setActiveIndex(item.index)}
//             onMouseEnter={() => setHoverIndex(item.index)}
//             onMouseLeave={() => setHoverIndex(null)} 
//           />
//         ))}


//         <div className="sr-only">
//           {navItems.map(item => (
//             <span key={item.name}>{item.name}</span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };


// export default Navbar;
