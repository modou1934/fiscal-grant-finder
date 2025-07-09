
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  BookOpen,
  Target,
  BarChart3,
  ArrowRight,
  Clock,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalGrants: 45,
    savedGrants: 8,
    applicationsInProgress: 3,
    totalFunding: '€2.3M'
  });

  const recentActivity = [
    {
      id: 1,
      type: 'grant_found',
      title: 'Nuovo bando trovato: Horizon Europe 2024',
      description: 'Bando per ricerca e innovazione nel settore tecnologico',
      time: '2 ore fa',
      region: 'Europa',
      amount: '€500K - €2M'
    },
    {
      id: 2,
      type: 'deadline_approaching',
      title: 'Scadenza imminente: Startup Innovative',
      description: 'Il bando scade tra 7 giorni',
      time: '1 giorno fa',
      region: 'Lombardia',
      amount: '€50K - €200K'
    },
    {
      id: 3,
      type: 'recommendation',
      title: 'Bando raccomandato per il tuo profilo',
      description: 'PSR Lombardia - Giovani Imprenditori',
      time: '3 giorni fa',
      region: 'Lombardia',
      amount: '€25K - €100K'
    }
  ];

  const quickActions = [
    {
      title: 'Ricerca Avanzata',
      description: 'Trova bandi personalizzati',
      icon: Search,
      action: () => navigate('/search'),
      color: 'bg-primary'
    },
    {
      title: 'Bandi Salvati',
      description: 'Visualizza i tuoi preferiti',
      icon: BookOpen,
      action: () => navigate('/saved-grants'),
      color: 'bg-accent'
    },
    {
      title: 'Analisi Trend',
      description: 'Statistiche e previsioni',
      icon: BarChart3,
      action: () => {},
      color: 'bg-secondary'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="page-header">
        <h1 className="page-title">
          Benvenuto, {user?.user_metadata?.name || 'Utente'}
        </h1>
        <p className="page-description">
          Ecco una panoramica delle tue attività sui bandi di finanziamento
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bandi Totali</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGrants}</div>
            <p className="text-xs text-muted-foreground">
              +12% rispetto al mese scorso
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bandi Salvati</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.savedGrants}</div>
            <p className="text-xs text-muted-foreground">
              3 scadono questo mese
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Corso</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.applicationsInProgress}</div>
            <p className="text-xs text-muted-foreground">
              Candidature attive
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valore Totale</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFunding}</div>
            <p className="text-xs text-muted-foreground">
              Opportunità disponibili
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Azioni Rapide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start space-y-2 card-hover"
                onClick={action.action}
              >
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-2`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Attività Recenti
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30 card-hover">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{activity.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {activity.time}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 mr-1" />
                      {activity.region}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.amount}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
