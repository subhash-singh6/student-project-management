import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();

  // Role ke hisaab se menu items
  const menuItems = {
    student: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "My Team", path: "/my-team" },
      { name: "Projects", path: "/projects" },
    ],
    teacher: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Review Projects", path: "/review-projects" },
      { name: "All Teams", path: "/teams" },
    ],
    admin: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Manage Users", path: "/admin/users" },
    ]
  };

  return (
    <>
      {/* Sidebar Overlay (Mobile par click karne par close ho jayega) */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-slate-900 text-white transition-transform transform z-40 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="p-6 text-2xl font-bold border-b border-slate-700">SPMS Portal</div>
        
        <nav className="mt-6">
          {(menuItems[user?.role] || []).map((item) => (
            <NavLink 
              key={item.name} 
              to={item.path}
              className="block py-3 px-6 hover:bg-slate-800 transition"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;