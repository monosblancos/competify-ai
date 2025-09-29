import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Building2, Users, Target, ArrowRight, CheckCircle2 } from 'lucide-react';

export interface CompanyProfile {
  companyName: string;
  industry: string;
  companySize: string;
  primaryNeeds: string[];
  region: string;
  description: string;
  currentChallenges: string[];
}

interface CompanyProfileSetupProps {
  onProfileComplete: (profile: CompanyProfile) => void;
  className?: string;
}

const industries = [
  { id: 'tecnologia', name: 'Tecnología', icon: '💻', metrics: ['Desarrollo', 'Ciberseguridad', 'Análisis de Datos'] },
  { id: 'manufactura', name: 'Manufactura', icon: '🏭', metrics: ['Lean Manufacturing', 'Control de Calidad', 'Automatización'] },
  { id: 'servicios', name: 'Servicios', icon: '🏢', metrics: ['Atención al Cliente', 'Gestión de Procesos', 'Ventas'] },
  { id: 'educacion', name: 'Educación', icon: '🎓', metrics: ['Diseño Instruccional', 'Evaluación', 'Tutoría Digital'] },
  { id: 'salud', name: 'Salud', icon: '🏥', metrics: ['Atención Médica', 'Administración', 'Bioseguridad'] },
  { id: 'financiero', name: 'Financiero', icon: '🏦', metrics: ['Análisis Financiero', 'Cumplimiento', 'Tecnología Fin'] },
  { id: 'retail', name: 'Comercio/Retail', icon: '🛒', metrics: ['Ventas', 'Logística', 'Experiencia Cliente'] },
  { id: 'turismo', name: 'Turismo', icon: '✈️', metrics: ['Hospitalidad', 'Gestión Eventos', 'Atención Turística'] }
];

const companySizes = [
  { id: 'startup', name: 'Startup', range: '1-10 empleados', focus: 'Agilidad y crecimiento rápido' },
  { id: 'pequena', name: 'Pequeña', range: '11-50 empleados', focus: 'Escalabilidad y procesos' },
  { id: 'mediana', name: 'Mediana', range: '51-250 empleados', focus: 'Optimización y especialización' },
  { id: 'grande', name: 'Grande', range: '251-1000 empleados', focus: 'Eficiencia y estandarización' },
  { id: 'corporativa', name: 'Corporativa', range: '1000+ empleados', focus: 'Transformación digital y compliance' }
];

const primaryNeeds = [
  'Certificación de personal existente',
  'Capacitación de nuevos empleados',
  'Cumplimiento regulatorio',
  'Mejora de procesos',
  'Transformación digital',
  'Expansión a nuevos mercados',
  'Reducción de costos operativos',
  'Mejora de productividad'
];

const currentChallenges = [
  'Escasez de talento calificado',
  'Alta rotación de personal',
  'Procesos operativos ineficientes',
  'Falta de estandarización',
  'Cumplimiento regulatorio',
  'Competencia del mercado',
  'Transformación tecnológica',
  'Gestión del cambio'
];

export const CompanyProfileSetup: React.FC<CompanyProfileSetupProps> = ({
  onProfileComplete,
  className
}) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<CompanyProfile>({
    companyName: '',
    industry: '',
    companySize: '',
    primaryNeeds: [],
    region: '',
    description: '',
    currentChallenges: []
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onProfileComplete(profile);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleArrayItem = (array: string[], item: string): string[] => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return profile.companyName && profile.region;
      case 2:
        return profile.industry && profile.companySize;
      case 3:
        return profile.primaryNeeds.length > 0;
      case 4:
        return profile.currentChallenges.length > 0;
      default:
        return false;
    }
  };

  const selectedIndustry = industries.find(ind => ind.id === profile.industry);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((stepNum) => (
          <div key={stepNum} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${step >= stepNum ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
            `}>
              {step > stepNum ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
            </div>
            {stepNum < 4 && (
              <div className={`h-1 w-16 mx-2 ${step > stepNum ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Información Básica */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Información de la Empresa
            </CardTitle>
            <CardDescription>
              Cuéntanos sobre tu organización para personalizar tu experiencia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="companyName">Nombre de la Empresa</Label>
              <Input
                id="companyName"
                placeholder="Ej: Innovación Tecnológica S.A. de C.V."
                value={profile.companyName}
                onChange={(e) => setProfile({...profile, companyName: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="region">Región Principal de Operación</Label>
              <Select 
                value={profile.region} 
                onValueChange={(value) => setProfile({...profile, region: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una región" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cdmx">Ciudad de México</SelectItem>
                  <SelectItem value="monterrey">Monterrey</SelectItem>
                  <SelectItem value="guadalajara">Guadalajara</SelectItem>
                  <SelectItem value="tijuana">Tijuana</SelectItem>
                  <SelectItem value="puebla">Puebla</SelectItem>
                  <SelectItem value="cancun">Cancún</SelectItem>
                  <SelectItem value="nacional">Nacional</SelectItem>
                  <SelectItem value="internacional">Internacional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Descripción Breve (Opcional)</Label>
              <Textarea
                id="description"
                placeholder="Describe brevemente tu empresa y su enfoque principal..."
                value={profile.description}
                onChange={(e) => setProfile({...profile, description: e.target.value})}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Industria y Tamaño */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Perfil Organizacional
            </CardTitle>
            <CardDescription>
              Selecciona tu industria y tamaño para mostrar métricas relevantes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Industry Selection */}
            <div>
              <Label className="text-base font-medium mb-4 block">Industria Principal</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {industries.map((industry) => (
                  <Card 
                    key={industry.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      profile.industry === industry.id ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setProfile({...profile, industry: industry.id})}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">{industry.icon}</div>
                      <div className="font-medium text-sm">{industry.name}</div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {industry.metrics.slice(0, 2).join(', ')}...
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {selectedIndustry && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="font-medium mb-2">Competencias clave para {selectedIndustry.name}:</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedIndustry.metrics.map((metric) => (
                      <Badge key={metric} variant="secondary">{metric}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Company Size Selection */}
            <div>
              <Label className="text-base font-medium mb-4 block">Tamaño de la Empresa</Label>
              <RadioGroup 
                value={profile.companySize} 
                onValueChange={(value) => setProfile({...profile, companySize: value})}
                className="space-y-4"
              >
                {companySizes.map((size) => (
                  <div key={size.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value={size.id} id={size.id} className="mt-1" />
                    <div className="space-y-1 flex-1">
                      <Label htmlFor={size.id} className="cursor-pointer font-medium">
                        {size.name}
                      </Label>
                      <div className="text-sm text-muted-foreground">{size.range}</div>
                      <div className="text-xs text-muted-foreground italic">{size.focus}</div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Necesidades Principales */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Necesidades Principales
            </CardTitle>
            <CardDescription>
              Selecciona las áreas donde necesitas mayor apoyo (máximo 4)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {primaryNeeds.map((need) => (
                <div
                  key={need}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    profile.primaryNeeds.includes(need) ? 'ring-2 ring-primary bg-primary/5' : ''
                  } ${
                    profile.primaryNeeds.length >= 4 && !profile.primaryNeeds.includes(need) 
                      ? 'opacity-50 cursor-not-allowed' 
                      : ''
                  }`}
                  onClick={() => {
                    if (profile.primaryNeeds.includes(need) || profile.primaryNeeds.length < 4) {
                      setProfile({
                        ...profile,
                        primaryNeeds: toggleArrayItem(profile.primaryNeeds, need)
                      });
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{need}</span>
                    {profile.primaryNeeds.includes(need) && (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Seleccionadas: {profile.primaryNeeds.length}/4
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Retos Actuales */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Retos Actuales
            </CardTitle>
            <CardDescription>
              ¿Cuáles son los principales desafíos que enfrenta tu organización?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentChallenges.map((challenge) => (
                <div
                  key={challenge}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    profile.currentChallenges.includes(challenge) ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => {
                    setProfile({
                      ...profile,
                      currentChallenges: toggleArrayItem(profile.currentChallenges, challenge)
                    });
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{challenge}</span>
                    {profile.currentChallenges.includes(challenge) && (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={step === 1}
        >
          Anterior
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!isStepValid()}
          className="flex items-center gap-2"
        >
          {step === 4 ? 'Completar Configuración' : 'Siguiente'}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};