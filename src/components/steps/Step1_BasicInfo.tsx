import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ProfileData } from '../ProfileSetupWizard';

interface Step1Props {
  data: ProfileData;
  onNext: (stepData: Partial<ProfileData>) => void;
  updateData: (newData: Partial<ProfileData>) => void;
}

const Step1_BasicInfo: React.FC<Step1Props> = ({ data, onNext, updateData }) => {
  const [formData, setFormData] = useState({
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    educationLevel: data.educationLevel,
  });
  const [cvFile, setCvFile] = useState<File | null>(data.cvFile);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setCvFile(file);
      updateData({ cvFile: file });
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
      'application/pdf': ['.pdf'], 
      'image/*': ['.jpeg', '.png', '.jpg'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    updateData({ [field]: value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }
    
    if (!formData.educationLevel) {
      newErrors.educationLevel = 'Selecciona tu nivel educativo';
    }
    
    if (!cvFile) {
      newErrors.cvFile = 'Sube tu CV para continuar';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        educationLevel: formData.educationLevel,
        cvFile
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Información Básica
        </h2>
        <p className="text-muted-foreground">
          Comencemos con tus datos personales y tu CV para crear un análisis personalizado
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre Completo *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Tu nombre completo"
              className={errors.fullName ? 'border-destructive' : ''}
            />
            {errors.fullName && (
              <p className="text-sm text-destructive">{errors.fullName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="tu@email.com"
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+52 55 1234 5678"
              className={errors.phone ? 'border-destructive' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="educationLevel">Nivel Educativo *</Label>
            <Select 
              value={formData.educationLevel} 
              onValueChange={(value) => handleInputChange('educationLevel', value)}
            >
              <SelectTrigger className={errors.educationLevel ? 'border-destructive' : ''}>
                <SelectValue placeholder="Selecciona tu nivel educativo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="secundaria">Secundaria</SelectItem>
                <SelectItem value="preparatoria">Preparatoria</SelectItem>
                <SelectItem value="tecnico">Técnico Superior</SelectItem>
                <SelectItem value="licenciatura">Licenciatura</SelectItem>
                <SelectItem value="maestria">Maestría</SelectItem>
                <SelectItem value="doctorado">Doctorado</SelectItem>
              </SelectContent>
            </Select>
            {errors.educationLevel && (
              <p className="text-sm text-destructive">{errors.educationLevel}</p>
            )}
          </div>
        </div>

        {/* CV Upload Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Sube tu CV *</Label>
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 
                errors.cvFile ? 'border-destructive' : 'border-border hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              {cvFile ? (
                <div>
                  {filePreview ? (
                    <img src={filePreview} alt="Preview" className="max-h-32 mx-auto mb-4 rounded" />
                  ) : (
                    <svg className="mx-auto h-12 w-12 text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                  <p className="text-sm font-medium text-foreground">{cvFile.name}</p>
                  <p className="text-xs text-muted-foreground">Haz clic para cambiar</p>
                </div>
              ) : (
                <>
                  <svg className="mx-auto h-12 w-12 text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm font-medium text-foreground">
                    Arrastra tu CV aquí o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    PDF, DOC, DOCX o imágenes (JPG, PNG)
                  </p>
                </>
              )}
            </div>
            {errors.cvFile && (
              <p className="text-sm text-destructive">{errors.cvFile}</p>
            )}
          </div>

          {/* AI Preview Card */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground">Vista Previa IA</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Una vez que subas tu CV, nuestro análisis de IA identificará:
            </p>
            <ul className="text-xs text-muted-foreground mt-2 space-y-1">
              <li>• Fortalezas profesionales clave</li>
              <li>• Áreas de oportunidad</li>
              <li>• Estándares de certificación recomendados</li>
              <li>• Plan de carrera personalizado</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button
          onClick={handleNext}
          className="btn-primary px-8"
        >
          Siguiente
          <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Step1_BasicInfo;