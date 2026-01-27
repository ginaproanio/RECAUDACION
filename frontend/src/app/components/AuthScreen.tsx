import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Building2, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/Input';
import { authApi } from '../../services/api';
import { UserData } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface AuthScreenProps {
  onLogin: (user: UserData) => void;
  onAdmin: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onAdmin }) => {
  const [isReg, setIsReg] = useState(false);
  const { login, isLoading, error } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      if (isReg) {
        // Registration
        const response = await authApi.register({
          cedula: data.cedula,
          password: data.password,
          nombres: data.nombres,
          apellidos: data.apellidos,
          email: data.email,
          celular: data.celular,
          fechaNacimiento: data.fechaNacimiento,
          tieneDiscapacidad: false, // Default value
          codigos: [] // Will be assigned by admin later
        });
        onLogin(response.user);
      } else {
        // Login
        await login(data.cedula, data.password);
        // The login hook will handle navigation via React Router
      }
    } catch (err) {
      // Error is handled by useAuth hook
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-slate-200">
      <div className="bg-white p-8 rounded-sm shadow-lg w-full max-w-sm border-t-4 border-[#003366]">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#003366] text-white rounded-sm flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-[#003366] uppercase">{isReg ? 'Registro' : 'Acceso'}</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Cédula"
            {...register('cedula', {
              required: 'La cédula es requerida',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'La cédula debe tener 10 dígitos'
              }
            })}
            error={errors.cedula?.message as string}
          />
          {isReg && (
            <>
              <Input
                label="Nombres"
                {...register('nombres', {
                  required: 'Los nombres son requeridos',
                  minLength: {
                    value: 2,
                    message: 'Los nombres deben tener al menos 2 caracteres'
                  },
                  pattern: {
                    value: /^[a-zA-ZÀ-ÿ\s]+$/,
                    message: 'Los nombres solo pueden contener letras y espacios'
                  }
                })}
                error={errors.nombres?.message as string}
              />
              <Input
                label="Apellidos"
                {...register('apellidos', {
                  required: 'Los apellidos son requeridos',
                  minLength: {
                    value: 2,
                    message: 'Los apellidos deben tener al menos 2 caracteres'
                  },
                  pattern: {
                    value: /^[a-zA-ZÀ-ÿ\s]+$/,
                    message: 'Los apellidos solo pueden contener letras y espacios'
                  }
                })}
                error={errors.apellidos?.message as string}
              />
              <Input
                label="Email"
                type="email"
                {...register('email', {
                  required: 'El email es requerido',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Ingrese un email válido'
                  }
                })}
                error={errors.email?.message as string}
              />
              <Input
                label="Celular"
                {...register('celular', {
                  required: 'El celular es requerido',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'El celular debe tener 10 dígitos'
                  }
                })}
                error={errors.celular?.message as string}
              />
              <Input
                label="Fecha de Nacimiento"
                type="date"
                {...register('fechaNacimiento', {
                  required: 'La fecha de nacimiento es requerida',
                  validate: (value) => {
                    const birthDate = new Date(value);
                    const today = new Date();
                    const age = today.getFullYear() - birthDate.getFullYear();
                    if (age < 18) return 'Debe ser mayor de 18 años';
                    if (age > 120) return 'Fecha de nacimiento inválida';
                    return true;
                  }
                })}
                error={errors.fechaNacimiento?.message as string}
              />
            </>
          )}
          <Input
            label="Contraseña"
            type="password"
            {...register('password', {
              required: 'La contraseña es requerida',
              minLength: {
                value: 6,
                message: 'La contraseña debe tener al menos 6 caracteres'
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
              }
            })}
            error={errors.password?.message as string}
          />
          <Button className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isReg ? 'Registrando...' : 'Ingresando...'}
              </>
            ) : (
              isReg ? 'Registrarse' : 'Ingresar'
            )}
          </Button>
        </form>
        <div className="mt-4 flex justify-between text-xs text-slate-500">
          <button
            onClick={() => setIsReg(!isReg)}
            className="hover:text-[#003366]"
            disabled={isLoading}
          >
            {isReg ? 'Volver al Login' : 'Crear Cuenta'}
          </button>
          {!isReg && (
            <button
              onClick={onAdmin}
              className="hover:text-[#003366]"
              disabled={isLoading}
            >
              Admin Acceso
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
