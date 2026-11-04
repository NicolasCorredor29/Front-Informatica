import React, { useState } from 'react';
import { Button } from '../components/Button';

interface RegisterProps {
  onNavigate: (page: string) => void;
  onSuccess: () => void;
}

// Matches CreateClientRequest in the backend. No request is sent yet.
interface ClientRegistration {
  name: string;
  phone: string;
  email: string;
  cityId: string;
  bankId: string;
  accountNumber: string;
  accountType: string;
  balance: number;
}

const fields = [
  { key: 'name', label: 'Nombre completo', max: 100, autoComplete: 'name' },
  { key: 'phone', label: 'Teléfono', max: 20, autoComplete: 'tel', type: 'tel' },
  { key: 'email', label: 'Correo electrónico', max: 150, autoComplete: 'email', type: 'email' },
  { key: 'cityId', label: 'Identificador de ciudad (UUID)', max: 36 },
  { key: 'bankId', label: 'Identificador de banco (UUID)', max: 36 },
  { key: 'accountNumber', label: 'Número de cuenta', max: 30 },
  { key: 'accountType', label: 'Tipo de cuenta', max: 50 },
] as const;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function Register({ onNavigate }: RegisterProps) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', cityId: '', bankId: '', accountNumber: '', accountType: '', balance: '0' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const payload: ClientRegistration = {
      name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(),
      cityId: form.cityId.trim(), bankId: form.bankId.trim(),
      accountNumber: form.accountNumber.trim(), accountType: form.accountType.trim(),
      balance: Number(form.balance),
    };
    const nextErrors: Record<string, string> = {};
    for (const field of fields) {
      if (!payload[field.key]) nextErrors[field.key] = 'Este campo es obligatorio';
      else if (payload[field.key].length > field.max) nextErrors[field.key] = `Máximo ${field.max} caracteres`;
    }
    if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) nextErrors.email = 'Ingresa un correo válido';
    for (const key of ['cityId', 'bankId'] as const) {
      if (payload[key] && !uuid.test(payload[key])) nextErrors[key] = 'Ingresa un UUID válido';
    }
    if (!form.balance.trim() || !Number.isFinite(payload.balance) || payload.balance < 0 || payload.balance > 9999999999.99 || Math.abs(payload.balance * 100 - Math.round(payload.balance * 100)) > 1e-6) {
      nextErrors.balance = 'Ingresa un saldo entre 0 y 9.999.999.999,99, con máximo dos decimales';
    }
    setErrors(nextErrors);
    setReady(Object.keys(nextErrors).length === 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl p-8 shadow-sm">
        <button onClick={() => onNavigate('home')} className="text-sm text-[#E31C5F] mb-6">← Volver al inicio</button>
        <h1 className="text-2xl font-bold text-gray-900">Registro de cliente</h1>
        <p className="text-sm text-gray-500 mt-2 mb-6">Completa tus datos personales y bancarios.</p>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4" onChange={() => setReady(false)}>
          {fields.map((field) => (
            <div key={field.key}>
              <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
              <input id={field.key} name={field.key} type={'type' in field ? field.type : 'text'} autoComplete={'autoComplete' in field ? field.autoComplete : 'off'} required maxLength={field.max} value={form[field.key]} onChange={(e) => { setForm({ ...form, [field.key]: e.target.value }); setErrors((previous) => ({ ...previous, [field.key]: '' })); }} aria-invalid={!!errors[field.key]} aria-describedby={errors[field.key] ? `${field.key}-error` : undefined} className="h-11 w-full px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E31C5F]" />
              {errors[field.key] && <p id={`${field.key}-error`} className="text-xs text-red-500 mt-1">{errors[field.key]}</p>}
            </div>
          ))}
          <p className="text-xs text-gray-500">Ciudad y banco deben corresponder a registros existentes. Sus listas se habilitarán al conectar el servicio.</p>
          <div>
            <label htmlFor="balance" className="block text-sm font-medium text-gray-700 mb-1.5">Saldo inicial</label>
            <input id="balance" name="balance" type="number" min="0" max="9999999999.99" step="0.01" required value={form.balance} onChange={(e) => setForm({ ...form, balance: e.target.value })} aria-invalid={!!errors.balance} aria-describedby={errors.balance ? 'balance-error' : undefined} className="h-11 w-full px-4 border border-gray-300 rounded-xl" />
            {errors.balance && <p id="balance-error" className="text-xs text-red-500 mt-1">{errors.balance}</p>}
          </div>
          <Button type="submit" fullWidth>Validar datos de registro</Button>
          {ready && <p role="status" className="text-sm text-green-700">Datos válidos. No se han enviado ni se ha creado una cuenta.</p>}
        </form>
        <button onClick={() => onNavigate('login')} className="text-sm text-[#E31C5F] mt-6">Ir a iniciar sesión</button>
      </div>
    </div>
  );
}
