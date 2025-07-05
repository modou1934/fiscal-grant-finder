
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, ArrowLeft, Filter, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ChatInterface from '@/components/ChatInterface';
import GrantCard from '@/components/GrantCard';

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
  const [searchMode, setSearchMode] = useState<'chat' | 'traditional'>('chat');
  const [savedGrants, setSavedGrants] = useState<string[]>([]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSaveGrant = (grant: any) => {
    setSavedGrants(prev => 
      prev.includes(grant.id) 
        ? prev.filter(id => id !== grant.id)
        : [...prev, grant.id]
    );
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
          {/* Mode Toggle */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-sm border">
              <Button
                variant={searchMode === 'chat' ? 'default' : 'ghost'}
                onClick={() => setSearchMode('chat')}
                className={`${searchMode === 'chat' ? 'bg-brand-navy text-white' : 'text-gray-600'}`}
              >
                💬 Ricerca Chat
              </Button>
              <Button
                variant={searchMode === 'traditional' ? 'default' : 'ghost'}
                onClick={() => setSearchMode('traditional')}
                className={`${searchMode === 'traditional' ? 'bg-brand-navy text-white' : 'text-gray-600'}`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Ricerca Tradizionale
              </Button>
            </div>
          </div>

          {searchMode === 'chat' ? (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-brand-navy mb-4">
                  Ricerca Intelligente con AI
                </h1>
                <p className="text-xl text-gray-600">
                  Descrivi il tipo di finanziamento che cerchi e trova i bandi più adatti
                </p>
              </div>
              
              <ChatInterface />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-brand-navy mb-4">
                  Esplora i Bandi Disponibili
                </h1>
                <p className="text-xl text-gray-600">
                  Sfoglia e filtra i bandi in base alle tue esigenze
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
                  <div className="grid md:grid-cols-3 gap-4">
                    <Input placeholder="Cerca per parole chiave..." />
                    <Input placeholder="Settore..." />
                    <Input placeholder="Regione..." />
                  </div>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleGrants.map((grant) => (
                  <GrantCard
                    key={grant.id}
                    grant={grant}
                    onSave={handleSaveGrant}
                    isSaved={savedGrants.includes(grant.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
