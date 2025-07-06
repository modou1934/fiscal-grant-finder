
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageSquare, Bot, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import GrantResultCard from './GrantResultCard';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  grantResults?: GrantResult[];
  searchInfo?: {
    total_found: number;
    search_time: number;
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
  urgency_level: number;
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
  const [savedGrants, setSavedGrants] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSaveGrant = (grant: GrantResult) => {
    const grantId = grant.title + grant.entity; // Create a unique ID
    setSavedGrants(prev => 
      prev.includes(grantId) 
        ? prev.filter(id => id !== grantId)
        : [...prev, grantId]
    );
    
    toast({
      title: prev.includes(grantId) ? "Bando rimosso" : "Bando salvato",
      description: prev.includes(grantId) 
        ? "Il bando è stato rimosso dai salvati" 
        : "Il bando è stato aggiunto ai salvati",
    });
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
      
      if (response.ok) {
        const data = await response.json();
        console.log('Webhook response:', data);
        
        // Controlla se la risposta contiene risultati di bandi
        if (data.success && data.results && Array.isArray(data.results)) {
          grantResults = data.results;
          searchInfo = {
            total_found: data.total_found || data.results.length,
            search_time: data.search_time || 0
          };
          
          aiResponse = `Ho trovato ${data.total_found || data.results.length} bandi per te! Ecco i risultati più rilevanti:`;
        } else {
          // Risposta testuale normale
          aiResponse = data.response || data.message || data.reply || data.answer || 'Ho ricevuto la tua richiesta e sto elaborando una risposta.';
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
        searchInfo
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

  return (
    <div className="flex flex-col h-[600px] max-w-6xl mx-auto">
      <Card className="flex-1 flex flex-col shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-brand-navy to-brand-emerald text-white">
          <CardTitle className="flex items-center">
            <Bot className="w-6 h-6 mr-2" />
            Assistente IA per Bandi
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="space-y-4">
                  <div
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
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
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                          {message.searchInfo && (
                            <div className="flex items-center space-x-4 mt-2 text-xs opacity-80">
                              <div className="flex items-center">
                                <Search className="w-3 h-3 mr-1" />
                                <span>{message.searchInfo.total_found} risultati</span>
                              </div>
                              <span>Tempo: {message.searchInfo.search_time.toFixed(1)}s</span>
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
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      {message.grantResults.map((grant, index) => (
                        <GrantResultCard
                          key={`${grant.title}-${index}`}
                          grant={grant}
                          onSave={handleSaveGrant}
                          isSaved={savedGrants.includes(grant.title + grant.entity)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg mr-8">
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
