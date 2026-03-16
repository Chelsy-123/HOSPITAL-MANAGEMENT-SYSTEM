import { NavLink } from "react-router-dom";
import { HiOutlineHome, HiOutlineCalendar, HiOutlineUserGroup, HiOutlineDocumentReport } from "react-icons/hi";

const navItems = [
  { to: "/doctor/dashboard", icon: <HiOutlineHome size={22} />, label: "Home" },
  { to: "/doctor/appointments", icon: <HiOutlineCalendar size={22} />, label: "Appointments" },
  { to: "/doctor/patients", label: "Patients", icon: <HiOutlineUserGroup size={22} /> },
  { to: "/doctor/reports", icon: <HiOutlineDocumentReport size={22} />, label: "Reports" }
];

const DoctorSidebar = () => (
  <aside className="w-48 bg-blue-900 min-h-screen py-8 flex flex-col shadow-lg">
    <nav className="flex-1">
      {navItems.map(({ to, icon, label }) => (
        <NavLink
          to={to}
          key={label}
          className={({ isActive }) =>
            `flex flex-col items-center py-4 my-1 font-medium transition
            ${isActive ? 'bg-white/10 text-white font-bold' : 'text-white hover:bg-white/10'}
            `
          }
          title={label}
          style={{}}
        >
          <span className="text-white">{icon}</span>
          <span className="mt-1 text-sm text-white">{label}</span>
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default DoctorSidebar;
