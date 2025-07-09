import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, ArrowLeft, Bookmark, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const SavedGrants = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

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
              <Button 
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="text-brand-navy hover:bg-brand-navy/10 p-2 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-brand-gold to-orange-500 rounded-lg flex items-center justify-center">
                  <Bookmark className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-lg font-bold text-brand-navy">Salvati</span>
                  <p className="text-xs text-gray-500">I tuoi bandi preferiti</p>
                </div>
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

      {/* Main Content - Mobile */}
      <div className="px-4 py-8">
        <div className="max-w-sm mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-brand-gold to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-brand-navy mb-2">
              Bandi Salvati
            </h1>
            <p className="text-gray-600">
              I tuoi bandi preferiti in un unico posto
            </p>
          </div>

          <Card className="shadow-lg border-0 bg-gradient-to-r from-brand-navy to-brand-emerald text-white rounded-2xl">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-bold mb-3">
                🔖 In Sviluppo
              </h2>
              <p className="text-blue-100 mb-6 text-sm">
                Presto potrai salvare e organizzare i tuoi bandi preferiti con:
              </p>
              
              <div className="space-y-3 text-left mb-6">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-brand-gold rounded-full mr-3"></div>
                  <span>Organizzazione per categorie</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-brand-gold rounded-full mr-3"></div>
                  <span>Promemoria automatici</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-brand-gold rounded-full mr-3"></div>
                  <span>Stato candidature</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-brand-gold rounded-full mr-3"></div>
                  <span>Export in PDF</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-brand-gold rounded-full mr-3"></div>
                  <span>Condivisione team</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-brand-gold rounded-full mr-3"></div>
                  <span>Analisi e statistiche</span>
                </div>
              </div>

              <Button 
                onClick={() => navigate('/search')}
                className="w-full bg-white text-brand-navy hover:bg-gray-100 font-semibold py-3 rounded-xl"
              >
                Inizia a Cercare Bandi
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Safe area bottom padding */}
      <div className="safe-area-bottom"></div>
    </div>
  );
};

export default SavedGrants;