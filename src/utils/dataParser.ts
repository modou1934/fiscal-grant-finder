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
  message?: string;
  suggestions?: string[];
  alternative_searches?: string[];
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
      
      // Controlla se la stringa è vuota o contiene solo spazi
      if (!rawData || rawData.trim() === '') {
        console.error('Ricevuta stringa JSON vuota o invalida dal webhook');
        return {
          success: false,
          data: null,
          error: 'Received empty or invalid JSON string from webhook'
        };
      }
      
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
      // Controlla se il primo elemento ha la struttura corretta
      const firstElement = rawData[0];
      if (firstElement?.output) {
        // Formato N8N con output come stringa
        parsedData = JSON.parse(firstElement.output);
      } else if (firstElement?.success !== undefined && firstElement?.results) {
        // Array diretto con oggetto che ha già la struttura corretta
        parsedData = firstElement;
      } else {
        // Fallback: usa il primo elemento
        parsedData = firstElement;
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
    
    console.log('Dati parsati:', parsedData);
    
    // Gestione caso nessun risultato trovato
    if (parsedData.success === false) {
      console.log('Nessun risultato trovato, restituendo messaggio di errore');
      return {
        success: true,
        data: {
          success: false,
          total_found: parsedData.total_found || 0,
          search_time: parsedData.search_time || 0,
          results: [],
          message: parsedData.message || 'Nessun bando trovato per i criteri specificati.',
          suggestions: parsedData.suggestions || [],
          alternative_searches: parsedData.alternative_searches || []
        },
        error: null
      };
    }
    
    // Validazione della struttura per risultati positivi
    if (!parsedData || !parsedData.results || !Array.isArray(parsedData.results)) {
      console.error('Struttura dati non valida:', parsedData);
      throw new Error('Struttura dati non valida: manca l\'array results');
    }
    
    // Validazione dei campi obbligatori
    if (parsedData.success === undefined) {
      console.warn('Campo success mancante, assumendo true');
      parsedData.success = true;
    }
    
    if (!parsedData.total_found) {
      console.warn('Campo total_found mancante, calcolando dalla lunghezza results');
      parsedData.total_found = parsedData.results.length;
    }
    
    if (!parsedData.search_time) {
      console.warn('Campo search_time mancante, impostando default');
      parsedData.search_time = 0;
    }
    
    console.log('Parsing completato con successo, trovati', parsedData.results.length, 'risultati');
    
    return {
      success: true,
      data: parsedData,
      error: null
    };
    
  } catch (error) {
    console.error('Errore nel parsing dei dati:', error);
    console.error('Dati raw ricevuti:', rawData);
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