import React, { useState } from 'react';
import AuthScreen from './components/AuthScreen';
import AdminModule from './components/AdminModule';
import ClientModule from './components/ClientModule';

// --- UTILITIES ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

function calculateAge(birthDateString: string): number {
  if (!birthDateString) return 0;
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

// --- TYPES ---
type UserData = {
  id: string;
  cedula: string;
  password?: string;
  nombres: string;
  apellidos: string;
  email: string;
  celular: string; 
  fechaNacimiento: string; 
  tieneDiscapacidad: boolean; 
  codigos: CodeItem[]; 
  documents: UserDocument[];
};

type UserDocument = {
  id: string;
  name: string;
  type: string;
  size?: string;
  uploadDate: string;
  status: 'pending' | 'verified';
};

type CodeItem = {
  id: string;
  valor: string; 
  descripcion: string;
};

type RubroDefinition = {
  id: string;
  nombre: string; 
  montoDefecto: number;
  aplicaDescuento: boolean; 
  porcentajeDescuento: number; 
};

type Debt = {
  id: string;
  usuarioId: string;
  codigoValor: string;
  rubroId: string;
  nombreRubro: string; 
  periodo: string; 
  montoBase: number; 
  porcentajeDescuentoAplicado: number; 
  descuentoValor: number; 
  montoFinal: number; 
  estado: 'pendiente' | 'pagado';
  paymentDate?: string;
  transactionId?: string;
  monthIndex: number; 
  year: number;       
};

// --- INITIAL DATA ---
const INITIAL_RUBROS: RubroDefinition[] = [
  { id: 'def1', nombre: 'Alicuota de Condominio', montoDefecto: 85.00, aplicaDescuento: true, porcentajeDescuento: 50 }, 
  { id: 'def2', nombre: 'Mensualidad Gimnasio', montoDefecto: 45.00, aplicaDescuento: false, porcentajeDescuento: 0 },
];

const INITIAL_USERS: UserData[] = [
  {
    id: 'u1', cedula: '1712345678', password: '123', nombres: 'Carlos', apellidos: 'Andrade',
    email: 'carlos@demo.com', celular: '0991234567', fechaNacimiento: '1990-05-20',
    tieneDiscapacidad: false, codigos: [{ id: 'c1', valor: 'VILLA-14', descripcion: 'Villa 14' }], documents: []
  }
];

const INITIAL_ADMIN: UserData = {
  id: 'admin_sys', cedula: 'SYSADMIN', password: 'admin', nombres: 'Administrador', apellidos: 'Sistema',
  email: 'admin@sistema.com', celular: '0999999999', fechaNacimiento: '1980-01-01',
  tieneDiscapacidad: false, codigos: [], documents: []
};

// --- UI COMPONENTS ---

const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-sm shadow-xl w-full max-w-md flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
           <h3 className="font-bold text-slate-800 uppercase text-sm">{title}</h3>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5"/></button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

const Button = ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }: any) => {
  const variants: any = {
    primary: 'bg-[#003366] hover:bg-[#002244] text-white shadow-sm', 
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm',
    outline: 'border border-slate-300 hover:border-[#003366] hover:text-[#003366] text-slate-600 bg-transparent',
    ghost: 'hover:bg-slate-100 text-slate-600',
    cta: 'bg-orange-600 hover:bg-orange-700 text-white shadow-sm'
  };
  const sizes: any = { sm: 'px-3 py-1 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-6 py-2.5 text-base' };
  return (
    <button className={cn('rounded-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50', variants[variant], sizes[size], className)} disabled={isLoading || props.disabled} {...props}>
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

const Input = React.forwardRef<HTMLInputElement, any>(({ className, label, error, ...props }, ref) => (
  <div className="w-full space-y-1">
    {label && <label className="text-xs font-bold uppercase text-slate-500">{label}</label>}
    <input ref={ref} className={cn("w-full px-3 py-2 rounded-sm border border-slate-300 focus:border-[#003366] focus:ring-1 focus:ring-[#003366] outline-none text-sm transition-all", error && "border-red-600 bg-red-50", className)} {...props} />
    {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
  </div>
));

const Select = React.forwardRef<HTMLSelectElement, any>(({ className, label, error, children, ...props }, ref) => (
  <div className="w-full space-y-1">
    {label && <label className="text-xs font-bold uppercase text-slate-500">{label}</label>}
    <select ref={ref} className={cn("w-full px-3 py-2 rounded-sm border border-slate-300 focus:border-[#003366] focus:ring-1 focus:ring-[#003366] outline-none text-sm bg-white", error && "border-red-600 bg-red-50", className)} {...props}>
      {children}
    </select>
  </div>
));

// --- FEATURE COMPONENTS ---

const ProfileEditModal = ({ isOpen, onClose, user, onUpdate }: any) => {
  const { register, handleSubmit, reset } = useForm({ defaultValues: user });
  useEffect(() => { if (isOpen && user) reset(user); }, [isOpen, user, reset]);

  const onSubmit = (data: any) => { 
    onUpdate({ ...user, email: data.email, celular: data.celular, password: data.password }); 
    onClose(); 
  };

  if(!user) return null;
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
             <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500 uppercase"><Key className="w-3 h-3"/> Seguridad</div>
             <Input label="Nueva Contraseña" type="password" placeholder="••••••" {...register('password')} />
          </div>
          <div className="flex gap-2 pt-2">
             <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancelar</Button>
             <Button className="flex-1">Guardar</Button>
          </div>
       </form>
    </Modal>
  );
};

const DashboardLayout = ({ title, user, menuItems, activeTab, setActiveTab, onLogout, onUpdateUser, children }: any) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      <ProfileEditModal isOpen={showProfile} onClose={() => setShowProfile(false)} user={user} onUpdate={onUpdateUser} />

      {/* SIDEBAR */}
      <aside className={cn("bg-[#003366] text-white flex flex-col transition-all duration-300 shadow-xl z-20", isCollapsed ? "w-16" : "w-48")}>
         <div className="h-16 flex items-center justify-center border-b border-[#002244] bg-[#002855]">
             <Building2 className="w-6 h-6" />
             {!isCollapsed && <span className="ml-3 font-bold tracking-wide text-xs">SISTEMA</span>}
         </div>
         <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
             {menuItems.map((item:any) => (
                 <button key={item.id} onClick={() => setActiveTab(item.id)} className={cn("w-full flex items-center gap-3 px-3 py-3 rounded-sm text-xs transition-colors", activeTab === item.id ? "bg-[#004aad] text-white shadow-sm font-medium" : "text-blue-200 hover:bg-[#004080] hover:text-white", isCollapsed && "justify-center px-0")}>
                   <item.icon className="w-4 h-4 shrink-0" />
                   {!isCollapsed && <span className="uppercase">{item.label}</span>}
                 </button>
             ))}
         </nav>
         <div className="p-4 border-t border-[#002244] bg-[#002855]">
             <button onClick={onLogout} className={cn("flex items-center gap-3 text-red-200 hover:text-white w-full", isCollapsed && "justify-center")}>
                <LogOut className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span className="text-xs font-bold uppercase">Salir</span>}
             </button>
         </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
           <div className="flex items-center gap-4">
              <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-slate-500 hover:text-[#003366]"><Menu className="w-5 h-5" /></button>
              <h2 className="text-sm font-bold text-[#003366] uppercase tracking-wide">{menuItems.find((i:any)=>i.id===activeTab)?.label}</h2>
           </div>
           
           {/* CLEAN USER PROFILE TRIGGER */}
           <button 
              onClick={() => setShowProfile(true)} 
              className="flex items-center gap-3 pl-4 pr-2 py-1.5 rounded-sm hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 group"
           >
               <div className="text-right hidden sm:block">
                  <span className="block text-xs font-bold text-slate-800 uppercase group-hover:text-[#003366]">{user.nombres}</span>
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

// --- MODULES ---

const AdminModule = ({ user, users, setUsers, rubros, setRubros, debts, setDebts, onLogout, onImpersonate, onUpdateUser }: any) => {
  const [tab, setTab] = useState('gen');
  const { register: regGen, handleSubmit: subGen } = useForm();
  const { register: regRubro, handleSubmit: subRubro, reset: resRubro, setValue: setRubroVal } = useForm();
  const { register: regUser, handleSubmit: subUser, reset: resUser, setValue: setUserVal } = useForm();
  
  const [editingRubro, setEditingRubro] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [tempCodes, setTempCodes] = useState<CodeItem[]>([]);
  const [codeTxt, setCodeTxt] = useState('');
  const [viewDocUser, setViewDocUser] = useState<UserData | null>(null);

  const saveRubro = (data:any) => {
    const rData = { nombre: data.nombre, montoDefecto: parseFloat(data.monto), aplicaDescuento: data.aplicaDescuento, porcentajeDescuento: parseFloat(data.porcentajeDescuento || 0) };
    if(editingRubro) setRubros(rubros.map((r:any) => r.id === editingRubro ? {...r, ...rData} : r));
    else setRubros([...rubros, { id: Date.now().toString(), ...rData }]);
    setEditingRubro(null); resRubro();
  };

  const saveUser = (data:any) => {
    if(tempCodes.length === 0) return alert("Ingrese al menos un código");
    const uData = { cedula: data.cedula, nombres: data.nombres, apellidos: data.apellidos, email: data.email, celular: data.celular, fechaNacimiento: data.fechaNacimiento, tieneDiscapacidad: data.tieneDiscapacidad, codigos: tempCodes };
    if(editingUser) setUsers(users.map((u:any) => u.id === editingUser ? {...u, ...uData} : u));
    else setUsers([...users, { id: crypto.randomUUID(), password: data.cedula, documents:[], ...uData }]);
    setEditingUser(null); resUser(); setTempCodes([]);
  };

  const generateDebts = (data:any) => {
    const rubro = rubros.find((r:any)=>r.id === data.rubroId);
    if(!rubro) return;
    const newDebts: Debt[] = [];
    users.forEach((u:UserData) => {
       u.codigos.forEach(code => {
          if(!debts.find((d:Debt) => d.rubroId === rubro.id && d.codigoValor === code.valor && d.periodo === `${MONTHS[parseInt(data.mes)]} ${data.anio}`)) {
             newDebts.push({
                id: crypto.randomUUID(), usuarioId: u.id, rubroId: rubro.id, nombreRubro: rubro.nombre,
                codigoValor: code.valor, periodo: `${MONTHS[parseInt(data.mes)]} ${data.anio}`,
                montoBase: rubro.montoDefecto, ...calculateAge(u.fechaNacimiento) >= 65 || u.tieneDiscapacidad ? { porcentajeDescuentoAplicado: rubro.porcentajeDescuento, descuentoValor: rubro.montoDefecto * (rubro.porcentajeDescuento/100) } : { porcentajeDescuentoAplicado: 0, descuentoValor: 0 },
                montoFinal: rubro.montoDefecto - (calculateAge(u.fechaNacimiento) >= 65 || u.tieneDiscapacidad ? rubro.montoDefecto * (rubro.porcentajeDescuento/100) : 0),
                estado: 'pendiente', monthIndex: parseInt(data.mes), year: parseInt(data.anio)
             });
          }
       });
    });
    setDebts([...debts, ...newDebts]); alert(`Generadas ${newDebts.length} deudas.`);
  };

  const menu = [
    { id: 'gen', label: 'Emisión', icon: Layers },
    { id: 'rubros', label: 'Rubros', icon: Database },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'stats', label: 'Reportes', icon: LayoutDashboard },
  ];

  return (
    <DashboardLayout title="ADMIN" user={user} menuItems={menu} activeTab={tab} setActiveTab={setTab} onLogout={onLogout} onUpdateUser={onUpdateUser}>
      <Modal isOpen={!!viewDocUser} onClose={()=>setViewDocUser(null)} title="Expediente Digital">
         {viewDocUser?.documents.length === 0 ? <p className="text-slate-500 italic text-sm">Sin documentos.</p> : (
            <div className="space-y-2">
              {viewDocUser?.documents.map(d => (
                 <div key={d.id} className="flex justify-between items-center p-3 bg-slate-50 border rounded-sm text-sm">
                    <span className="flex items-center gap-2 font-medium"><FileText className="w-4 h-4 text-blue-600"/> {d.name}</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full uppercase font-bold">{d.status}</span>
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
                     {rubros.map((r:any)=><option key={r.id} value={r.id}>{r.nombre} (${r.montoDefecto})</option>)}
                  </Select>
                  <div className="grid grid-cols-2 gap-4">
                     <Select label="Mes" {...regGen('mes')}>{MONTHS.map((m,i)=><option key={i} value={i}>{m}</option>)}</Select>
                     <Select label="Año" {...regGen('anio')}><option value="2026">2026</option></Select>
                  </div>
                  <Button className="w-full">Procesar Emisión</Button>
               </form>
            </div>
            <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden flex flex-col h-96">
               <div className="bg-slate-50 p-3 border-b text-xs font-bold uppercase text-slate-600">Historial Reciente</div>
               <div className="overflow-auto flex-1">
                  <table className="w-full text-sm text-left">
                     <thead className="bg-white sticky top-0"><tr className="border-b"><th className="p-3">Periodo</th><th className="p-3">Detalle</th><th className="p-3 text-right">Total</th></tr></thead>
                     <tbody>
                        {debts.slice().reverse().map((d:Debt)=>(
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
               <h3 className="font-bold text-xs uppercase mb-4 text-slate-800">{editingRubro ? 'Editar Rubro' : 'Nuevo Rubro'}</h3>
               <form onSubmit={subRubro(saveRubro)} className="space-y-3">
                  <Input label="Descripción" {...regRubro('nombre', {required:true})} />
                  <Input label="Valor ($)" type="number" step="0.01" {...regRubro('monto', {required:true})} />
                  <div className="p-3 bg-slate-50 rounded-sm space-y-2 border border-slate-100">
                     <label className="flex items-center gap-2 text-xs font-bold uppercase"><input type="checkbox" {...regRubro('aplicaDescuento')} /> Aplica Descuento</label>
                     <Input placeholder="% Descuento" type="number" {...regRubro('porcentajeDescuento')} />
                  </div>
                  <Button className="w-full">Guardar</Button>
                  {editingRubro && <Button type="button" variant="ghost" className="w-full" onClick={()=>{setEditingRubro(null); resRubro();}}>Cancelar</Button>}
               </form>
            </div>
            <div className="md:col-span-2 bg-white rounded-sm border shadow-sm overflow-hidden">
               <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b text-xs uppercase text-slate-500"><tr><th className="p-3">Rubro</th><th className="p-3 text-right">Valor</th><th className="p-3 text-center">Acciones</th></tr></thead>
                  <tbody>
                     {rubros.map((r:any) => (
                        <tr key={r.id} className="border-b hover:bg-slate-50">
                           <td className="p-3 font-medium">{r.nombre}</td>
                           <td className="p-3 text-right font-mono">${r.montoDefecto.toFixed(2)}</td>
                           <td className="p-3 flex justify-center gap-2">
                              <button onClick={()=>{setEditingRubro(r.id); resRubro(); setRubroVal('nombre',r.nombre); setRubroVal('monto',r.montoDefecto); setRubroVal('aplicaDescuento',r.aplicaDescuento); setRubroVal('porcentajeDescuento',r.porcentajeDescuento);}} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit2 className="w-4 h-4"/></button>
                              <button onClick={()=>setRubros(rubros.filter((x:any)=>x.id!==r.id))} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 className="w-4 h-4"/></button>
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
                  {editingUser && <button onClick={()=>{setEditingUser(null); resUser(); setTempCodes([])}} className="text-xs text-red-600 font-bold hover:underline">CANCELAR</button>}
               </div>
               <form onSubmit={subUser(saveUser)} className="space-y-3">
                  <Input label="Cédula" {...regUser('cedula')} />
                  <Input label="Nombres" {...regUser('nombres')} />
                  <Input label="Apellidos" {...regUser('apellidos')} />
                  <Input label="Email" {...regUser('email')} />
                  <Input label="Celular" {...regUser('celular')} />
                  <Input label="Fecha Nac." type="date" {...regUser('fechaNacimiento')} />
                  <div className="bg-slate-50 p-2 rounded-sm border border-slate-100">
                     <div className="flex gap-2 mb-2"><Input value={codeTxt} onChange={(e:any)=>setCodeTxt(e.target.value)} placeholder="NUEVO CÓDIGO" className="h-8"/><Button type="button" size="sm" onClick={()=>{if(codeTxt) setTempCodes([...tempCodes,{id:Date.now().toString(), valor:codeTxt, descripcion:''}]); setCodeTxt('')}}><Plus className="w-3 h-3"/></Button></div>
                     <div className="flex flex-wrap gap-1">{tempCodes.map(c=><span key={c.id} className="text-[10px] bg-white border px-2 py-0.5 rounded-sm font-mono">{c.valor}</span>)}</div>
                  </div>
                  <Button className="w-full">Guardar Usuario</Button>
               </form>
            </div>
            <div className="lg:col-span-2 bg-white border rounded-sm shadow-sm overflow-hidden flex flex-col h-[600px]">
               <div className="overflow-auto">
                  <table className="w-full text-sm text-left">
                     <thead className="bg-slate-50 border-b text-xs uppercase text-slate-500 sticky top-0"><tr><th className="p-3">Usuario</th><th className="p-3">Códigos</th><th className="p-3 text-center">Acciones</th></tr></thead>
                     <tbody>
                        {users.map((u:any) => (
                           <tr key={u.id} className="border-b hover:bg-slate-50 group">
                              <td className="p-3">
                                 <div className="font-bold text-slate-800">{u.nombres} {u.apellidos}</div>
                                 <div className="text-xs text-slate-500 font-mono">{u.cedula}</div>
                              </td>
                              <td className="p-3"><div className="flex flex-wrap gap-1">{u.codigos.map((c:any)=><span key={c.id} className="text-[10px] bg-slate-100 px-1 border rounded text-slate-600">{c.valor}</span>)}</div></td>
                              <td className="p-3 flex justify-center gap-2">
                                 <button onClick={()=>setViewDocUser(u)} className="text-slate-400 hover:text-blue-800" title="Docs"><FileStack className="w-4 h-4"/></button>
                                 <button onClick={()=>onImpersonate(u)} className="text-slate-400 hover:text-green-600" title="Login"><Eye className="w-4 h-4"/></button>
                                 <button onClick={()=>{setEditingUser(u.id); setUserVal('cedula',u.cedula); setUserVal('nombres',u.nombres); setUserVal('apellidos',u.apellidos); setUserVal('email',u.email); setUserVal('celular',u.celular); setUserVal('fechaNacimiento',u.fechaNacimiento); setTempCodes(u.codigos);}} className="text-slate-400 hover:text-blue-800" title="Editar"><Edit2 className="w-4 h-4"/></button>
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
               <p className="text-2xl font-bold text-slate-900 mt-2">${debts.filter((d:any)=>d.estado==='pagado').reduce((acc:number,v:any)=>acc+v.montoFinal,0).toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 border rounded-sm shadow-sm">
               <h4 className="text-xs font-bold text-slate-500 uppercase">Por Cobrar</h4>
               <p className="text-2xl font-bold text-red-600 mt-2">${debts.filter((d:any)=>d.estado==='pendiente').reduce((acc:number,v:any)=>acc+v.montoFinal,0).toFixed(2)}</p>
            </div>
         </div>
      )}
    </DashboardLayout>
  );
};

const ClientModule = ({ user, debts, onPay, onLogout, onUpdateUser, onUploadDoc }: any) => {
  const [tab, setTab] = useState('debts');
  const [selected, setSelected] = useState<string[]>([]);
  
  const pending = debts.filter((d:any) => d.usuarioId === user.id && d.estado === 'pendiente');
  const history = debts.filter((d:any) => d.usuarioId === user.id && d.estado === 'pagado');
  const total = pending.filter((d:any) => selected.includes(d.id)).reduce((a:number,b:any) => a+b.montoFinal, 0);

  const toggleAll = () => setSelected(selected.length === pending.length ? [] : pending.map((d:any)=>d.id));
  
  const menu = [
    { id: 'debts', label: 'Mis Deudas', icon: Briefcase },
    { id: 'hist', label: 'Historial', icon: Receipt },
    { id: 'docs', label: 'Expediente', icon: FileStack },
  ];

  return (
    <DashboardLayout title="MI CUENTA" user={user} menuItems={menu} activeTab={tab} setActiveTab={setTab} onLogout={onLogout} onUpdateUser={onUpdateUser}>
       {tab === 'debts' && (
          <div className="space-y-4">
             <div className="bg-white border rounded-sm shadow-sm overflow-hidden">
                {pending.length === 0 ? <div className="p-8 text-center text-slate-500 italic">No tiene valores pendientes.</div> : (
                   <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 border-b text-xs uppercase font-bold text-slate-600">
                         <tr>
                            <th className="p-4 w-10 text-center"><input type="checkbox" checked={selected.length===pending.length&&pending.length>0} onChange={toggleAll}/></th>
                            <th className="p-4">Concepto</th>
                            <th className="p-4 text-right">Monto</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y">
                         {pending.map((d:any) => (
                            <tr key={d.id} className={cn("hover:bg-slate-50 cursor-pointer transition-colors", selected.includes(d.id) && "bg-blue-50")} onClick={()=>setSelected(prev=>prev.includes(d.id)?prev.filter(x=>x!==d.id):[...prev,d.id])}>
                               <td className="p-4 text-center"><input type="checkbox" checked={selected.includes(d.id)} readOnly /></td>
                               <td className="p-4">
                                  <div className="font-medium text-slate-900">{d.nombreRubro}</div>
                                  <div className="text-xs text-slate-500">{d.periodo} • {d.codigoValor}</div>
                               </td>
                               <td className="p-4 text-right font-mono font-bold text-slate-800">${d.montoFinal.toFixed(2)}</td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                )}
             </div>
             {total > 0 && (
                <div className="flex justify-end gap-4 items-center bg-slate-200 p-4 rounded-sm border border-slate-300">
                   <div className="text-right">
                      <span className="text-xs font-bold uppercase text-slate-500 block">Total a Pagar</span>
                      <span className="text-xl font-bold text-slate-900">${total.toFixed(2)}</span>
                   </div>
                   <Button variant="cta" size="lg" onClick={()=>onPay(selected)} className="px-8">PAGAR AHORA</Button>
                </div>
             )}
          </div>
       )}

       {tab === 'hist' && (
          <div className="bg-white border rounded-sm shadow-sm overflow-hidden">
             <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b text-xs uppercase font-bold text-slate-600"><tr><th className="p-3">Fecha</th><th className="p-3">Detalle</th><th className="p-3 text-right">Valor</th></tr></thead>
                <tbody>
                   {history.map((d:any) => (
                      <tr key={d.id} className="border-b hover:bg-slate-50">
                         <td className="p-3 text-xs text-slate-500 font-mono">{d.paymentDate}</td>
                         <td className="p-3"><div className="font-medium">{d.nombreRubro}</div><div className="text-xs text-slate-500">{d.periodo}</div></td>
                         <td className="p-3 text-right font-mono font-bold">${d.montoFinal.toFixed(2)}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       )}

       {tab === 'docs' && (
          <div className="bg-white border rounded-sm p-6 text-center">
             <div className="border-2 border-dashed border-slate-300 rounded-sm p-8 hover:bg-slate-50 transition-colors cursor-pointer relative">
                <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2"/>
                <p className="text-sm text-slate-600 font-medium">Arrastre archivos o haga clic para subir</p>
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e)=>{
                   const f = e.target.files?.[0];
                   if(f) onUploadDoc({ id: Date.now().toString(), name: f.name, type: 'FILE', status: 'pending', uploadDate: new Date().toLocaleDateString() });
                }} />
             </div>
             <div className="mt-6 text-left space-y-2">
                {user.documents.map((d:any) => (
                   <div key={d.id} className="flex justify-between items-center p-3 bg-slate-50 border rounded-sm">
                      <span className="text-sm font-medium flex items-center gap-2"><FileText className="w-4 h-4 text-blue-600"/> {d.name}</span>
                      <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full uppercase">{d.status}</span>
                   </div>
                ))}
             </div>
          </div>
       )}
    </DashboardLayout>
  );
};

const AuthScreen = ({ users, setUsers, onLogin, onAdmin }: any) => {
  const [isReg, setIsReg] = useState(false);
  const { register, handleSubmit } = useForm();
  
  const onSubmit = (data:any) => {
     if(isReg) {
        if(users.find((u:any)=>u.cedula===data.cedula)) return alert("Usuario ya existe");
        setUsers([...users, { id: crypto.randomUUID(), ...data, password: data.password, documents:[], codigos:[] }]);
        setIsReg(false); alert("Registro exitoso");
     } else {
        const u = users.find((x:any)=>x.cedula===data.cedula && x.password===data.password);
        if(u) onLogin(u); else alert("Credenciales inválidas");
     }
  };

  return (
    <div className="h-full flex items-center justify-center bg-slate-200">
       <div className="bg-white p-8 rounded-sm shadow-lg w-full max-w-sm border-t-4 border-[#003366]">
          <div className="text-center mb-6">
             <div className="w-12 h-12 bg-[#003366] text-white rounded-sm flex items-center justify-center mx-auto mb-3"><Building2 className="w-6 h-6"/></div>
             <h1 className="text-xl font-bold text-[#003366] uppercase">{isReg ? 'Registro' : 'Acceso'}</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
             <Input label="Cédula" {...register('cedula', {required:true})} />
             {isReg && <><Input label="Nombres" {...register('nombres')} /><Input label="Apellidos" {...register('apellidos')} /></>}
             <Input label="Contraseña" type="password" {...register('password', {required:true})} />
             <Button className="w-full">{isReg ? 'Registrarse' : 'Ingresar'}</Button>
          </form>
          <div className="mt-4 flex justify-between text-xs text-slate-500">
             <button onClick={()=>setIsReg(!isReg)} className="hover:text-[#003366]">{isReg ? 'Volver al Login' : 'Crear Cuenta'}</button>
             {!isReg && <button onClick={onAdmin} className="hover:text-[#003366]">Admin Acceso</button>}
          </div>
       </div>
    </div>
  );
};

// --- APP ROOT ---
export default function App() {
  const [view, setView] = useState('login'); // login, client, admin
  const [users, setUsers] = useState<UserData[]>(INITIAL_USERS);
  const [admin, setAdmin] = useState<UserData>(INITIAL_ADMIN);
  const [rubros, setRubros] = useState<RubroDefinition[]>(INITIAL_RUBROS);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [current, setCurrent] = useState<UserData | null>(null);

  const handleUpdate = (data: UserData) => {
     if(data.id === 'admin_sys') {
        setAdmin(data);
     } else {
        setUsers(users.map(u => u.id === data.id ? data : u));
        setCurrent(data);
     }
     alert("Perfil actualizado correctamente");
  };

  return (
    <>
       {view === 'login' && <AuthScreen users={users} setUsers={setUsers} onLogin={(u:any)=>{setCurrent(u); setView('client')}} onAdmin={()=>setView('admin')} />}
       {view === 'client' && <ClientModule user={current} debts={debts} onPay={(ids:string[])=>{setDebts(debts.map(d=>ids.includes(d.id)?{...d, estado:'pagado', paymentDate: new Date().toLocaleDateString()}:d)); alert("Pago procesado")}} onLogout={()=>setView('login')} onUpdateUser={handleUpdate} onUploadDoc={(d:any)=>{if(current){const nu={...current, documents:[...current.documents,d]}; setCurrent(nu); setUsers(users.map(u=>u.id===nu.id?nu:u))}}} />}
       {view === 'admin' && <AdminModule user={admin} users={users} setUsers={setUsers} rubros={rubros} setRubros={setRubros} debts={debts} setDebts={setDebts} onLogout={()=>setView('login')} onImpersonate={(u:any)=>{setCurrent(u); setView('client')}} onUpdateUser={handleUpdate} />}
    </>
  );
}
