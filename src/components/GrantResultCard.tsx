
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Euro, Bookmark, ExternalLink, Building2, Users, TrendingUp, Clock, Zap } from 'lucide-react';

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
  urgency_level: number;
  keywords: string[];
}

interface GrantResultCardProps {
  grant: GrantResult;
  onSave?: (grant: GrantResult) => void;
  isSaved?: boolean;
}

const GrantResultCard: React.FC<GrantResultCardProps> = ({ grant, onSave, isSaved = false }) => {
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

  return (
    <Card className="hover-lift border-0 shadow-lg bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300">
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
              onClick={() => onSave?.(grant)}
              className={`p-1 h-8 w-8 ${isSaved ? 'text-brand-gold' : 'text-gray-600'}`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
        
        <p className="text-sm text-gray-700 line-clamp-3 mt-2">
          {grant.description}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
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

        <div className="flex items-center justify-between text-xs text-gray-600 bg-white/50 rounded p-2">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>Successo: {grant.success_probability.toFixed(1)}/10</span>
            </div>
            <div className={`flex items-center ${getUrgencyColor(grant.urgency_level)}`}>
              <Clock className="w-3 h-3 mr-1" />
              <span>Urgenza: {grant.urgency_level}/10</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-gray-600">
            Budget: {grant.total_budget}
          </span>
          <Button 
            size="sm" 
            className="bg-brand-navy hover:bg-brand-navy/90"
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
