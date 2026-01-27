import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Menu, ChevronDown, User as UserIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useForm } from 'react-hook-form';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Modal } from './ui/Modal';
import { UserData } from '../../types';

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface DashboardLayoutProps {
  title: string;
  user: UserData;
  menuItems: MenuItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onUpdateUser: (user: UserData) => void;
  children: React.ReactNode;
}

const ProfileEditModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
  onUpdate: (user: UserData) => void;
}> = ({ isOpen, onClose, user, onUpdate }) => {
  const { register, handleSubmit, reset } = useForm({ defaultValues: user });

  React.useEffect(() => {
    if (isOpen && user) reset(user);
  }, [isOpen, user, reset]);

  const onSubmit = (data: any) => {
    onUpdate({ ...user, email: data.email, celular: data.celular, password: data.password });
    onClose();
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mi Perfil">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-sm border border-slate-200">
          <div className="w-12 h-12 bg-[#003366] text-white rounded-full flex items-center justify-center text-lg font-bold">
            {user.nombres[0]}{user.apellidos[0]}
          </div>
          <div>
            <p className="font-bold text-slate-900">{user.nombres} {user.apellidos}</p>
            <p className="text-xs text-slate-500 font-mono">C.I: {user.cedula}</p>
          </div>
        </div>
        <Input label="Email Personal" {...register('email')} />
        <Input label="Teléfono Celular" {...register('celular')} />
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500 uppercase">
            <UserIcon className="w-3 h-3" /> Seguridad
          </div>
          <Input label="Nueva Contraseña" type="password" placeholder="••••••" {...register('password')} />
        </div>
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button className="flex-1">Guardar</Button>
        </div>
      </form>
    </Modal>
  );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  user,
  menuItems,
  activeTab,
  setActiveTab,
  onLogout,
  onUpdateUser,
  children
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      <ProfileEditModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={user}
        onUpdate={onUpdateUser}
      />

      {/* SIDEBAR */}
      <aside className={cn(
        "bg-[#003366] text-white flex flex-col transition-all duration-300 shadow-xl z-20",
        isCollapsed ? "w-16" : "w-48"
      )}>
        <div className="h-16 flex items-center justify-center border-b border-[#002244] bg-[#002855]">
          <div className="w-6 h-6 bg-white rounded-sm" />
          {!isCollapsed && <span className="ml-3 font-bold tracking-wide text-xs">SISTEMA</span>}
        </div>
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-sm text-xs transition-colors",
                activeTab === item.id
                  ? "bg-[#004aad] text-white shadow-sm font-medium"
                  : "text-blue-200 hover:bg-[#004080] hover:text-white",
                isCollapsed && "justify-center px-0"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="uppercase">{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-[#002244] bg-[#002855]">
          <button
            onClick={onLogout}
            className={cn(
              "flex items-center gap-3 text-red-200 hover:text-white w-full",
              isCollapsed && "justify-center"
            )}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="text-xs font-bold uppercase">Salir</span>}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-slate-500 hover:text-[#003366]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-bold text-[#003366] uppercase tracking-wide">
              {menuItems.find((i) => i.id === activeTab)?.label}
            </h2>
          </div>

          {/* USER PROFILE TRIGGER */}
          <button
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-3 pl-4 pr-2 py-1.5 rounded-sm hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 group"
          >
            <div className="text-right hidden sm:block">
              <span className="block text-xs font-bold text-slate-800 uppercase group-hover:text-[#003366]">
                {user.nombres}
              </span>
              <span className="block text-[10px] text-slate-400 font-mono">{user.cedula}</span>
            </div>
            <div className="w-8 h-8 bg-[#003366] text-white rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform">
              {user.nombres[0]}{user.apellidos[0]}
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-[#003366]" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-slate-100">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
