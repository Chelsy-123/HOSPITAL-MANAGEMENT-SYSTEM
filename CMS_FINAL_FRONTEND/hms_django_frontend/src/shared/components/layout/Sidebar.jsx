//  import { NavLink } from "react-router-dom";

// const navItems = [
//   { to: "/doctor/dashboard", icon: "🏠", label: "Home" },
//   { to: "/doctor/appointments", icon: "📅", label: "Appointments" },
//   { to: "/doctor/patients", icon: "👥", label: "Patients" },
//   { to: "/doctor/reports", icon: "📊", label: "Reports" }
// ];

// const Sidebar = () => (
//   <aside style={{
//     width: 75, background: "#7267F0", display: "flex", flexDirection: "column",
//     alignItems: "center", padding: "2rem 0", minHeight: "100vh"
//   }}>
//     <div style={{ marginBottom: "2rem", fontSize: "2.3rem" }}>💊</div>
//     {navItems.map(({ to, icon, label }) => (
//       <NavLink
//         to={to}
//         key={label}
//         style={{
//           display: "flex", flexDirection: "column", alignItems: "center",
//           margin: "1.2rem 0", color: "#fff", fontSize: "1.5rem", textDecoration: "none"
//         }}
//         activeStyle={{ background: "#fff", color: "#7267F0" }}
//         title={label}
//       >
//         <span>{icon}</span>
//         <span style={{ fontSize: "0.8rem", marginTop: "0.2em" }}>{label}</span>
//       </NavLink>
//     ))}
//   </aside>
// );

// export default Sidebar;

