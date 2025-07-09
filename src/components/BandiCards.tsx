import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, Euro, Building, Users, Target, TrendingUp, Search, Bookmark, BookmarkCheck } from 'lucide-react';
import { useSavedGrants } from '@/hooks/use-saved-grants';
import { toast } from 'sonner';

interface BandoResult {
  title: string;
  entity: string;
  description: string;
  sectors: string[];
  target_size: string;
  total_budget: string;
  max_contribution: string;
  deadline: string;
  regions: string[];
  url: string;
  relevance_score: number;
  complexity_score: number;
  success_probability: number;
  keywords: string[];
}

interface BandiData {
  success: boolean;
  total_found: number;
  search_time: number;
  results: BandoResult[];
  message?: string;
  suggestions?: string[];
  alternative_searches?: string[];
}

interface BandiCardsProps {
  bandiData?: BandiData | null;
  onDataReceived?: (data: any) => void;
}

const BandiCards: React.FC<BandiCardsProps> = ({ bandiData, onDataReceived }) => {
  const { isGrantSaved, toggleSaveGrant } = useSavedGrants();

  const formatCurrency = (amount: string) => {
    return amount.replace(/€/g, '').replace(/\./g, ',') + ' €';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const handleSaveToggle = (bando: BandoResult) => {
    const wasToggled = toggleSaveGrant(bando);
    const isSaved = isGrantSaved(bando);
    
    if (isSaved) {
      toast.success('Bando rimosso dai salvati');
    } else if (wasToggled) {
      toast.success('Bando salvato con successo!');
    } else {
      toast.error('Errore nel salvare il bando');
    }
  };

  if (!bandiData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Utilizza i filtri sopra per cercare i bandi</p>
      </div>
    );
  }

  // Gestisci caso nessun risultato trovato
  if (bandiData.success === false) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Nessun risultato trovato
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-700 mb-4">
              {bandiData.message}
            </p>
            
            {bandiData.suggestions && bandiData.suggestions.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-amber-800 mb-2">Suggerimenti:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {bandiData.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-amber-700 text-sm">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {bandiData.alternative_searches && bandiData.alternative_searches.length > 0 && (
              <div>
                <h4 className="font-medium text-amber-800 mb-2">Ricerche alternative:</h4>
                <div className="flex flex-wrap gap-2">
                  {bandiData.alternative_searches.map((search, index) => (
                    <Badge key={index} variant="outline" className="text-amber-700 border-amber-300">
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-brand-navy mb-2">Bandi di Finanziamento</h2>
        <p className="text-gray-600">
          Trovati {bandiData.total_found} bandi in {bandiData.search_time}s
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bandiData.results.map((bando, index) => (
          <Card key={index} className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 rounded-xl border-0 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg leading-tight line-clamp-3">
                  {bando.title}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={getRelevanceColor(bando.relevance_score)}>
                    {bando.relevance_score}/10
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSaveToggle(bando)}
                    className={`p-2 h-8 w-8 rounded-full transition-all ${
                      isGrantSaved(bando)
                        ? 'text-brand-gold bg-brand-gold/10 hover:bg-brand-gold/20' 
                        : 'text-gray-400 hover:text-brand-gold hover:bg-brand-gold/10'
                    }`}
                  >
                    {isGrantSaved(bando) ? (
                      <BookmarkCheck className="w-4 h-4 fill-current" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{bando.entity}</p>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                {bando.description}
              </p>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    Scadenza: {formatDate(bando.deadline)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Euro className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    Budget: {formatCurrency(bando.total_budget)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    Target: {bando.target_size}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    Max contributo: {bando.max_contribution}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Settori:</p>
                <div className="flex flex-wrap gap-1">
                  {bando.sectors.map((sector, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {sector}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Keywords:</p>
                <div className="flex flex-wrap gap-1">
                  {bando.keywords.slice(0, 4).map((keyword, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                  {bando.keywords.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{bando.keywords.length - 4}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Successo: {bando.success_probability}/10</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  <span>Complessità: {bando.complexity_score}/10</span>
                </div>
              </div>
              
              <div className="mt-auto pt-4">
                <Button 
                  asChild 
                  className="w-full bg-brand-navy hover:bg-brand-navy/90 rounded-lg"
                >
                  <a href={bando.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Vai al Bando
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BandiCards;