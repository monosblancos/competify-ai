import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      console.log('User already logged in, redirecting to dashboard...');
      navigate('/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await login(formData.email, formData.password);
      
      if (error) {
        console.error('Login error:', error);
        alert(`Error de login: ${error.message}`);
      } else {
        // Don't navigate immediately - let the auth state change handle it
        console.log('Login successful, waiting for auth state change...');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Error inesperado durante el login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="card-elegant p-8">
          <div className="text-center mb-8">
            <Link to="/" className="text-2xl font-bold text-primary">
              Certifica<span className="text-foreground">Global</span>
            </Link>
            <h2 className="mt-4 text-3xl font-bold text-foreground">
              Inicia sesión
            </h2>
            <p className="mt-2 text-muted-foreground">
              Accede a tu cuenta para continuar tu aprendizaje
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground 
                         placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary 
                         focus:border-transparent transition-all"
                placeholder="tu@email.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground 
                         placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary 
                         focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <Link
                to="/register"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Demo - Puedes usar cualquier nombre y email
              </p>
              
              {/* Demo Login Button */}
              <button
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    const { error } = await login('demo@certificaglobal.mx', '');
                    if (error) {
                      console.error('Demo login error:', error);
                      alert(`Error de login: ${error.message}`);
                    } else {
                      console.log('Demo login successful, waiting for auth state change...');
                    }
                  } catch (err) {
                    console.error('Demo login error:', err);
                    alert('Error inesperado durante el login demo');
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
                className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-accent to-primary text-white font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
              >
                🚀 Acceso Demo Rápido
              </button>
              
              <div className="bg-accent/10 p-4 rounded-lg">
                <p className="text-sm text-accent-foreground">
                  <strong>Tip:</strong> Esta es una aplicación demo. Puedes usar cualquier 
                  nombre y correo para acceder o hacer clic en "Acceso Demo Rápido".
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;