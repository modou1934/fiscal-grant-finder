import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, MessageSquare, LogOut, ArrowRight, Bookmark, TrendingUp, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSavedGrants } from '@/hooks/use-saved-grants';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { getSavedGrantsCount } = useSavedGrants();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b safe-area-top">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-brand-navy to-brand-emerald rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 text-white font-bold text-sm flex items-center justify-center">F</div>
              </div>
              <div>
                <span className="text-lg font-bold text-brand-navy">Fiscalot AI</span>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleSignOut}
              className="text-gray-600 hover:text-brand-navy p-2"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Welcome Section - Mobile */}
      <div className="px-4 py-6 bg-gradient-to-r from-brand-navy to-brand-emerald text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">
            Benvenuto!
          </h1>
          <p className="text-blue-100 text-sm">
            {user?.user_metadata?.name || user?.email?.split('@')[0]}
          </p>
          <p className="text-blue-200 text-sm mt-1">
            Trova i bandi perfetti per la tua azienda
          </p>
        </div>
      </div>

      {/* Stats Cards - Mobile */}
      <div className="px-4 py-4 -mt-6 relative z-10">
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-white shadow-lg border-0 rounded-xl">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-brand-emerald/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Search className="w-5 h-5 text-brand-emerald" />
              </div>
              <p className="text-2xl font-bold text-brand-emerald">1,247</p>
              <p className="text-xs text-gray-600">Bandi Attivi</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0 rounded-xl">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Bookmark className="w-5 h-5 text-brand-gold" />
              </div>
              <p className="text-2xl font-bold text-brand-gold">{getSavedGrantsCount()}</p>
              <p className="text-xs text-gray-600">Salvati</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0 rounded-xl">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-brand-navy/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <MessageSquare className="w-5 h-5 text-brand-navy" />
              </div>
              <p className="text-2xl font-bold text-brand-navy">0</p>
              <p className="text-xs text-gray-600">Ricerche</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions - Mobile */}
      <div className="px-4 py-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Azioni Rapide</h2>
        
        <div className="space-y-3">
          <Card className="shadow-md border-0 rounded-xl overflow-hidden" onClick={() => navigate('/search')}>
            <CardContent className="p-0">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-brand-navy to-blue-600 flex items-center justify-center">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 p-4">
                  <h3 className="font-semibold text-brand-navy mb-1">Cerca Bandi</h3>
                  <p className="text-sm text-gray-600">Trova i bandi più adatti con l'AI</p>
                </div>
                <div className="pr-4">
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0 rounded-xl overflow-hidden" onClick={() => navigate('/saved-grants')}>
            <CardContent className="p-0">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-brand-gold to-orange-500 flex items-center justify-center">
                  <Bookmark className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 p-4">
                  <h3 className="font-semibold text-brand-navy mb-1">Bandi Salvati</h3>
                  <p className="text-sm text-gray-600">Accedi ai tuoi bandi preferiti</p>
                </div>
                <div className="pr-4">
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0 rounded-xl overflow-hidden opacity-60">
            <CardContent className="p-0">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 p-4">
                  <h3 className="font-semibold text-gray-600 mb-1">Statistiche</h3>
                  <p className="text-sm text-gray-500">Prossimamente disponibile</p>
                </div>
                <div className="pr-4">
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">Soon</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Banner - Mobile */}
      <div className="px-4 py-4">
        <Card className="shadow-lg border-0 bg-gradient-to-r from-brand-navy to-brand-emerald text-white rounded-xl">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-2">
              🚀 GrantFinder è Operativo!
            </h2>
            <p className="text-blue-100 mb-4 text-sm">
              Inizia subito a cercare i bandi perfetti per la tua azienda
            </p>
            
            <div className="grid grid-cols-2 gap-3 text-left mb-6">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-brand-gold rounded-full mr-2"></div>
                  <span>✅ Ricerca AI</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-brand-gold rounded-full mr-2"></div>
                  <span>✅ Database aggiornato</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-brand-gold rounded-full mr-2"></div>
                  <span>✅ Chat avanzata</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-brand-gold rounded-full mr-2"></div>
                  <span>✅ Salvataggio</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-brand-gold rounded-full mr-2"></div>
                  <span>✅ Filtri smart</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-brand-gold rounded-full mr-2"></div>
                  <span>✅ Monitoraggio</span>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full bg-white text-brand-navy hover:bg-gray-100 font-semibold py-3 rounded-xl"
              onClick={() => navigate('/search')}
            >
              Inizia la Ricerca
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Safe area bottom padding */}
      <div className="safe-area-bottom"></div>
    </div>
  );
};

export default Dashboard;