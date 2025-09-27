import { ChartBar, CreditCard, Lock, Users, UserCheck, Wallet } from "lucide-react";

export interface Module {
  id: number;
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
  children?: Module[];
}

export const modules: Module[] = [
  {
    id: 1,
    name: 'Usuarios',
    path: '/usuarios',
    icon: Users,
    roles: ['admin', 'manager']
  },
  {
    id: 2,
    name: 'Empleados',
    path: '/empleados',
    icon: UserCheck,
    roles: ['admin', 'manager']
  },
  {
    id: 3,
    name: 'Membresías',
    path: '/membresias',
    icon: CreditCard,
    roles: ['admin', 'manager', 'employee']
  },
  {
    id: 4,
    name: 'Caja',
    path: '/caja',
    icon: Wallet,
    roles: ['admin', 'manager', 'employee']
  },
  {
    id: 5,
    name: 'Reportes',
    path: '/reportes',
    icon: ChartBar,
    roles: ['admin', 'manager']
  },
  {
    id: 6,
    name: 'Acceso',
    path: '/acceso',
    icon: Lock,
    roles: ['admin', 'manager', 'employee']
  }
];

export const getModulesByRole = (userRole: string): Module[] => {
  return modules.filter(module => 
    module.roles.includes(userRole)
  );
};
