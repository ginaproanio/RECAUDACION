import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Briefcase, Receipt, FileStack, UploadCloud, FileText, Check, Loader2
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { Button } from './ui/button';
import { useDebts } from '../../hooks/useDebts';
import { UserData, Debt, UserDocument } from '../../types';

interface ClientModuleProps {
  user: UserData;
  debts: Debt[];
  onPay: (ids: string[]) => void;
  onLogout: () => void;
  onUpdateUser: (user: UserData) => void;
  onUploadDoc: (doc: UserDocument) => void;
}

const ClientModule: React.FC<ClientModuleProps> = ({
  user,
  debts,
  onPay,
  onLogout,
  onUpdateUser,
  onUploadDoc
}) => {
  const [tab, setTab] = useState('debts');
  const [selected, setSelected] = useState<string[]>([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load debts when component mounts
  useEffect(() => {
    if (user) {
      loadDebts();
    }
  }, [user, loadDebts]);

  const handlePayment = async () => {
    if (selected.length === 0) return;

    setPaymentLoading(true);
    setError(null);

    try {
      const response = await processPayment(selected);
      if (response.success) {
        setSelected([]);
        toast.success(`Pago procesado exitosamente. ID: ${response.transactionId}`);
        // Debts will be refreshed automatically by the hook
      } else {
        setError(response.message || 'Error al procesar el pago');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al procesar el pago');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (!user) return null;

  const pending = realDebts.filter((d) => d.usuarioId === user.id && d.estado === 'pendiente');
  const history = realDebts.filter((d) => d.usuarioId === user.id && d.estado === 'pagado');
  const total = pending.filter((d) => selected.includes(d.id)).reduce((a, b) => a + b.montoFinal, 0);

  const toggleAll = () => setSelected(selected.length === pending.length ? [] : pending.map((d) => d.id));

  const menu = [
    { id: 'debts', label: 'Mis Deudas', icon: Briefcase },
    { id: 'hist', label: 'Historial', icon: Receipt },
    { id: 'docs', label: 'Expediente', icon: FileStack },
  ];

  return (
    <DashboardLayout
      title="MI CUENTA"
      user={user}
      menuItems={menu}
      activeTab={tab}
      setActiveTab={setTab}
      onLogout={onLogout}
      onUpdateUser={onUpdateUser}
    >
      {tab === 'debts' && (
        <div className="space-y-4">
          <div className="bg-white border rounded-sm shadow-sm overflow-hidden">
            {pending.length === 0 ? (
              <div className="p-8 text-center text-slate-500 italic">No tiene valores pendientes.</div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b text-xs uppercase font-bold text-slate-600">
                  <tr>
                    <th className="p-4 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={selected.length === pending.length && pending.length > 0}
                        onChange={toggleAll}
                      />
                    </th>
                    <th className="p-4">Concepto</th>
                    <th className="p-4 text-right">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {pending.map((d) => (
                    <tr
                      key={d.id}
                      className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                        selected.includes(d.id) ? 'bg-blue-50' : ''
                      }`}
                      onClick={() =>
                        setSelected((prev) =>
                          prev.includes(d.id) ? prev.filter((x) => x !== d.id) : [...prev, d.id]
                        )
                      }
                    >
                      <td className="p-4 text-center">
                        <input type="checkbox" checked={selected.includes(d.id)} readOnly />
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-slate-900">{d.nombreRubro}</div>
                        <div className="text-xs text-slate-500">{d.periodo} • {d.codigoValor}</div>
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-slate-800">
                        ${d.montoFinal.toFixed(2)}
                      </td>
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
              <Button
                variant="cta"
                size="lg"
                onClick={handlePayment}
                className="px-8"
                disabled={paymentLoading}
              >
                {paymentLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  'PAGAR AHORA'
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {tab === 'hist' && (
        <div className="bg-white border rounded-sm shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b text-xs uppercase font-bold text-slate-600">
              <tr>
                <th className="p-3">Fecha</th>
                <th className="p-3">Detalle</th>
                <th className="p-3 text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {history.map((d) => (
                <tr key={d.id} className="border-b hover:bg-slate-50">
                  <td className="p-3 text-xs text-slate-500 font-mono">{d.paymentDate}</td>
                  <td className="p-3">
                    <div className="font-medium">{d.nombreRubro}</div>
                    <div className="text-xs text-slate-500">{d.periodo}</div>
                  </td>
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
            <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600 font-medium">Arrastre archivos o haga clic para subir</p>
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  onUploadDoc({
                    id: Date.now().toString(),
                    name: f.name,
                    type: 'FILE',
                    status: 'pending',
                    uploadDate: new Date().toLocaleDateString(),
                  });
                }
              }}
            />
          </div>
          <div className="mt-6 text-left space-y-2">
            {user.documents.map((d) => (
              <div key={d.id} className="flex justify-between items-center p-3 bg-slate-50 border rounded-sm">
                <span className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" /> {d.name}
                </span>
                <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full uppercase">
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ClientModule;
