
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Search, Target, Bell, CheckCircle, Star, ArrowRight, Users, TrendingUp } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-brand-navy to-brand-emerald rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-brand-navy">GrantFinder</span>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/auth')}
            className="border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white"
          >
            Accedi
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-brand-gold/10 text-brand-gold border-brand-gold/20">
            🚀 La rivoluzione nella ricerca dei bandi
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Trova i <span className="gradient-text">bandi perfetti</span> per la tua azienda
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Intelligenza artificiale avanzata per scoprire opportunità di finanziamento 
            personalizzate in base al tuo settore e alle tue esigenze specifiche.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-brand-navy hover:bg-brand-navy/90 text-white px-8 py-4 text-lg font-semibold hover-lift"
            >
              Inizia Gratuitamente
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-brand-emerald text-brand-emerald hover:bg-brand-emerald hover:text-white px-8 py-4 text-lg"
            >
              Scopri come funziona
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-brand-navy" />
              <span className="text-sm font-medium">5000+ Imprenditori</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-brand-emerald" />
              <span className="text-sm font-medium">€50M+ Ottenuti</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-brand-gold" />
              <span className="text-sm font-medium">4.9/5 Valutazione</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-brand-navy">
            Come funziona in 3 semplici step
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Il nostro sistema AI analizza migliaia di bandi per trovare quelli più adatti alla tua azienda
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="hover-lift border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-brand-navy to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-brand-navy">1. Profila la tua azienda</h3>
              <p className="text-gray-600 leading-relaxed">
                Inserisci informazioni su settore, dimensioni e obiettivi per personalizzare la ricerca
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-brand-emerald to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-brand-navy">2. Ricerca intelligente</h3>
              <p className="text-gray-600 leading-relaxed">
                La nostra AI analizza automaticamente bandi nazionali, regionali e europei
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-brand-gold to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-brand-navy">3. Ricevi notifiche</h3>
              <p className="text-gray-600 leading-relaxed">
                Ottieni alerti personalizzati sui nuovi bandi e promemoria per le scadenze
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-brand-navy">
              Tutto quello che ti serve per vincere
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Strumenti professionali per massimizzare le tue possibilità di ottenere finanziamenti
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <Search className="w-6 h-6" />,
                title: "Ricerca Avanzata",
                description: "Filtri personalizzabili per settore, regione, importo e tipologia di bando"
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: "Matching Intelligente",
                description: "AI che calcola la compatibilità tra la tua azienda e ogni bando"
              },
              {
                icon: <Bell className="w-6 h-6" />,
                title: "Alert Personalizzati",
                description: "Notifiche immediate sui nuovi bandi e promemoria scadenze"
              },
              {
                icon: <CheckCircle className="w-6 h-6" />,
                title: "Tracciamento Domande",
                description: "Monitora lo stato delle tue candidature in un unico dashboard"
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "Analytics Avanzate",
                description: "Statistiche dettagliate per ottimizzare la tua strategia"
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Supporto Esperto",
                description: "Consulenza specializzata per migliorare le tue candidature"
              }
            ].map((feature, index) => (
              <Card key={index} className="hover-lift border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-brand-navy/10 rounded-lg flex items-center justify-center mb-4 text-brand-navy">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-brand-navy">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-brand-navy">
            Cosa dicono i nostri clienti
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Storie di successo di imprenditori che hanno ottenuto finanziamenti grazie a GrantFinder
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              name: "Marco Rossi",
              role: "CEO, TechStart",
              content: "Grazie a GrantFinder abbiamo ottenuto 250.000€ per il nostro progetto di innovazione. Il sistema ha trovato bandi che non avremmo mai scoperto da soli.",
              rating: 5
            },
            {
              name: "Laura Bianchi",
              role: "Founder, EcoSolutions",
              content: "L'AI di GrantFinder è incredibile. In poche settimane abbiamo identificato 15 bandi compatibili con la nostra startup green.",
              rating: 5
            },
            {
              name: "Giuseppe Verdi",
              role: "Direttore, ManufactureNext",
              content: "Il ROI è stato straordinario. Con un investimento minimo abbiamo accesso a un database di opportunità che vale milioni.",
              rating: 5
            }
          ].map((testimonial, index) => (
            <Card key={index} className="hover-lift border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-brand-gold fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-brand-navy">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-r from-brand-navy via-blue-700 to-brand-emerald py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Pronto a trovare il tuo prossimo finanziamento?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Unisciti a migliaia di imprenditori che stanno trasformando le loro idee in realtà
          </p>
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="bg-white text-brand-navy hover:bg-gray-100 px-8 py-4 text-lg font-semibold hover-lift"
          >
            Inizia la tua ricerca ora
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-dark text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-brand-navy to-brand-emerald rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">GrantFinder</span>
              </div>
              <p className="text-gray-400 text-sm">
                La piattaforma AI per la ricerca intelligente di bandi e finanziamenti pubblici.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Prodotto</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Ricerca Bandi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Supporto</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Centro Assistenza</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contatti</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Webinar</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Azienda</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Chi Siamo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carriere</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termini</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 GrantFinder. Tutti i diritti riservati.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
