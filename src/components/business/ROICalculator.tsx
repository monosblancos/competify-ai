import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { Calculator, TrendingUp, Clock, DollarSign, Target, CheckCircle, Loader2 } from 'lucide-react';
import { ROICalculatorService, type ROICalculationRequest, type ROIResult } from '../../services/roiCalculatorService';
import { useToast } from '../ui/use-toast';

const availableCertifications = [
  { code: 'EC0076', title: 'Evaluación de competencias' },
  { code: 'EC0217.01', title: 'Impartición de cursos presenciales' },
  { code: 'EC0301', title: 'Diseño de cursos de formación' },
  { code: 'EC0366', title: 'Desarrollo de cursos en línea' },
  { code: 'EC0586', title: 'Consultoría en general' },
];

const sectors = [
  'Tecnología',
  'Educación y Formación',
  'Consultoría',
  'Manufactura',
  'Servicios',
  'Salud',
  'Finanzas'
];

const companySizes = [
  { value: 'small', label: 'Pequeña (1-50 empleados)' },
  { value: 'medium', label: 'Mediana (51-250 empleados)' },
  { value: 'large', label: 'Grande (251-1000 empleados)' },
  { value: 'enterprise', label: 'Empresa (1000+ empleados)' },
];

export const ROICalculator: React.FC = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<ROIResult | null>(null);
  const [formData, setFormData] = useState<ROICalculationRequest>({
    companySize: 'medium',
    sector: '',
    currentCertifications: [],
    desiredCertifications: [],
    employeeCount: 10,
    currentProductivity: 70,
  });
  const { toast } = useToast();

  const handleCertificationChange = (certCode: string, isDesired: boolean) => {
    if (isDesired) {
      setFormData(prev => ({
        ...prev,
        desiredCertifications: prev.desiredCertifications.includes(certCode)
          ? prev.desiredCertifications.filter(c => c !== certCode)
          : [...prev.desiredCertifications, certCode]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        currentCertifications: prev.currentCertifications.includes(certCode)
          ? prev.currentCertifications.filter(c => c !== certCode)
          : [...prev.currentCertifications, certCode]
      }));
    }
  };

  const handleCalculate = async () => {
    if (!formData.sector) {
      toast({
        title: "Campo requerido",
        description: "Por favor selecciona el sector de tu empresa.",
        variant: "destructive",
      });
      return;
    }

    if (formData.desiredCertifications.length === 0) {
      toast({
        title: "Certificaciones requeridas",
        description: "Por favor selecciona al menos una certificación deseada.",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);
    try {
      const roiResult = await ROICalculatorService.calculateROI(formData);
      setResult(roiResult);
      toast({
        title: "Cálculo completado",
        description: "Se ha generado tu análisis de ROI personalizado.",
      });
    } catch (error) {
      console.error('Error calculating ROI:', error);
      toast({
        title: "Error en el cálculo",
        description: "No se pudo calcular el ROI. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
          <Calculator className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Calculadora ROI Inteligente
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Calcula el retorno de inversión personalizado para tu empresa al certificar a tu equipo
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Información de tu Empresa
            </CardTitle>
            <CardDescription>
              Proporciona los datos básicos para calcular tu ROI personalizado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company Size */}
            <div className="space-y-2">
              <Label htmlFor="company-size">Tamaño de la empresa</Label>
              <Select 
                value={formData.companySize} 
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, companySize: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tamaño" />
                </SelectTrigger>
                <SelectContent>
                  {companySizes.map(size => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sector */}
            <div className="space-y-2">
              <Label htmlFor="sector">Sector de la empresa</Label>
              <Select 
                value={formData.sector} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, sector: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map(sector => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Employee Count */}
            <div className="space-y-2">
              <Label htmlFor="employee-count">Número de empleados a certificar</Label>
              <Input
                id="employee-count"
                type="number"
                min="1"
                value={formData.employeeCount}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  employeeCount: parseInt(e.target.value) || 1 
                }))}
              />
            </div>

            {/* Current Certifications */}
            <div className="space-y-3">
              <Label>Certificaciones actuales del equipo</Label>
              <div className="space-y-2">
                {availableCertifications.map(cert => (
                  <div key={cert.code} className="flex items-center space-x-2">
                    <Checkbox
                      id={`current-${cert.code}`}
                      checked={formData.currentCertifications.includes(cert.code)}
                      onCheckedChange={(checked) => 
                        handleCertificationChange(cert.code, false)
                      }
                    />
                    <Label htmlFor={`current-${cert.code}`} className="text-sm">
                      {cert.code} - {cert.title}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Desired Certifications */}
            <div className="space-y-3">
              <Label>Certificaciones deseadas</Label>
              <div className="space-y-2">
                {availableCertifications.map(cert => (
                  <div key={cert.code} className="flex items-center space-x-2">
                    <Checkbox
                      id={`desired-${cert.code}`}
                      checked={formData.desiredCertifications.includes(cert.code)}
                      onCheckedChange={(checked) => 
                        handleCertificationChange(cert.code, true)
                      }
                      disabled={formData.currentCertifications.includes(cert.code)}
                    />
                    <Label 
                      htmlFor={`desired-${cert.code}`} 
                      className={`text-sm ${
                        formData.currentCertifications.includes(cert.code) 
                          ? 'text-muted-foreground line-through' 
                          : ''
                      }`}
                    >
                      {cert.code} - {cert.title}
                    </Label>
                    {formData.currentCertifications.includes(cert.code) && (
                      <Badge variant="outline" className="text-xs">Ya certificado</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleCalculate} 
              className="w-full" 
              size="lg"
              disabled={isCalculating}
            >
              {isCalculating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Calcular ROI
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="space-y-6">
          {result ? (
            <>
              {/* Summary Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Resumen del ROI
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {ROICalculatorService.formatPercentage(result.summary.roiPercentage)}
                      </div>
                      <div className="text-sm text-muted-foreground">ROI Estimado</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {ROICalculatorService.formatPeriod(result.paybackPeriod)}
                      </div>
                      <div className="text-sm text-muted-foreground">Recuperación</div>
                    </div>
                  </div>
                  
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      {result.summary.recommendation}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Financial Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Detalle Financiero
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Inversión total:</span>
                      <span className="font-semibold">
                        {ROICalculatorService.formatCurrency(result.totalInvestment)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>• Certificaciones:</span>
                      <span>{ROICalculatorService.formatCurrency(result.certificationCosts)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>• Capacitación:</span>
                      <span>{ROICalculatorService.formatCurrency(result.trainingCosts)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span>Ahorro anual estimado:</span>
                      <span className="font-semibold text-green-600">
                        {ROICalculatorService.formatCurrency(result.annualSavings)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Beneficio neto (3 años):</span>
                      <span className="font-semibold text-primary">
                        {ROICalculatorService.formatCurrency(result.summary.netBenefit)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Aumento de productividad:</span>
                      <span className="font-semibold">
                        +{ROICalculatorService.formatPercentage(result.productivityIncrease)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Certification Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Desglose por Certificación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.certificationBreakdown.map((cert, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-semibold">{cert.code}</div>
                            <div className="text-sm text-muted-foreground">{cert.title}</div>
                          </div>
                          <Badge variant="outline">{cert.timeToComplete}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Costo: </span>
                            <span className="font-medium">
                              {ROICalculatorService.formatCurrency(cert.cost)}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Impacto: </span>
                            <span className="font-medium text-green-600">
                              +{ROICalculatorService.formatPercentage(cert.impact)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calculator className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Calculadora ROI Lista</h3>
                <p className="text-muted-foreground text-center">
                  Completa la información de tu empresa y haz clic en "Calcular ROI" 
                  para ver tu análisis personalizado.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};