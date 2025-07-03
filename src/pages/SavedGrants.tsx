
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, ArrowLeft, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SavedGrants = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="text-brand-navy hover:bg-brand-navy/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-brand-navy to-brand-emerald rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-brand-navy">GrantFinder</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-brand-gold to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bookmark className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-brand-navy mb-4">
              Bandi Salvati
            </h1>
            <p className="text-xl text-gray-600">
              I tuoi bandi preferiti e le scadenze importanti in un unico posto
            </p>
          </div>

          <Card className="shadow-xl border-0 bg-gradient-to-r from-brand-navy to-brand-emerald text-white">
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-bold mb-4">
                🔖 Funzionalità in Sviluppo
              </h2>
              <p className="text-lg mb-6">
                Presto potrai salvare, organizzare e monitorare i tuoi bandi preferiti con:
              </p>
              <div className="grid md:grid-cols-2 gap-6 text-left mt-8">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-brand-gold rounded-full mr-3"></div>
                    <span>Organizzazione per categorie</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-brand-gold rounded-full mr-3"></div>
                    <span>Promemoria automatici</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-brand-gold rounded-full mr-3"></div>
                    <span>Stato candidature</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-brand-gold rounded-full mr-3"></div>
                    <span>Export in PDF</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-brand-gold rounded-full mr-3"></div>
                    <span>Condivisione team</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-brand-gold rounded-full mr-3"></div>
                    <span>Analisi e statistiche</span>
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

export default SavedGrants;
