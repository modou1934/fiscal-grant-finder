import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const Auth = () => {
  const { signInWithEmail, user, loading } = useAuth();
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      navigate('/onboarding');
    }
  }, [user, loading, navigate]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Inserisci email e password');
      return;
    }

    try {
      setIsSigningIn(true);
      await signInWithEmail(email, password);
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error('Credenziali non valide. Contatta l\'amministratore se hai bisogno di accesso.');
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-navy to-brand-emerald flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary to-brand-secondary">
      {/* Mobile Header */}
      <header className="safe-area-top px-4 py-3 w-full">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="https://postimg.cc/JDfhKPKR" 
              alt="Fiscalot AI" 
              className="w-10 h-10 object-contain rounded-lg"
            />
            <span className="text-lg sm:text-xl font-bold text-white">Fiscalot AI</span>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/10 p-2 rounded-full text-sm sm:text-base"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </nav>
      </header>

      {/* Auth Form - Mobile */}
      <div className="flex items-center justify-center px-4 py-6 sm:py-8 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-sm sm:max-w-md">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl">
            <CardHeader className="text-center space-y-4 pb-6 px-4 sm:px-6">
              <img 
                src="https://postimg.cc/JDfhKPKR" 
                alt="Fiscalot AI" 
                className="w-16 h-16 object-contain rounded-2xl mx-auto"
              />
              <CardTitle className="text-xl sm:text-2xl font-bold text-brand-primary">
                Accesso Riservato
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-gray-600">
                Inserisci le credenziali per accedere
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 px-4 sm:px-6 pb-8">
              <form onSubmit={handleEmailSignIn} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm sm:text-base text-gray-700 font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tua@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-12 rounded-xl bg-white border-gray-300 focus:border-brand-primary focus:ring-brand-primary text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm sm:text-base text-gray-700 font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="La tua password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full h-12 rounded-xl bg-white border-gray-300 focus:border-brand-primary focus:ring-brand-primary pr-12 text-base"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit"
                  disabled={isSigningIn}
                  className="w-full bg-brand-primary text-white hover:bg-brand-primary/90 h-12 rounded-xl font-semibold text-sm sm:text-base"
                >
                  {isSigningIn ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Accesso...
                    </div>
                  ) : (
                    'Accedi'
                  )}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Non hai le credenziali?{' '}
                  <span className="text-brand-primary font-medium">Contatta l'amministratore</span>
                </p>
              </div>

              {/* Benefits - Mobile */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-brand-primary mb-3 text-center">
                  Cosa otterrai:
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-brand-secondary rounded-full mr-3 flex-shrink-0"></div>
                    Ricerca intelligente tra migliaia di bandi
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-brand-accent rounded-full mr-3 flex-shrink-0"></div>
                    Notifiche personalizzate sulle scadenze
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-brand-primary rounded-full mr-3 flex-shrink-0"></div>
                    Dashboard per monitorare le candidature
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;