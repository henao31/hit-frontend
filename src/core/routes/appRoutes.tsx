import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import PrivateLayout from '../../components/PrivateLayout';

// Lazy loading para optimizar el rendimiento
//auth views
const Register = lazy(() => import('../../pages/auth/register/Register'));
const Login = lazy(() => import('../../pages/auth/login/Login'));
//backoffice views
const Usuarios = lazy(() => import('../../pages/backoffice/users/Usuarios'));
const Empleados = lazy(() => import('../../pages/backoffice/employe/Empleados'));
const Membresias = lazy(() => import('../../pages/backoffice/memberships/Memberships'));
const Caja = lazy(() => import('../../pages/Caja'));
const Reportes = lazy(() => import('../../pages/Reportes'));
const Access = lazy(() => import('../../pages/backoffice/access/access'));

//backoffice views
export const appRoutes: RouteObject[] = [
  // Rutas de autenticación
  {
    path: '/',
    children: [
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      }
    ]
  },
  
  // Rutas privadas (requieren autenticación)
  {
    path: '/',
    element: <PrivateLayout />,
    children: [
      {
        index: true,
        element: <Usuarios />
      },
      {
        path: 'usuarios',
        element: <Usuarios />
      },
      {
        path: 'empleados',
        element: <Empleados />
      },
      {
        path: 'membresias',
        element: <Membresias />
      },
      {
        path: 'caja',
        element: <Caja />
      },
      {
        path: 'reportes',
        element: <Reportes />
      },
      {
        path: 'acceso',
        element: <Access />
      }
    ]
  },
  
  // Redirección por defecto
  {
    path: '*',
    element: <div>Página no encontrada</div>
  }
];