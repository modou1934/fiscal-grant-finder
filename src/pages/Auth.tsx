
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Lock } from 'lucide-react';
import { toast } from 'sonner';

const Auth = () => {
  const { signInWithEmail, user, loading } = useAuth();
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-navy"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-brand-navy to-brand-emerald rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-brand-navy">GrantFinder</span>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-brand-navy hover:bg-brand-navy/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna alla Home
          </Button>
        </nav>
      </header>

      {/* Auth Form */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0 hover-lift">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-brand-navy to-brand-emerald rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-brand-navy">
                Accesso Riservato
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                Inserisci le credenziali fornite dall'amministratore per accedere a GrantFinder
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tua@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="La tua password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <Button 
                  type="submit"
                  disabled={isSigningIn}
                  className="w-full bg-brand-navy text-white hover:bg-brand-navy/90 transition-all duration-200 py-3 text-base font-medium"
                >
                  {isSigningIn ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Accesso in corso...
                    </div>
                  ) : (
                    'Accedi'
                  )}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Non hai le credenziali di accesso?{' '}
                  <span className="text-brand-navy font-medium">Contatta l'amministratore</span>
                </p>
              </div>

              {/* Benefits */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-brand-navy mb-4 text-center">
                  Cosa otterrai:
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-brand-emerald rounded-full mr-3 flex-shrink-0"></div>
                    Ricerca intelligente tra migliaia di bandi
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-brand-gold rounded-full mr-3 flex-shrink-0"></div>
                    Notifiche personalizzate sulle scadenze
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-brand-navy rounded-full mr-3 flex-shrink-0"></div>
                    Dashboard per monitorare le candidature
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
