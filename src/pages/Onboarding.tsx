import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, Building, MapPin, Users, Target } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  
  const [formData, setFormData] = useState({
    companyName: '',
    sector: '',
    companySize: '',
    region: '',
    interests: [] as string[],
  });

  const sectors = [
    'Tecnologia e Innovazione',
    'Manifatturiero',
    'Agricoltura',
    'Turismo',
    'Servizi',
    'Commercio',
    'Sanità',
    'Educazione',
    'Energia e Ambiente',
    'Altro'
  ];

  const companySizes = [
    'Freelance/Libero Professionista',
    'Micro impresa (1-9 dipendenti)',
    'Piccola impresa (10-49 dipendenti)',
    'Media impresa (50-249 dipendenti)',
    'Grande impresa (250+ dipendenti)'
  ];

  const regions = [
    'Abruzzo', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna',
    'Friuli-Venezia Giulia', 'Lazio', 'Liguria', 'Lombardia', 'Marche',
    'Molise', 'Piemonte', 'Puglia', 'Sardegna', 'Sicilia', 'Toscana',
    'Trentino-Alto Adige', 'Umbria', 'Valle d\'Aosta', 'Veneto'
  ];

  const interestOptions = [
    'Ricerca e Sviluppo',
    'Digitalizzazione',
    'Sostenibilità Ambientale',
    'Formazione',
    'Internazionalizzazione',
    'Startup e PMI Innovative',
    'Infrastrutture',
    'Cultura e Turismo'
  ];

  // Check if user already has a profile
  useEffect(() => {
    const checkExistingProfile = async () => {
      if (!user?.id) {
        setCheckingProfile(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (data) {
          // User already has a profile, redirect to dashboard
          navigate('/dashboard');
          return;
        }

        if (error && error.code !== 'PGRST116') {
          // PGRST116 is "not found" error, which is expected for new users
          console.error('Error checking profile:', error);
        }
      } catch (error) {
        console.error('Error checking existing profile:', error);
      } finally {
        setCheckingProfile(false);
      }
    };

    checkExistingProfile();
  }, [user?.id, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInterestToggle = (interest: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }));
  };

  const handleNext = () => {
    if (currentStep === 1 && (!formData.companyName || !formData.sector)) {
      toast.error('Compila tutti i campi obbligatori');
      return;
    }
    if (currentStep === 2 && (!formData.companySize || !formData.region)) {
      toast.error('Compila tutti i campi obbligatori');
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleComplete = async () => {
    if (formData.interests.length === 0) {
      toast.error('Seleziona almeno un\'area di interesse');
      return;
    }

    if (!user?.id) {
      toast.error('Errore di autenticazione. Riprova.');
      return;
    }

    setLoading(true);
    try {
      // Use upsert to handle potential duplicates gracefully
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          company_name: formData.companyName,
          sector: formData.sector,
          company_size: formData.companySize,
          region: formData.region,
          interests: formData.interests,
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      toast.success('Profilo completato con successo!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Errore nel salvare il profilo. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking for existing profile
  if (checkingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy mx-auto mb-4"></div>
          <p className="text-brand-navy">Caricamento...</p>
        </div>
      </div>
    );
  }

  const renderStep1 = () => (
    <Card className="shadow-xl border-0">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-brand-navy to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl text-brand-navy">Parlaci della tua azienda</CardTitle>
        <CardDescription>
          Queste informazioni ci aiuteranno a personalizzare i risultati di ricerca
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="companyName" className="text-brand-navy font-medium">
            Nome dell'azienda *
          </Label>
          <Input
            id="companyName"
            placeholder="Es. TechStart Italia S.r.l."
            value={formData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="sector" className="text-brand-navy font-medium">
            Settore di attività *
          </Label>
          <Select onValueChange={(value) => handleInputChange('sector', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Seleziona il tuo settore" />
            </SelectTrigger>
            <SelectContent>
              {sectors.map(sector => (
                <SelectItem key={sector} value={sector}>{sector}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card className="shadow-xl border-0">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-brand-emerald to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl text-brand-navy">Dimensioni e localizzazione</CardTitle>
        <CardDescription>
          Aiutaci a trovare i bandi più adatti alla tua realtà aziendale
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="companySize" className="text-brand-navy font-medium">
            Dimensione dell'azienda *
          </Label>
          <Select onValueChange={(value) => handleInputChange('companySize', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Seleziona la dimensione" />
            </SelectTrigger>
            <SelectContent>
              {companySizes.map(size => (
                <SelectItem key={size} value={size}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="region" className="text-brand-navy font-medium">
            Regione principale di attività *
          </Label>
          <Select onValueChange={(value) => handleInputChange('region', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Seleziona la regione" />
            </SelectTrigger>
            <SelectContent>
              {regions.map(region => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card className="shadow-xl border-0">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-brand-gold to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl text-brand-navy">Aree di interesse</CardTitle>
        <CardDescription>
          Seleziona le tipologie di bandi che ti interessano maggiormente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interestOptions.map(interest => (
            <div key={interest} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
              <Checkbox
                id={interest}
                checked={formData.interests.includes(interest)}
                onCheckedChange={(checked) => handleInterestToggle(interest, checked as boolean)}
              />
              <Label 
                htmlFor={interest} 
                className="text-sm font-medium cursor-pointer flex-1"
              >
                {interest}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-blue-50">
      {/* Header */}
      <header className="w-full px-4 sm:px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-brand-navy to-brand-emerald rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="text-lg sm:text-xl font-bold text-brand-primary">Fiscalot AI</span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full px-4 sm:px-6 mb-8">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-brand-primary font-medium">Passo {currentStep} di 3</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-brand-primary to-brand-secondary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center px-4 sm:px-6 pb-12 min-h-[60vh]">
        <div className="w-full max-w-sm sm:max-w-lg">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 sm:mt-8 space-x-4">
            {currentStep > 1 && (
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white flex-1 sm:flex-none"
              >
                Indietro
              </Button>
            )}
            
            <div className={`${currentStep === 1 ? 'w-full' : 'flex-1 sm:flex-none ml-auto'}`}>
              {currentStep < 3 ? (
                <Button 
                  onClick={handleNext}
                  className="bg-brand-primary hover:bg-brand-primary/90 text-white w-full sm:w-auto px-6 sm:px-8"
                >
                  Avanti
                </Button>
              ) : (
                <Button 
                  onClick={handleComplete}
                  disabled={loading}
                  className="bg-brand-secondary hover:bg-brand-secondary/90 text-white w-full sm:w-auto px-6 sm:px-8"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Completamento...
                    </div>
                  ) : (
                    'Completa Setup'
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;