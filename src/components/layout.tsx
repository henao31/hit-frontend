import { Link, Outlet, useLocation } from "react-router-dom";
import { FaUsers, FaUserTie, FaCreditCard, FaCashRegister, FaChartBar, FaDumbbell } from "react-icons/fa";
import { useLogin } from "../pages/auth/views/login/useLogin"; // ajusta la ruta

export default function Layout() {
  const { logout } = useLogin();
  const location = useLocation();

  const links = [
    { to: "/dashboard/usuarios", label: "Usuarios", icon: <FaUsers /> },
    { to: "/dashboard/empleados", label: "Empleados", icon: <FaUserTie /> },
    { to: "/dashboard/membresias", label: "Membresías", icon: <FaDumbbell /> },
    { to: "/dashboard/caja", label: "Caja", icon: <FaCashRegister /> },
    { to: "/dashboard/reportes", label: "Reportes", icon: <FaChartBar /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white shadow-md flex flex-col">
        <div className="p-4 flex items-center gap-2 border-b border-gray-700">
          {/* Icono placeholder para el logo */}
          <FaDumbbell className="text-cyan-400 text-2xl" />
          <span className="text-xl font-bold">HIT GYM</span>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex items-center gap-2 p-2 rounded transition-colors ${
                    location.pathname === link.to
                      ? "bg-cyan-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-gray-900 text-white shadow p-4">
          <h1 className="text-xl font-semibold">Panel Administrativo</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Cerrar Sesión
          </button>
        </header>

        {/* Content */}
        <main className="p-6 flex-1 overflow-y-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
