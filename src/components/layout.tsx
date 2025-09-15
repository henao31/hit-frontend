import { Link, Outlet } from "react-router-dom";
import { useLogin } from "../pages/auth/views/login/useLogin"; // ajusta la ruta según tu proyecto

export default function Layout() {
  const { logout } = useLogin();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 text-xl font-bold border-b">HIT GYM</div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/dashboard/usuarios"
                className="block p-2 rounded hover:bg-gray-200"
              >
                Usuarios
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/empleados"
                className="block p-2 rounded hover:bg-gray-200"
              >
                Empleados
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/membresias"
                className="block p-2 rounded hover:bg-gray-200"
              >
                Membresías
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/caja"
                className="block p-2 rounded hover:bg-gray-200"
              >
                Caja
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/reportes"
                className="block p-2 rounded hover:bg-gray-200"
              >
                Reportes
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-white shadow p-4">
          <h1 className="text-xl font-semibold">Panel Administrativo</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cerrar Sesión
          </button>
        </header>

        {/* Content */}
        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
