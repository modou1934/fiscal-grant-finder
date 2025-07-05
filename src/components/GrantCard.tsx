
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Euro, Bookmark, ExternalLink } from 'lucide-react';

interface Grant {
  id: string;
  title: string;
  description: string;
  deadline: string;
  amount: string;
  region: string;
  sector: string;
  compatibility: number;
  source: string;
}

interface GrantCardProps {
  grant: Grant;
  onSave?: (grant: Grant) => void;
  isSaved?: boolean;
}

const GrantCard: React.FC<GrantCardProps> = ({ grant, onSave, isSaved = false }) => {
  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="hover-lift border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-brand-navy line-clamp-2">
            {grant.title}
          </CardTitle>
          <div className="flex items-center space-x-2 ml-4">
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${getCompatibilityColor(grant.compatibility)}`}></div>
              <span className="text-xs font-medium">{grant.compatibility}%</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSave?.(grant)}
              className={`p-1 h-8 w-8 ${isSaved ? 'text-brand-gold' : 'text-gray-400'}`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm line-clamp-3">
          {grant.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            {grant.sector}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <MapPin className="w-3 h-3 mr-1" />
            {grant.region}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Scadenza: {grant.deadline}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Euro className="w-4 h-4 mr-2" />
            <span>{grant.amount}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-gray-500">
            Fonte: {grant.source}
          </span>
          <Button 
            size="sm" 
            className="bg-brand-navy hover:bg-brand-navy/90"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Dettagli
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrantCard;
