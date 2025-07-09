
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
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Ricerca Bandi</h1>
        <p className="page-description">
          Trova i bandi di finanziamento più adatti alle tue esigenze
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-sm border-0 bg-card">
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
              className="input-focus"
            />
            <Input 
              placeholder="Settore..." 
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="input-focus"
            />
            <Input 
              placeholder="Regione..." 
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="input-focus"
            />
          </div>
          <div className="flex justify-center">
            <Button 
              onClick={handleSearch}
              disabled={isLoading}
              className="button-primary min-w-40"
            >
              <SearchIcon className="w-4 h-4 mr-2" />
              {isLoading ? 'Ricerca in corso...' : 'Cerca Bandi'}
            </Button>
          </div>
          
          {/* Loading message */}
          {isLoading && (
            <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg animate-fade-in">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <div className="text-center">
                  <p className="text-primary font-medium">Ricerca in corso...</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    L'analisi dei bandi può richiedere alcuni minuti. Attendere prego.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div className="animate-slide-up">
        <BandiCards bandiData={bandiData} />
      </div>
    </div>
  );

};

export default Search;
