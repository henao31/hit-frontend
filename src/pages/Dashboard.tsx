import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout";
import Usuarios from "./Usuarios";
import Empleados from "./Empleados";
import Membresias from "./Membresias";
import Caja from "./Caja";
import Reportes from "./Reportes";

const Dashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="usuarios" replace />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="empleados" element={<Empleados />} />
        <Route path="membresias" element={<Membresias />} />
        <Route path="caja" element={<Caja />} />
        <Route path="reportes" element={<Reportes />} />
      </Route>
    </Routes>
  );
};

export default Dashboard;
