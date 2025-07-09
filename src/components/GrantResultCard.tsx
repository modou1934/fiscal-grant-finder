
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Euro, Bookmark, BookmarkCheck, ExternalLink, Building2, Users, TrendingUp, Clock, Zap } from 'lucide-react';
import { useSavedGrants } from '@/hooks/use-saved-grants';
import { toast } from 'sonner';

interface GrantResult {
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
  urgency_level?: number;
  keywords: string[];
}

interface GrantResultCardProps {
  grant: GrantResult;
}

const GrantResultCard: React.FC<GrantResultCardProps> = ({ grant }) => {
  const { isGrantSaved, toggleSaveGrant } = useSavedGrants();
  const isSaved = isGrantSaved(grant);

  const getRelevanceColor = (score: number) => {
    if (score >= 9) return 'bg-green-500';
    if (score >= 7) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getUrgencyColor = (level: number) => {
    if (level >= 8) return 'text-red-600';
    if (level >= 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatDeadline = (deadline: string) => {
    try {
      const date = new Date(deadline);
      return date.toLocaleDateString('it-IT', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return deadline;
    }
  };

  const handleSaveToggle = () => {
    const wasToggled = toggleSaveGrant(grant);
    
    if (isSaved) {
      toast.success('Bando rimosso dai salvati');
    } else if (wasToggled) {
      toast.success('Bando salvato con successo!');
    } else {
      toast.error('Errore nel salvare il bando');
    }
  };

  return (
    <Card className="hover-lift border-0 shadow-lg bg-white rounded-xl">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-brand-navy line-clamp-2 flex-1">
            {grant.title}
          </CardTitle>
          <div className="flex items-center space-x-2 ml-4">
            <div className="flex items-center space-x-1">
              <div className={`w-3 h-3 rounded-full ${getRelevanceColor(grant.relevance_score)}`}></div>
              <span className="text-sm font-medium text-brand-navy">{grant.relevance_score.toFixed(1)}%</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveToggle}
              className={`p-2 h-10 w-10 rounded-full transition-all ${
                isSaved 
                  ? 'text-brand-gold bg-brand-gold/10 hover:bg-brand-gold/20' 
                  : 'text-gray-400 hover:text-brand-gold hover:bg-brand-gold/10'
              }`}
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5 fill-current" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
        
        <p className="text-sm text-gray-700 line-clamp-3 mt-2">
          {grant.description}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {grant.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="default" className="text-xs bg-brand-navy text-white">
            {grant.sectors[0]}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <MapPin className="w-3 h-3 mr-1" />
            {grant.regions[0]}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="flex items-center text-sm text-gray-700">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Scadenza: {formatDeadline(grant.deadline)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <Euro className="w-4 h-4 mr-2" />
            <span>{grant.max_contribution}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="flex items-center text-sm text-gray-700">
            <Building2 className="w-4 h-4 mr-2" />
            <span>{grant.entity}</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <Users className="w-4 h-4 mr-2" />
            <span>{grant.target_size}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>Successo: {grant.success_probability.toFixed(1)}/10</span>
            </div>
            {grant.urgency_level !== undefined && (
              <div className={`flex items-center ${getUrgencyColor(grant.urgency_level)}`}>
                <Clock className="w-3 h-3 mr-1" />
                <span>Urgenza: {grant.urgency_level}/10</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-gray-600">
            <strong>Budget:</strong> {grant.total_budget}
          </span>
          <Button 
            size="sm" 
            className="bg-brand-navy hover:bg-brand-navy/90 rounded-lg"
            onClick={() => window.open(grant.url, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Dettagli
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrantResultCard;
