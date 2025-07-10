import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageSquare, Bot, Search, AlertCircle, Lightbulb } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import GrantResultCard from './GrantResultCard';
import { useSavedGrants } from '@/hooks/use-saved-grants';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  grantResults?: GrantResult[];
  searchInfo?: {
    total_found: number;
    search_time: number;
    search_date?: string;
    query_used?: string;
  };
  errorInfo?: {
    message: string;
    suggestions: string[];
    alternative_searches?: string[];
  };
}

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

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Ciao! Sono il tuo assistente per la ricerca di bandi. Dimmi di che tipo di finanziamento hai bisogno e ti aiuterò a trovare i bandi più adatti alla tua azienda.',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Funzione per estrarre e parsare il JSON dalla risposta
  const parseGrantsFromResponse = (responseText: string) => {
    try {
      console.log('Tentativo di parsing risposta:', responseText);
      
      let parsedData;
      
      // Prima prova a parsare direttamente come JSON
      try {
        parsedData = JSON.parse(responseText);
      } catch (e) {
        console.log('Parsing diretto fallito, tentativo con markdown:', e);
        
        // Cerca JSON in blocchi markdown
        const jsonMatches = responseText.match(/```json\s*\n?([\s\S]*?)\n?```/);
        if (jsonMatches && jsonMatches[1]) {
          parsedData = JSON.parse(jsonMatches[1]);
        } else {
          // Cerca pattern JSON nel testo (anche senza markdown)
          const jsonPattern = /\[?\{[\s\S]*"success"[\s\S]*\}\]?/;
          const jsonMatch = responseText.match(jsonPattern);
          if (jsonMatch) {
            parsedData = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('Nessun JSON valido trovato nella risposta');
          }
        }
      }
      
      // Se è un array, prende il primo elemento
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        parsedData = parsedData[0];
      }
      
      console.log('Dati parsati:', parsedData);
      
      // Caso 1: Successo con risultati
      if (parsedData.success === true && parsedData.results && Array.isArray(parsedData.results) && parsedData.results.length > 0) {
        return {
          success: true,
          type: 'results',
          grantResults: parsedData.results,
          searchInfo: {
            total_found: parsedData.total_found || parsedData.results.length,
            search_time: parsedData.search_time || 0,
            search_date: parsedData.search_date,
            query_used: parsedData.query_used
          }
        };
      }
      
      // Caso 2: Nessun risultato trovato
      if (parsedData.success === false || (parsedData.results && parsedData.results.length === 0)) {
        return {
          success: true,
          type: 'no_results',
          errorInfo: {
            message: parsedData.message || 'Nessun bando trovato per i criteri specificati.',
            suggestions: parsedData.suggestions || [],
            alternative_searches: parsedData.alternative_searches || []
          },
          searchInfo: {
            total_found: 0,
            search_time: parsedData.search_time || 0,
            search_date: parsedData.search_date,
            query_used: parsedData.query_used
          }
        };
      }
      
      // Caso 3: Formato non riconosciuto
      throw new Error('Formato risposta non riconosciuto');
      
    } catch (e) {
      console.log('Errore nel parsing:', e);
      return {
        success: false,
        type: 'error',
        error: e instanceof Error ? e.message : 'Errore sconosciuto'
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      console.log('Sending request to webhook:', currentInput);
      
      const params = new URLSearchParams({
        message: currentInput,
        timestamp: new Date().toISOString(),
        user_id: 'user_' + Date.now()
      });
      
      const response = await fetch(`https://fiscalot.duckdns.org/webhook/2f381203-47e1-4fd6-8221-438bad7fee08?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      let aiResponse = '';
      let grantResults: GrantResult[] = [];
      let searchInfo = undefined;
      let errorInfo = undefined;
      
      if (response.ok) {
        const responseText = await response.text();
        console.log('Raw webhook response:', responseText);
        
        const parseResult = parseGrantsFromResponse(responseText);
        
        if (parseResult.success) {
          if (parseResult.type === 'results') {
            // Caso con risultati
            grantResults = parseResult.grantResults || [];
            searchInfo = parseResult.searchInfo;
            aiResponse = `Ho trovato ${searchInfo?.total_found || grantResults.length} bandi per te! Ecco i risultati più rilevanti:`;
            console.log('Successfully extracted grant results:', grantResults.length);
          } else if (parseResult.type === 'no_results') {
            // Caso senza risultati
            errorInfo = parseResult.errorInfo;
            searchInfo = parseResult.searchInfo;
            aiResponse = parseResult.errorInfo?.message || 'Nessun bando trovato per i criteri specificati.';
            console.log('No results found, showing suggestions');
          }
        } else {
          // Errore nel parsing, mostra la risposta completa
          aiResponse = responseText;
          console.log('Parsing failed, showing full response');
        }
        
      } else {
        console.error('Webhook error:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        
        aiResponse = 'Mi dispiace, si è verificato un errore nella comunicazione. Il servizio potrebbe non essere configurato correttamente.';
        
        toast({
          title: "Errore di comunicazione",
          description: "Il webhook non risponde correttamente. Controlla la configurazione del servizio.",
          variant: "destructive",
        });
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
        grantResults: grantResults.length > 0 ? grantResults : undefined,
        searchInfo,
        errorInfo
      };

      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Error calling webhook:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Si è verificato un errore di connessione. Verifica che il servizio sia attivo e raggiungibile.',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Errore di rete",
        description: "Impossibile connettersi al servizio. Controlla la connessione e la configurazione del webhook.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <div className="flex flex-col h-[700px] max-w-6xl mx-auto">
      <Card className="flex-1 flex flex-col shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-brand-navy to-brand-emerald text-white">
          <CardTitle className="flex items-center">
            <Bot className="w-6 h-6 mr-2" />
            Assistente IA per Bandi
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className="space-y-4">
                  <div
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-lg ${
                        message.isUser
                          ? 'bg-brand-navy text-white ml-4'
                          : 'bg-gray-100 text-gray-800 mr-4'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {!message.isUser && (
                          <MessageSquare className="w-4 h-4 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {message.text}
                          </div>
                          {message.searchInfo && (
                            <div className="flex items-center space-x-4 mt-3 text-xs opacity-80">
                              <div className="flex items-center">
                                <Search className="w-3 h-3 mr-1" />
                                <span>{message.searchInfo.total_found} risultati</span>
                              </div>
                              <span>Tempo: {message.searchInfo.search_time.toFixed(1)}s</span>
                              {message.searchInfo.search_date && (
                                <span>Data: {message.searchInfo.search_date}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString('it-IT', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {/* Visualizza i risultati dei bandi */}
                  {message.grantResults && message.grantResults.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                      {message.grantResults.map((grant, index) => (
                        <GrantResultCard
                          key={`${grant.title}-${index}`}
                          grant={grant}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Visualizza suggerimenti quando non ci sono risultati */}
                  {message.errorInfo && message.errorInfo.suggestions.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                      <div className="flex items-start space-x-3">
                        <Lightbulb className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-amber-800 mb-2">
                            Suggerimenti per migliorare la ricerca:
                          </h4>
                          <ul className="space-y-2">
                            {message.errorInfo.suggestions.map((suggestion, idx) => (
                              <li key={idx} className="text-sm text-amber-700">
                                <button
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="text-left hover:text-amber-900 hover:underline cursor-pointer"
                                >
                                  • {suggestion}
                                </button>
                              </li>
                            ))}
                          </ul>
                          
                          {message.errorInfo.alternative_searches && message.errorInfo.alternative_searches.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-amber-200">
                              <h5 className="text-xs font-medium text-amber-800 mb-2">
                                Ricerche alternative:
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {message.errorInfo.alternative_searches.map((altSearch, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleSuggestionClick(altSearch)}
                                    className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded hover:bg-amber-200 transition-colors"
                                  >
                                    {altSearch}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-4 rounded-lg mr-8">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Scrivi qui la tua richiesta... (es: 'Cerco bandi per startup innovative nel settore tech')"
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-brand-navy hover:bg-brand-navy/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;