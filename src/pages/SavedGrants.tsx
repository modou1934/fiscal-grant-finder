import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowLeft, Bookmark, LogOut, Calendar, Euro, Building2, Users, ExternalLink, Trash2, BookmarkCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSavedGrants } from '@/hooks/use-saved-grants';
import { toast } from 'sonner';

const SavedGrants = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { savedGrants, removeSavedGrant, clearAllSavedGrants } = useSavedGrants();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleRemoveGrant = (grantId: string) => {
    removeSavedGrant(grantId);
    toast.success('Bando rimosso dai salvati');
  };

  const handleClearAll = () => {
    if (savedGrants.length === 0) return;
    
    if (confirm('Sei sicuro di voler rimuovere tutti i bandi salvati?')) {
      clearAllSavedGrants();
      toast.success('Tutti i bandi sono stati rimossi');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
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
                  <p className="text-xs text-gray-500">{savedGrants.length} bandi salvati</p>
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
        {savedGrants.length === 0 ? (
          // Empty State
          <div className="max-w-sm mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-brand-gold to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bookmark className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-brand-navy mb-2">
                Nessun Bando Salvato
              </h1>
              <p className="text-gray-600 mb-6">
                Inizia a salvare i bandi che ti interessano durante la ricerca
              </p>
              <Button 
                onClick={() => navigate('/search')}
                className="w-full bg-brand-navy text-white hover:bg-brand-navy/90 font-semibold py-3 rounded-xl"
              >
                Inizia a Cercare Bandi
              </Button>
            </div>
          </div>
        ) : (
          // Saved Grants List
          <div className="space-y-4">
            {/* Header with Clear All */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-brand-navy">
                  I Tuoi Bandi Salvati
                </h1>
                <p className="text-sm text-gray-600">
                  {savedGrants.length} bando{savedGrants.length !== 1 ? 'i' : ''} salvato{savedGrants.length !== 1 ? 'i' : ''}
                </p>
              </div>
              {savedGrants.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Cancella Tutti
                </Button>
              )}
            </div>

            {/* Saved Grants Cards */}
            <div className="space-y-4">
              {savedGrants.map((grant) => (
                <Card key={grant.id} className="shadow-md border-0 rounded-xl bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-brand-navy line-clamp-2 mb-1">
                          {grant.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{grant.entity}</p>
                        <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                          {grant.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveGrant(grant.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {grant.sectors.slice(0, 2).map((sector, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {sector}
                        </Badge>
                      ))}
                      {grant.sectors.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{grant.sectors.length - 2}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(grant.deadline)}</span>
                      </div>
                      <div className="flex items-center">
                        <Euro className="w-4 h-4 mr-2" />
                        <span className="truncate">{grant.max_contribution}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Rilevanza: {grant.relevance_score}/10</span>
                        <span>Successo: {grant.success_probability}/10</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => window.open(grant.url, '_blank')}
                        className="bg-brand-navy hover:bg-brand-navy/90 text-white rounded-lg"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Apri
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Safe area bottom padding */}
      <div className="safe-area-bottom"></div>
    </div>
  );
};

export default SavedGrants;