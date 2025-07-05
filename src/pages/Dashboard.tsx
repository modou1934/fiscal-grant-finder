
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, MessageSquare, Settings, LogOut, ArrowRight, Bookmark, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-brand-navy to-brand-emerald rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-brand-navy">GrantFinder</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Benvenuto, {user?.user_metadata?.name || user?.email}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSignOut}
                className="text-gray-600 hover:text-brand-navy"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Esci
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-brand-navy mb-4">
              Dashboard GrantFinder
            </h1>
            <p className="text-xl text-gray-600">
              La tua piattaforma per trovare i bandi perfetti per la tua azienda
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="hover-lift border-0 shadow-lg cursor-pointer" onClick={() => navigate('/search')}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-brand-navy">
                  <Search className="w-6 h-6 mr-3" />
                  Cerca Bandi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Usa l'AI per trovare i bandi più adatti alla tua azienda attraverso una ricerca intelligente.
                </p>
                <Button className="w-full bg-brand-navy hover:bg-brand-navy/90">
                  Inizia Ricerca
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-lg cursor-pointer" onClick={() => navigate('/saved-grants')}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-brand-navy">
                  <Bookmark className="w-6 h-6 mr-3" />
                  Bandi Salvati
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Accedi ai bandi che hai salvato e monitora le scadenze importanti.
                </p>
                <Button variant="outline" className="w-full">
                  Vedi Salvati
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-brand-navy">
                  <TrendingUp className="w-6 h-6 mr-3" />
                  Statistiche
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Analizza le tue ricerche e scopri le tendenze nei bandi del tuo settore.
                </p>
                <Button variant="outline" className="w-full" disabled>
                  Prossimamente
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Status Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gradient-to-r from-brand-emerald to-green-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100">Bandi Attivi</p>
                    <p className="text-2xl font-bold">1,247</p>
                  </div>
                  <Search className="w-8 h-8 text-emerald-100" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-brand-gold to-orange-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Tuoi Salvati</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                  <Bookmark className="w-8 h-8 text-orange-100" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-brand-navy to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Ricerche</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-blue-100" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Overview */}
          <Card className="shadow-xl border-0 bg-gradient-to-r from-brand-navy to-brand-emerald text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-center">
                🚀 GrantFinder è Ora Operativo!
              </h2>
              <p className="text-lg mb-6 text-center">
                Inizia subito a cercare i bandi perfetti per la tua azienda con la nostra AI specializzata.
              </p>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-brand-gold rounded-full mr-3"></div>
                    <span>✅ Ricerca AI intelligente</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-brand-gold rounded-full mr-3"></div>
                    <span>✅ Database bandi aggiornato</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-brand-gold rounded-full mr-3"></div>
                    <span>✅ Interfaccia chat avanzata</span>
                  </li>
                </ul>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-brand-gold rounded-full mr-3"></div>
                    <span>✅ Salvataggio bandi</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-brand-gold rounded-full mr-3"></div>
                    <span>✅ Filtri personalizzati</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-brand-gold rounded-full mr-3"></div>
                    <span>✅ Monitoraggio scadenze</span>
                  </li>
                </ul>
              </div>
              <div className="text-center mt-8">
                <Button 
                  size="lg" 
                  className="bg-white text-brand-navy hover:bg-gray-100"
                  onClick={() => navigate('/search')}
                >
                  Inizia Subito la Ricerca
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
