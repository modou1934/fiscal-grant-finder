
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import BandiCards from '@/components/BandiCards';
import { parseN8NData } from '@/utils/dataParser';
import { useToast } from '@/hooks/use-toast';

// Dati di esempio per i bandi
const sampleGrants = [
  {
    id: '1',
    title: 'Bando Startup Innovative 2024',
    description: 'Finanziamento per startup innovative nel settore tecnologico e digitale. Sostegno alla nascita e sviluppo di imprese innovative con particolare focus su AI, IoT e sostenibilità.',
    deadline: '15 Mar 2024',
    amount: '€50.000 - €200.000',
    region: 'Lombardia',
    sector: 'Tecnologia',
    compatibility: 85,
    source: 'Regione Lombardia'
  },
  {
    id: '2',
    title: 'Horizon Europe - Digital & Industry',
    description: 'Programma europeo per la ricerca e innovazione nel settore digitale e industriale. Focus su trasformazione digitale, industria 4.0 e tecnologie emergenti.',
    deadline: '28 Feb 2024',
    amount: '€100.000 - €2.000.000',
    region: 'Europa',
    sector: 'Ricerca & Sviluppo',
    compatibility: 78,
    source: 'Commissione Europea'
  },
  {
    id: '3',
    title: 'Fondo Rotativo per l\'Innovazione',
    description: 'Finanziamento agevolato per progetti di innovazione tecnologica e digitale delle PMI. Sostegno per ricerca industriale e sviluppo sperimentale.',
    deadline: '31 Mar 2024',
    amount: '€25.000 - €500.000',
    region: 'Nazionale',
    sector: 'PMI',
    compatibility: 92,
    source: 'Ministero Sviluppo Economico'
  }
];

const Search = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [keywords, setKeywords] = useState('');
  const [sector, setSector] = useState('');
  const [region, setRegion] = useState('');
  const [bandiData, setBandiData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
      
      const response = await fetch(`https://fiscalot.duckdns.org/webhook-test/2f381203-47e1-4fd6-8221-438bad7fee08?${params}`, {
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
          
          // Gestisci caso nessun risultato trovato
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
                  <SearchIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-brand-navy">GrantFinder</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.user_metadata?.name || user?.email}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSignOut}
                className="text-gray-600 hover:text-brand-navy"
              >
                Esci
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-brand-navy mb-4">
                Ricerca Bandi di Finanziamento
              </h1>
              <p className="text-xl text-gray-600">
                Trova i bandi più adatti alle tue esigenze
              </p>
            </div>

            {/* Search and Filters */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <SlidersHorizontal className="w-5 h-5 mr-2" />
                  Filtri di Ricerca
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <Input 
                    placeholder="Cerca per parole chiave..." 
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                  />
                  <Input 
                    placeholder="Settore..." 
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                  />
                  <Input 
                    placeholder="Regione..." 
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  />
                </div>
                <div className="flex justify-center">
                  <Button 
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="bg-brand-navy hover:bg-brand-navy/90 min-w-40"
                  >
                    <SearchIcon className="w-4 h-4 mr-2" />
                    {isLoading ? 'Ricerca in corso...' : 'Cerca Bandi'}
                  </Button>
                </div>
                
                {/* Messaggio informativo quando la ricerca è in corso */}
                {isLoading && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-navy"></div>
                      <div className="text-center">
                        <p className="text-brand-navy font-medium">Ricerca in corso...</p>
                        <p className="text-sm text-gray-600 mt-1">
                          L'analisi dei bandi può richiedere alcuni minuti. Attendere prego.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results */}
            <BandiCards bandiData={bandiData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
