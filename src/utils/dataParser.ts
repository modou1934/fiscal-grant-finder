import { useState } from 'react';

export interface BandoResult {
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

export interface BandiData {
  success: boolean;
  total_found: number;
  search_time: number;
  results: BandoResult[];
}

export interface ParseResult {
  success: boolean;
  data: BandiData | null;
  error: string | null;
}

/**
 * Funzione per parsare i dati provenienti dall'agente N8N
 * Gestisce sia il formato attuale che quello semplificato
 */
export const parseN8NData = (rawData: any): ParseResult => {
  try {
    let parsedData;
    
    // Caso 1: Stringa JSON da parsare
    if (typeof rawData === 'string') {
      console.log('Parsing stringa JSON...');
      const parsed = JSON.parse(rawData);
      
      // Se è un array, prende il primo elemento
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log('Formato array, prendendo primo elemento...');
        parsedData = parsed[0];
      } else {
        parsedData = parsed;
      }
    }
    // Caso 2: Array che contiene l'oggetto (nuovo formato)
    else if (Array.isArray(rawData) && rawData.length > 0) {
      console.log('Parsing array formato...');
      if (rawData[0]?.output) {
        // Formato N8N con output come stringa
        parsedData = JSON.parse(rawData[0].output);
      } else {
        // Array diretto con oggetto
        parsedData = rawData[0];
      }
    }
    // Caso 3: Oggetto JSON diretto
    else if (typeof rawData === 'object' && rawData !== null) {
      console.log('Parsing oggetto diretto...');
      parsedData = rawData;
    }
    // Caso 4: Formato non riconosciuto
    else {
      throw new Error('Formato dati non riconosciuto');
    }
    
    // Validazione della struttura
    if (!parsedData || !parsedData.results || !Array.isArray(parsedData.results)) {
      console.error('Struttura dati non valida:', parsedData);
      throw new Error('Struttura dati non valida: manca l\'array results');
    }
    
    console.log('Parsing completato con successo, trovati', parsedData.results.length, 'risultati');
    
    return {
      success: true,
      data: parsedData,
      error: null
    };
    
  } catch (error) {
    console.error('Errore nel parsing dei dati:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Errore sconosciuto'
    };
  }
};

/**
 * Funzione per validare un singolo bando
 */
export const validateBando = (bando: any) => {
  const requiredFields = ['title', 'entity', 'description', 'deadline'];
  
  for (const field of requiredFields) {
    if (!bando[field]) {
      return {
        isValid: false,
        missingField: field
      };
    }
  }
  
  return {
    isValid: true,
    missingField: null
  };
};

/**
 * Funzione per formattare i dati per l'interfaccia
 */
export const formatBandiForUI = (bandiData: BandiData) => {
  if (!bandiData || !bandiData.results) {
    return [];
  }
  
  return bandiData.results.map((bando, index) => ({
    id: index,
    title: bando.title,
    entity: bando.entity,
    description: bando.description,
    sectors: bando.sectors || [],
    targetSize: bando.target_size || 'Non specificato',
    totalBudget: bando.total_budget || 'Non specificato',
    maxContribution: bando.max_contribution || 'Non specificato',
    deadline: bando.deadline,
    regions: bando.regions || [],
    url: bando.url,
    relevanceScore: bando.relevance_score || 0,
    complexityScore: bando.complexity_score || 0,
    successProbability: bando.success_probability || 0,
    keywords: bando.keywords || []
  }));
};

/**
 * Funzione per ordinare i bandi per rilevanza
 */
export const sortBandiByRelevance = (bandi: any[]) => {
  return [...bandi].sort((a, b) => b.relevanceScore - a.relevanceScore);
};

/**
 * Funzione per filtrare i bandi per settore
 */
export const filterBandiBySector = (bandi: any[], sector: string) => {
  return bandi.filter(bando => 
    bando.sectors.some((s: string) => s.toLowerCase().includes(sector.toLowerCase()))
  );
};

/**
 * Hook personalizzato per gestire i dati N8N
 */
export const useN8NData = () => {
  const [bandiData, setBandiData] = useState<BandiData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const processN8NData = (rawData: any) => {
    setLoading(true);
    setError(null);
    
    const result = parseN8NData(rawData);
    
    if (result.success && result.data) {
      setBandiData(result.data);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };
  
  return {
    bandiData,
    loading,
    error,
    processN8NData
  };
};