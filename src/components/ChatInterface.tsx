import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageSquare, Bot, Search, AlertCircle, Lightbulb, Sparkles, Clock, TrendingUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import GrantResultCard from './GrantResultCard';
import { Badge } from '@/components/ui/badge';

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
      text: 'Ciao! Sono il tuo assistente AI per la ricerca di bandi. Dimmi di che tipo di finanziamento hai bisogno e ti aiuterò a trovare i bandi più adatti alla tua azienda.',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedGrants, setSavedGrants] = useState<string[]>([]);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSaveGrant = (grant: GrantResult) => {
    const grantId = grant.title + grant.entity;
    setSavedGrants(prev => {
      const isAlreadySaved = prev.includes(grantId);
      const newSavedGrants = isAlreadySaved 
        ? prev.filter(id => id !== grantId)
        : [...prev, grantId];
      
      toast({
        title: isAlreadySaved ? "Bando rimosso" : "Bando salvato",
        description: isAlreadySaved 
          ? "Il bando è stato rimosso dai salvati" 
          : "Il bando è stato aggiunto ai salvati",
      });
      
      return newSavedGrants;
    });
  };

  const parseGrantsFromResponse = (responseText: string) => {
    try {
      console.log('Tentativo di parsing risposta:', responseText);
      
      let parsedData;
      
      try {
        parsedData = JSON.parse(responseText);
      } catch (e) {
        console.log('Parsing diretto fallito, tentativo con markdown:', e);
        
        const jsonMatches = responseText.match(/```json\s*\n?([\s\S]*?)\n?```/);
        if (jsonMatches && jsonMatches[1]) {
          parsedData = JSON.parse(jsonMatches[1]);
        } else {
          const jsonPattern = /\[?\{[\s\S]*"success"[\s\S]*\}\]?/;
          const jsonMatch = responseText.match(jsonPattern);
          if (jsonMatch) {
            parsedData = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('Nessun JSON valido trovato nella risposta');
          }
        }
      }
      
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        parsedData = parsedData[0];
      }
      
      console.log('Dati parsati:', parsedData);
      
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
      
      const response = await fetch(`https://fiscalot.duckdns.org/webhook-test/2f381203-47e1-4fd6-8221-438bad7fee08?${params}`, {
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
            grantResults = parseResult.grantResults || [];
            searchInfo = parseResult.searchInfo;
            aiResponse = `Ho trovato ${searchInfo?.total_found || grantResults.length} bandi per te! Ecco i risultati più rilevanti:`;
            console.log('Successfully extracted grant results:', grantResults.length);
          } else if (parseResult.type === 'no_results') {
            errorInfo = parseResult.errorInfo;
            searchInfo = parseResult.searchInfo;
            aiResponse = parseResult.errorInfo?.message || 'Nessun bando trovato per i criteri specificati.';
            console.log('No results found, showing suggestions');
          }
        } else {
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
      inputRef.current?.focus();
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
    inputRef.current?.focus();
  };

  const quickPrompts = [
    "Cerco bandi per startup innovative nel settore tech",
    "Finanziamenti per PMI manifatturiere in Lombardia",
    "Bandi europei per ricerca e sviluppo",
    "Contributi per digitalizzazione aziendale"
  ];

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto bg-background">
      {/* App Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-primary to-accent text-primary-foreground p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">GrantFinder AI</h1>
              <p className="text-sm opacity-90">Assistente per Bandi di Finanziamento</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Bot className="w-3 h-3 mr-1" />
              Online
            </Badge>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Welcome Message with Quick Prompts */}
            {messages.length === 1 && (
              <div className="mb-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Benvenuto in GrantFinder AI</h2>
                  <p className="text-muted-foreground">Trova i bandi di finanziamento perfetti per la tua azienda</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-3 mb-6">
                  {quickPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-4 text-left justify-start hover:bg-accent/50 transition-colors"
                      onClick={() => handleSuggestionClick(prompt)}
                    >
                      <Search className="w-4 h-4 mr-3 flex-shrink-0 text-primary" />
                      <span className="text-sm">{prompt}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className="space-y-4">
                <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] ${message.isUser ? 'ml-12' : 'mr-12'}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.isUser
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {!message.isUser && (
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <Bot className="w-4 h-4 text-primary" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {message.text}
                          </div>
                          {message.searchInfo && (
                            <div className="flex items-center space-x-4 mt-3 text-xs opacity-80">
                              <div className="flex items-center">
                                <Search className="w-3 h-3 mr-1" />
                                <span>{message.searchInfo.total_found} risultati</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                <span>{message.searchInfo.search_time.toFixed(1)}s</span>
                              </div>
                              {message.searchInfo.search_date && (
                                <span>{message.searchInfo.search_date}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs opacity-60 mt-2 text-right">
                        {message.timestamp.toLocaleTimeString('it-IT', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Grant Results Cards */}
                {message.grantResults && message.grantResults.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                        Bandi Trovati ({message.grantResults.length})
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        Ordinati per rilevanza
                      </Badge>
                    </div>
                    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
                      {message.grantResults.map((grant, index) => (
                        <GrantResultCard
                          key={`${grant.title}-${index}`}
                          grant={grant}
                          onSave={handleSaveGrant}
                          isSaved={savedGrants.includes(grant.title + grant.entity)}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* No Results with Suggestions */}
                {message.errorInfo && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 max-w-2xl">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-amber-800 mb-3">
                          Nessun risultato trovato
                        </h4>
                        <p className="text-amber-700 mb-4 leading-relaxed">
                          {message.errorInfo.message}
                        </p>
                        
                        {message.errorInfo.suggestions.length > 0 && (
                          <div className="space-y-4">
                            <div className="flex items-center text-amber-800">
                              <Lightbulb className="w-4 h-4 mr-2" />
                              <span className="font-medium">Suggerimenti per migliorare la ricerca:</span>
                            </div>
                            <div className="space-y-2">
                              {message.errorInfo.suggestions.map((suggestion, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="block w-full text-left p-3 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors text-amber-800 text-sm"
                                >
                                  • {suggestion}
                                </button>
                              ))}
                            </div>
                            
                            {message.errorInfo.alternative_searches && message.errorInfo.alternative_searches.length > 0 && (
                              <div className="pt-4 border-t border-amber-200">
                                <p className="text-sm font-medium text-amber-800 mb-3">
                                  Ricerche alternative:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {message.errorInfo.alternative_searches.map((altSearch, idx) => (
                                    <button
                                      key={idx}
                                      onClick={() => handleSuggestionClick(altSearch)}
                                      className="text-xs bg-amber-200 text-amber-800 px-3 py-2 rounded-full hover:bg-amber-300 transition-colors"
                                    >
                                      {altSearch}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl px-4 py-3 mr-12 max-w-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 ml-11">
                    Sto cercando i bandi per te...
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {/* Input Area */}
        <div className="flex-shrink-0 border-t bg-background/95 backdrop-blur-sm p-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Scrivi qui la tua richiesta... (es: 'Cerco bandi per startup innovative nel settore tech')"
                  className="pr-12 py-3 text-base rounded-xl border-2 focus:border-primary transition-colors"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  <MessageSquare className="w-4 h-4" />
                </div>
              </div>
              <Button 
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 transition-colors"
                size="icon"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <div className="text-xs text-muted-foreground mt-2 text-center">
              Premi Invio per inviare • L'AI analizzerà la tua richiesta e troverà i bandi più adatti
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;