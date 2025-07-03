
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, MessageSquare, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user, signOut } = useAuth();

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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-brand-navy mb-4">
              Dashboard - In Sviluppo
            </h1>
            <p className="text-xl text-gray-600">
              La tua dashboard professionale per la ricerca di bandi sarà presto disponibile
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover-lift border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-brand-navy">
                  <Search className="w-5 h-5 mr-2" />
                  Ricerca Bandi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Interfaccia chat intelligente per trovare i bandi perfetti per la tua azienda.
                </p>
                <Button disabled className="w-full">
                  Prossimamente
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-brand-navy">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Conversazioni
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Storico delle tue ricerche e conversazioni con l'AI.
                </p>
                <Button disabled className="w-full">
                  Prossimamente
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-brand-navy">
                  <Settings className="w-5 h-5 mr-2" />
                  Impostazioni
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Gestisci il tuo profilo e le preferenze di ricerca.
                </p>
                <Button disabled className="w-full">
                  Prossimamente
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Card className="shadow-xl border-0 bg-gradient-to-r from-brand-navy to-brand-emerald text-white">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">
                  🚀 Implementazione in Corso
                </h2>
                <p className="text-lg mb-6">
                  Stiamo sviluppando una piattaforma rivoluzionaria per la ricerca di bandi. 
                  Il sistema includerà:
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <ul className="space-y-2">
                    <li>✅ Interfaccia chat avanzata</li>
                    <li>✅ Ricerca AI personalizzata</li>
                    <li>✅ Database bandi aggiornato</li>
                  </ul>
                  <ul className="space-y-2">
                    <li>✅ Notifiche intelligenti</li>
                    <li>✅ Analytics dettagliate</li>
                    <li>✅ Export e condivisione</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
