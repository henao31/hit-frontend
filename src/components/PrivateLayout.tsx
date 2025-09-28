import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getModulesByRole } from "../core/config/modules";

export default function PrivateLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeModule, setActiveModule] = useState<number>(1);
  const [userModules, setUserModules] = useState<any[]>([]);

  // Guardar user para no repetir JSON.parse
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = storedUser?.user_metadata?.role || "admin";
  const userEmail = storedUser?.user_metadata?.email || "Usuario";

  useEffect(() => {
    // Obtener módulos según el rol del usuario
    const modules = getModulesByRole(userRole) || [];
    setUserModules(modules);

    // Determinar el módulo activo basado en la ruta actual
    const currentPath = location.pathname;
    const activeModuleId =
      modules.find((module) => currentPath.includes(module.path))?.id || 1;

    setActiveModule(activeModuleId);
  }, [location.pathname, userRole]);

  const handleModuleClick = (moduleId: number, path?: string) => {
    setActiveModule(moduleId);
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white shadow-md flex flex-col">
        <div className="p-4 flex items-center gap-2 border-b border-gray-700">
          {/* Logo / Título */}
          <span className="text-cyan-400 text-2xl">⚡</span>
          <span className="text-xl font-bold">Panel</span>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {userModules.map((module) => (
              <li key={module.id}>
                <Link
                  to={module.path}
                  onClick={() => handleModuleClick(module.id, module.path)}
                  className={`flex items-center gap-3 p-2 rounded transition-colors ${
                    activeModule === module.id
                      ? "bg-cyan-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <module.icon className="w-5 h-5" />
                  <span className="font-medium">{module.name}</span>
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
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">Panel Administrativo</h1>
            <span className="text-sm text-gray-300 bg-gray-800 px-2 py-1 rounded-full">
              {userModules.find((m) => m.id === activeModule)?.name || "Dashboard"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">
              Bienvenido, {userEmail}
            </span>
            <button
              onClick={() => {
                localStorage.removeItem("user");
                navigate("/login");
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition flex items-center gap-2"
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 flex-1 overflow-y-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
