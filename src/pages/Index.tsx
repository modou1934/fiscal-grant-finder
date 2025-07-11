import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Search, Target, Bell, CheckCircle, ArrowRight, Users, TrendingUp, Zap, Shield, Clock } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy via-blue-800 to-brand-emerald">
      {/* Mobile Header */}
      <header className="safe-area-top px-4 py-3">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="https://i.ibb.co/v4rvFdW/logo.png" 
              alt="Fiscalot AI" 
              className="w-10 h-10 rounded-xl"
            />
            <span className="text-xl font-bold text-white">Fiscalot AI</span>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/auth')}
            className="text-white hover:bg-white/10 border border-white/20 rounded-full px-4"
          >
            Accedi
          </Button>
        </nav>
      </header>

      {/* Hero Section - Mobile Optimized */}
      <section className="px-4 py-8 text-center">
        <div className="max-w-sm mx-auto">
          <Badge className="mb-4 bg-brand-gold/20 text-brand-gold border-brand-gold/30 backdrop-blur-sm">
            🚀 AI per i tuoi bandi
          </Badge>
          
          <h1 className="text-3xl font-bold mb-4 leading-tight text-white">
            Trova i <span className="text-brand-gold">bandi perfetti</span> per la tua azienda
          </h1>
          
          <p className="text-lg text-blue-100 mb-6 leading-relaxed">
            Intelligenza artificiale per scoprire opportunità di finanziamento personalizzate
          </p>
          
          <div className="space-y-3 mb-8">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="w-full bg-white text-brand-navy hover:bg-gray-100 font-semibold py-4 rounded-xl shadow-lg"
            >
              Inizia Gratuitamente
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

        </div>
      </section>

      {/* How it Works - Mobile Cards */}
      <section className="px-4 py-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-sm mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2 text-white">
              Come funziona
            </h2>
            <p className="text-blue-100">
              3 semplici step per trovare i tuoi bandi
            </p>
          </div>

          <div className="space-y-4">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-brand-navy rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">1. Profila la tua azienda</h3>
                    <p className="text-sm text-blue-100">
                      Inserisci settore, dimensioni e obiettivi
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-brand-emerald rounded-xl flex items-center justify-center flex-shrink-0">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">2. Ricerca intelligente</h3>
                    <p className="text-sm text-blue-100">
                      L'AI analizza bandi nazionali ed europei
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-brand-gold rounded-xl flex items-center justify-center flex-shrink-0">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">3. Ricevi notifiche</h3>
                    <p className="text-sm text-blue-100">
                      Alert personalizzati e promemoria scadenze
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features - Mobile Grid */}
      <section className="px-4 py-8">
        <div className="max-w-sm mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2 text-white">
              Tutto quello che ti serve
            </h2>
            <p className="text-blue-100">
              Strumenti professionali per vincere
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              {
                icon: <Search className="w-5 h-5" />,
                title: "Ricerca Avanzata",
                description: "Filtri personalizzabili"
              },
              {
                icon: <Target className="w-5 h-5" />,
                title: "Matching AI",
                description: "Compatibilità intelligente"
              },
              {
                icon: <Bell className="w-5 h-5" />,
                title: "Alert Smart",
                description: "Notifiche immediate"
              },
              {
                icon: <CheckCircle className="w-5 h-5" />,
                title: "Tracking",
                description: "Monitora candidature"
              },
              {
                icon: <TrendingUp className="w-5 h-5" />,
                title: "Analytics",
                description: "Statistiche dettagliate"
              },
              {
                icon: <Shield className="w-5 h-5" />,
                title: "Supporto",
                description: "Consulenza esperta"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-brand-navy/20 rounded-xl flex items-center justify-center mx-auto mb-2 text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-sm font-semibold mb-1 text-white">{feature.title}</h3>
                  <p className="text-xs text-blue-200">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final - Mobile */}
      <section className="px-4 py-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-sm mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Pronto per il tuo prossimo finanziamento?
          </h2>
          <p className="text-blue-100 mb-6">
            Unisciti a migliaia di imprenditori di successo
          </p>
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="w-full bg-white text-brand-navy hover:bg-gray-100 font-semibold py-4 rounded-xl shadow-lg"
          >
            Inizia ora gratuitamente
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer - Mobile Minimal */}
      <footer className="px-4 py-6 bg-black/20 backdrop-blur-sm safe-area-bottom">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="https://i.ibb.co/v4rvFdW/logo.png" 
              alt="Fiscalot AI" 
              className="w-8 h-8 rounded-lg"
            />
            <span className="text-lg font-bold text-white">Fiscalot AI</span>
          </div>
          <p className="text-center text-blue-200 text-sm mb-4">
            La piattaforma AI per bandi e finanziamenti
          </p>
          <div className="text-center">
            <p className="text-blue-300 text-xs">
              © 2024 GrantFinder. Tutti i diritti riservati.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;