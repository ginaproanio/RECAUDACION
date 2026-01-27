import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Users, Layers, Database, LayoutDashboard, Edit2, Trash2, FileStack, Eye, Plus, Loader2
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Modal } from './ui/Modal';
import { usersApi, rubrosApi, adminApi } from '../../services/api';
import { UserData, RubroDefinition, Debt, CodeItem } from '../../types';

interface AdminModuleProps {
  user: UserData | null;
  onLogout: () => void;
  onImpersonate: (user: UserData) => void;
  onUpdateUser: (user: UserData | null) => void;
}

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

const calculateAge = (birthDateString: string): number => {
  if (!birthDateString) return 0;
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};

const AdminModule: React.FC<AdminModuleProps> = ({
  user,
  onLogout,
  onImpersonate,
  onUpdateUser
}) => {
  const [tab, setTab] = useState('gen');
  const [users, setUsers] = useState<UserData[]>([]);
  const [rubros, setRubros] = useState<RubroDefinition[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { register: regGen, handleSubmit: subGen } = useForm();
  const { register: regRubro, handleSubmit: subRubro, reset: resRubro, setValue: setRubroVal } = useForm();
  const { register: regUser, handleSubmit: subUser, reset: resUser, setValue: setUserVal } = useForm();

  const [editingRubro, setEditingRubro] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [tempCodes, setTempCodes] = useState<CodeItem[]>([]);
  const [codeTxt, setCodeTxt] = useState('');
  const [viewDocUser, setViewDocUser] = useState<UserData | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersData, rubrosData] = await Promise.all([
          usersApi.getAll(),
          rubrosApi.getAll()
        ]);
        setUsers(usersData);
        setRubros(rubrosData);
        // TODO: Fetch debts for admin view
        setDebts([]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const saveRubro = async (data: any) => {
    try {
      const rData = {
        nombre: data.nombre,
        montoDefecto: parseFloat(data.monto),
        aplicaDescuento: data.aplicaDescuento,
        porcentajeDescuento: parseFloat(data.porcentajeDescuento || 0)
      };

      if (editingRubro) {
        // TODO: Implement update API call when available
        alert('Actualización de rubros próximamente disponible');
      } else {
        await rubrosApi.create(rData);
        // Refresh rubros list
        const updatedRubros = await rubrosApi.getAll();
        setRubros(updatedRubros);
      }
      setEditingRubro(null);
      resRubro();
    } catch (error) {
      alert('Error al guardar rubro: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  const saveUser = async (data: any) => {
    if (tempCodes.length === 0) return alert("Ingrese al menos un código");

    try {
      const uData = {
        cedula: data.cedula,
        nombres: data.nombres,
        apellidos: data.apellidos,
        email: data.email,
        celular: data.celular,
        fechaNacimiento: data.fechaNacimiento,
        tieneDiscapacidad: data.tieneDiscapacidad || false,
        codigos: tempCodes
      };

      if (editingUser) {
        // TODO: Implement update API call when available
        alert('Actualización de usuarios próximamente disponible');
      } else {
        await usersApi.create(uData);
        // Refresh users list
        const updatedUsers = await usersApi.getAll();
        setUsers(updatedUsers);
      }
      setEditingUser(null);
      resUser();
      setTempCodes([]);
    } catch (error) {
      alert('Error al guardar usuario: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  // TODO: API Integration - Debt Generation
  // This function will be replaced with API call to POST /api/admin/generate-debts
  // Payload: { rubroId, month, year, alcance?, codigoEspecifico? }
  // Response: { success: boolean, generatedCount: number, errors?: string[] }
  const generateDebts = async (data: any) => {
    // Placeholder: Show loading state
    alert('Funcionalidad en desarrollo - Próximamente disponible');
    // Future implementation:
    // const response = await api.post('/api/admin/generate-debts', data);
    // if (response.success) {
    //   alert(`Generadas ${response.generatedCount} deudas.`);
    //   // Refresh debts list
    // }
  };

  const menu = [
    { id: 'gen', label: 'Emisión', icon: Layers },
    { id: 'rubros', label: 'Rubros', icon: Database },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'stats', label: 'Reportes', icon: LayoutDashboard },
  ];

  return (
    <DashboardLayout
      title="ADMIN"
      user={user}
      menuItems={menu}
      activeTab={tab}
      setActiveTab={setTab}
      onLogout={onLogout}
      onUpdateUser={onUpdateUser}
    >
      <Modal isOpen={!!viewDocUser} onClose={() => setViewDocUser(null)} title="Expediente Digital">
        {viewDocUser?.documents.length === 0 ? (
          <p className="text-slate-500 italic text-sm">Sin documentos.</p>
        ) : (
          <div className="space-y-2">
            {viewDocUser?.documents.map(d => (
              <div key={d.id} className="flex justify-between items-center p-3 bg-slate-50 border rounded-sm text-sm">
                <span className="flex items-center gap-2 font-medium">
                  <FileStack className="w-4 h-4 text-blue-600" /> {d.name}
                </span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full uppercase font-bold">
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {tab === 'gen' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 text-xs uppercase">Nueva Emisión</h3>
            <form onSubmit={subGen(generateDebts)} className="space-y-4">
              <Select label="Rubro" {...regGen('rubroId')}>
                {rubros.map((r) => <option key={r.id} value={r.id}>{r.nombre} (${r.montoDefecto})</option>)}
              </Select>
              <div className="grid grid-cols-2 gap-4">
                <Select label="Mes" {...regGen('mes')}>
                  {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
                </Select>
                <Select label="Año" {...regGen('anio')}>
                  <option value="2026">2026</option>
                </Select>
              </div>
              <Button className="w-full">Procesar Emisión</Button>
            </form>
          </div>
          <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden flex flex-col h-96">
            <div className="bg-slate-50 p-3 border-b text-xs font-bold uppercase text-slate-600">Historial Reciente</div>
            <div className="overflow-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="bg-white sticky top-0">
                  <tr className="border-b">
                    <th className="p-3">Periodo</th>
                    <th className="p-3">Detalle</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {debts.slice().reverse().map((d: Debt) => (
                    <tr key={d.id} className="border-b last:border-0 hover:bg-slate-50">
                      <td className="p-3 text-slate-500 font-mono text-xs">{d.periodo}</td>
                      <td className="p-3 font-medium">{d.nombreRubro} <span className="text-slate-400 text-xs">({d.codigoValor})</span></td>
                      <td className="p-3 text-right font-mono font-bold">${d.montoFinal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'rubros' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white p-6 rounded-sm border shadow-sm h-fit">
            <h3 className="font-bold text-xs uppercase mb-4 text-slate-800">
              {editingRubro ? 'Editar Rubro' : 'Nuevo Rubro'}
            </h3>
            <form onSubmit={subRubro(saveRubro)} className="space-y-3">
              <Input label="Descripción" {...regRubro('nombre', { required: true })} />
              <Input label="Valor ($)" type="number" step="0.01" {...regRubro('monto', { required: true })} />
              <div className="p-3 bg-slate-50 rounded-sm space-y-2 border border-slate-100">
                <label className="flex items-center gap-2 text-xs font-bold uppercase">
                  <input type="checkbox" {...regRubro('aplicaDescuento')} /> Aplica Descuento
                </label>
                <Input placeholder="% Descuento" type="number" {...regRubro('porcentajeDescuento')} />
              </div>
              <Button className="w-full">Guardar</Button>
              {editingRubro && (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => { setEditingRubro(null); resRubro(); }}
                >
                  Cancelar
                </Button>
              )}
            </form>
          </div>
          <div className="md:col-span-2 bg-white rounded-sm border shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b text-xs uppercase text-slate-500">
                <tr>
                  <th className="p-3">Rubro</th>
                  <th className="p-3 text-right">Valor</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rubros.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-slate-50">
                    <td className="p-3 font-medium">{r.nombre}</td>
                    <td className="p-3 text-right font-mono">${r.montoDefecto.toFixed(2)}</td>
                    <td className="p-3 flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditingRubro(r.id);
                          resRubro();
                          setRubroVal('nombre', r.nombre);
                          setRubroVal('monto', r.montoDefecto);
                          setRubroVal('aplicaDescuento', r.aplicaDescuento);
                          setRubroVal('porcentajeDescuento', r.porcentajeDescuento);
                        }}
                        className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setRubros(rubros.filter((x) => x.id !== r.id))}
                        className="text-red-600 hover:bg-red-50 p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-5 rounded-sm border shadow-sm h-fit">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xs uppercase">{editingUser ? 'Editando' : 'Registrar'}</h3>
              {editingUser && (
                <button
                  onClick={() => { setEditingUser(null); resUser(); setTempCodes([]); }}
                  className="text-xs text-red-600 font-bold hover:underline"
                >
                  CANCELAR
                </button>
              )}
            </div>
            <form onSubmit={subUser(saveUser)} className="space-y-3">
              <Input label="Cédula" {...regUser('cedula')} />
              <Input label="Nombres" {...regUser('nombres')} />
              <Input label="Apellidos" {...regUser('apellidos')} />
              <Input label="Email" {...regUser('email')} />
              <Input label="Celular" {...regUser('celular')} />
              <Input label="Fecha Nac." type="date" {...regUser('fechaNacimiento')} />
              <div className="bg-slate-50 p-2 rounded-sm border border-slate-100">
                <div className="flex gap-2 mb-2">
                  <Input
                    value={codeTxt}
                    onChange={(e: any) => setCodeTxt(e.target.value)}
                    placeholder="NUEVO CÓDIGO"
                    className="h-8"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      if (codeTxt) setTempCodes([...tempCodes, { id: Date.now().toString(), valor: codeTxt, descripcion: '' }]);
                      setCodeTxt('');
                    }}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {tempCodes.map(c => (
                    <span key={c.id} className="text-[10px] bg-white border px-2 py-0.5 rounded-sm font-mono">
                      {c.valor}
                    </span>
                  ))}
                </div>
              </div>
              <Button className="w-full">Guardar Usuario</Button>
            </form>
          </div>
          <div className="lg:col-span-2 bg-white border rounded-sm shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b text-xs uppercase text-slate-500 sticky top-0">
                  <tr>
                    <th className="p-3">Usuario</th>
                    <th className="p-3">Códigos</th>
                    <th className="p-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-slate-50 group">
                      <td className="p-3">
                        <div className="font-bold text-slate-800">{u.nombres} {u.apellidos}</div>
                        <div className="text-xs text-slate-500 font-mono">{u.cedula}</div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {u.codigos.map((c) => (
                            <span key={c.id} className="text-[10px] bg-slate-100 px-1 border rounded text-slate-600">
                              {c.valor}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 flex justify-center gap-2">
                        <button
                          onClick={() => setViewDocUser(u)}
                          className="text-slate-400 hover:text-blue-800"
                          title="Docs"
                        >
                          <FileStack className="w-4 h-4" />
                        </button>
                        {/* TODO: Remove impersonation - Security Risk */}
                        {/* <button onClick={() => onImpersonate(u)} className="text-slate-400 hover:text-green-600" title="Login">
                          <Eye className="w-4 h-4" />
                        </button> */}
                        <button
                          onClick={() => {
                            setEditingUser(u.id);
                            setUserVal('cedula', u.cedula);
                            setUserVal('nombres', u.nombres);
                            setUserVal('apellidos', u.apellidos);
                            setUserVal('email', u.email);
                            setUserVal('celular', u.celular);
                            setUserVal('fechaNacimiento', u.fechaNacimiento);
                            setTempCodes(u.codigos);
                          }}
                          className="text-slate-400 hover:text-blue-800"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 border rounded-sm shadow-sm">
            <h4 className="text-xs font-bold text-slate-500 uppercase">Recaudado</h4>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              ${debts.filter((d) => d.estado === 'pagado').reduce((acc, v) => acc + v.montoFinal, 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-6 border rounded-sm shadow-sm">
            <h4 className="text-xs font-bold text-slate-500 uppercase">Por Cobrar</h4>
            <p className="text-2xl font-bold text-red-600 mt-2">
              ${debts.filter((d) => d.estado === 'pendiente').reduce((acc, v) => acc + v.montoFinal, 0).toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminModule;
