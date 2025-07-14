import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, ArrowLeft, SlidersHorizontal, LogOut, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import BandiCards from '@/components/BandiCards';
import { parseN8NData } from '@/utils/dataParser';
import { useToast } from '@/hooks/use-toast';

const Search = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [keywords, setKeywords] = useState('');
  const [sector, setSector] = useState('');
  const [region, setRegion] = useState('');
  const [bandiData, setBandiData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const clearFilters = () => {
    setKeywords('');
    setSector('');
    setRegion('');
  };

  const handleSearch = async () => {
    if (!keywords.trim() && !sector.trim() && !region.trim()) {
      toast({
        title: "Attenzione",
        description: "Inserisci almeno un criterio di ricerca",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const searchQuery = `Cerco bandi per: ${keywords}${sector ? `, settore: ${sector}` : ''}${region ? `, regione: ${region}` : ''}`;
      
      const params = new URLSearchParams({
        message: searchQuery,
        timestamp: new Date().toISOString(),
        user_id: 'user_' + Date.now()
      });
      
      const response = await fetch(`https://fiscalot.duckdns.org/webhook/2f381203-47e1-4fd6-8221-438bad7fee08?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const responseText = await response.text();
        console.log('Raw webhook response:', responseText);
        
        const parseResult = parseN8NData(responseText);
        
        if (parseResult.success && parseResult.data) {
          setBandiData(parseResult.data);
          
          if (parseResult.data.success === false) {
            toast({
              title: "Nessun risultato trovato",
              description: parseResult.data.message || "Nessun bando trovato per i criteri specificati.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Ricerca completata",
              description: `Trovati ${parseResult.data.total_found} bandi`,
            });
          }
        } else {
          console.error('Parsing failed:', parseResult.error);
          toast({
            title: "Errore",
            description: "Impossibile elaborare la risposta del server",
            variant: "destructive",
          });
        }
      } else {
        throw new Error('Errore nella risposta del server');
      }
    } catch (error) {
      console.error('Error calling webhook:', error);
      toast({
        title: "Errore di connessione",
        description: "Impossibile connettersi al servizio. Controlla la connessione.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b safe-area-top w-full">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="text-brand-primary hover:bg-brand-primary/10 p-2 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-brand-navy to-brand-emerald rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <div>
                  <span className="text-base sm:text-lg font-bold text-brand-primary">Ricerca</span>
                  <p className="text-xs text-gray-500">Trova i tuoi bandi</p>
                </div>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleSignOut}
              className="text-gray-600 hover:text-brand-primary p-2"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Search Bar - Mobile */}
      <div className="px-4 py-4 bg-white border-b w-full">
        <div className="space-y-3">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Input 
                placeholder="Cerca bandi..." 
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="h-12 rounded-xl bg-white border-gray-300 focus:border-brand-primary focus:ring-brand-primary pr-12 text-base"
              />
              {keywords && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setKeywords('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </Button>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-4 rounded-xl border-gray-300"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
          </div>

          {/* Filters - Mobile Collapsible */}
          {showFilters && (
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <Input 
                placeholder="Settore (es. Tecnologia)" 
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="h-12 rounded-xl bg-white border-gray-300 focus:border-brand-primary focus:ring-brand-primary text-base"
              />
              <Input 
                placeholder="Regione (es. Lombardia)" 
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="h-12 rounded-xl bg-white border-gray-300 focus:border-brand-primary focus:ring-brand-primary text-base"
              />
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="flex-1 h-10 rounded-xl text-gray-600"
                >
                  Cancella
                </Button>
                <Button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 h-10 rounded-xl bg-brand-primary text-white"
                >
                  Applica
                </Button>
              </div>
            </div>
          )}

          <Button 
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full bg-brand-primary hover:bg-brand-primary/90 h-12 rounded-xl font-semibold text-sm sm:text-base"
          >
            <SearchIcon className="w-5 h-5 mr-2" />
            {isLoading ? 'Ricerca in corso...' : 'Cerca Bandi'}
          </Button>
        </div>
      </div>

      {/* Loading State - Mobile */}
      {isLoading && (
        <div className="px-4 py-6 w-full">
          <Card className="border-0 bg-blue-50 rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                <div className="text-center">
                  <p className="text-brand-primary font-medium">Ricerca in corso...</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Analisi dei bandi in corso
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results - Mobile */}
      <div className="px-4 py-4 w-full">
        <BandiCards bandiData={bandiData} />
      </div>

      {/* Safe area bottom padding */}
      <div className="safe-area-bottom"></div>
    </div>
  );
};

export default Search;