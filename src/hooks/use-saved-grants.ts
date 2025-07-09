import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface SavedGrant {
  id: string;
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
  saved_at: string;
}

export const useSavedGrants = () => {
  const { user } = useAuth();
  const [savedGrants, setSavedGrants] = useState<SavedGrant[]>([]);

  // Carica i bandi salvati dal localStorage all'avvio
  useEffect(() => {
    if (user?.id) {
      const saved = localStorage.getItem(`saved_grants_${user.id}`);
      if (saved) {
        try {
          setSavedGrants(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading saved grants:', error);
          setSavedGrants([]);
        }
      }
    }
  }, [user?.id]);

  // Salva i bandi nel localStorage quando cambiano
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`saved_grants_${user.id}`, JSON.stringify(savedGrants));
    }
  }, [savedGrants, user?.id]);

  const saveGrant = (grant: any) => {
    if (!user?.id) return false;

    const savedGrant: SavedGrant = {
      id: `${grant.title}_${grant.entity}`.replace(/\s+/g, '_').toLowerCase(),
      title: grant.title,
      entity: grant.entity,
      description: grant.description,
      sectors: grant.sectors || [],
      target_size: grant.target_size || 'Non specificato',
      total_budget: grant.total_budget || 'Non specificato',
      max_contribution: grant.max_contribution || 'Non specificato',
      deadline: grant.deadline,
      regions: grant.regions || [],
      url: grant.url,
      relevance_score: grant.relevance_score || 0,
      complexity_score: grant.complexity_score || 0,
      success_probability: grant.success_probability || 0,
      keywords: grant.keywords || [],
      saved_at: new Date().toISOString()
    };

    setSavedGrants(prev => {
      const exists = prev.find(g => g.id === savedGrant.id);
      if (exists) {
        return prev; // Già salvato
      }
      return [savedGrant, ...prev];
    });

    return true;
  };

  const removeSavedGrant = (grantId: string) => {
    setSavedGrants(prev => prev.filter(g => g.id !== grantId));
  };

  const isGrantSaved = (grant: any) => {
    const grantId = `${grant.title}_${grant.entity}`.replace(/\s+/g, '_').toLowerCase();
    return savedGrants.some(g => g.id === grantId);
  };

  const toggleSaveGrant = (grant: any) => {
    const grantId = `${grant.title}_${grant.entity}`.replace(/\s+/g, '_').toLowerCase();
    const isSaved = isGrantSaved(grant);
    
    if (isSaved) {
      removeSavedGrant(grantId);
      return false;
    } else {
      return saveGrant(grant);
    }
  };

  const getSavedGrantsCount = () => savedGrants.length;

  const clearAllSavedGrants = () => {
    setSavedGrants([]);
  };

  return {
    savedGrants,
    saveGrant,
    removeSavedGrant,
    isGrantSaved,
    toggleSaveGrant,
    getSavedGrantsCount,
    clearAllSavedGrants
  };
};