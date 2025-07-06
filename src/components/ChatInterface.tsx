
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageSquare, Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
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
      
      // Proviamo prima con GET e parametri URL
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
      
      if (response.ok) {
        const data = await response.json();
        console.log('Webhook response:', data);
        
        // Adatta la risposta in base alla struttura che ricevi dal webhook
        aiResponse = data.response || data.message || data.reply || data.answer || 'Ho ricevuto la tua richiesta e sto elaborando una risposta.';
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
        timestamp: new Date()
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
    <div className="flex flex-col h-[600px] max-w-4xl mx-auto">
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
                <div
                  key={message.id}
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
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    </div>
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString('it-IT', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
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
