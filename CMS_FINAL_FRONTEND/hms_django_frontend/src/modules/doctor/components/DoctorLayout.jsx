import React from 'react';
import DoctorSidebar from './DoctorSidebar';
import DoctorNavbar from './DoctorNavbar';

const DoctorLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar at the top */}
      <DoctorNavbar />
      
      <div className="flex">
        {/* Sidebar on the left */}
        <DoctorSidebar />
        
        {/* Main content area */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
