// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const Navbar = () => {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();
//   const [showDropdown, setShowDropdown] = useState(false);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <nav className="w-full bg-white text-blue-900 px-12 py-4 shadow flex items-center justify-between">
//       <span className="text-2xl font-bold tracking-wide">TRINITY HOSPITAL</span>
//       <span className="text-lg font-semibold">Doctor Dashboard</span>
      
//       {/* User Profile Dropdown */}
//       <div className="relative">
//         <button
//           onClick={() => setShowDropdown(!showDropdown)}
//           className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
//         >
//           <span className="font-semibold">
//             {user?.first_name || user?.username || 'Doctor'}
//           </span>
//           <svg 
//             className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
//             fill="none" 
//             stroke="currentColor" 
//             viewBox="0 0 24 24"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//           </svg>
//         </button>

//         {/* Dropdown Menu */}
//         {showDropdown && (
//           <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
//             <button
//               onClick={handleLogout}
//               className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//               </svg>
//               Logout
//             </button>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
