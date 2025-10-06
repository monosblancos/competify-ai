import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

export default function AdminImportPage() {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImporting(true);
      setProgress(10);
      
      // Leer archivo Excel
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      setProgress(30);

      // Transformar datos al formato esperado
      const standards = jsonData.map((row: any) => ({
        code: row['Código'] || row.code,
        title: row['Título'] || row.title || row.Titulo,
        nivel: row['Nivel'] || row.nivel,
        comite: row['Comité'] || row.comite || row.Comite,
        sector: row['Sector Productivo'] || row.sector || 'OTROS SERVICIOS'
      }));

      console.log(`📊 Procesados ${standards.length} estándares del Excel`);
      setProgress(50);

      // Llamar al edge function
      const { data: importResult, error } = await supabase.functions.invoke('bulk-import-standards', {
        body: { 
          standards,
          clearExisting: true // Limpia la tabla antes de importar
        }
      });

      setProgress(90);

      if (error) {
        console.error('Error importando:', error);
        toast({
          title: "Error en importación",
          description: error.message,
          variant: "destructive"
        });
        setResult({ success: false, error: error.message });
      } else {
        console.log('✅ Importación exitosa:', importResult);
        setResult(importResult);
        toast({
          title: "¡Importación exitosa!",
          description: `Se importaron ${importResult.imported} de ${importResult.total} estándares`,
        });
      }

      setProgress(100);
    } catch (error) {
      console.error('Error procesando archivo:', error);
      toast({
        title: "Error procesando archivo",
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: "destructive"
      });
      setResult({ success: false, error: 'Error procesando Excel' });
    } finally {
      setImporting(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Importación Masiva RENEC
          </h1>
          <p className="text-muted-foreground mt-2">
            Carga todos los estándares de competencia desde el archivo Excel oficial
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" />
              Subir Archivo Excel
            </CardTitle>
            <CardDescription>
              Selecciona el archivo renec.xlsx con los 1,845 estándares de CONOCER
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center hover:border-primary/40 transition-colors">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                disabled={importing}
                className="hidden"
                id="excel-upload"
              />
              <label 
                htmlFor="excel-upload" 
                className="cursor-pointer flex flex-col items-center gap-4"
              >
                {importing ? (
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                ) : (
                  <Upload className="w-12 h-12 text-primary" />
                )}
                <div>
                  <p className="font-medium">
                    {importing ? 'Importando...' : 'Click para seleccionar archivo'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Formatos: .xlsx, .xls
                  </p>
                </div>
              </label>
            </div>

            {progress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso de importación</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {result && (
              <Alert variant={result.success ? "default" : "destructive"}>
                {result.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription className="ml-2">
                  {result.success ? (
                    <div className="space-y-2">
                      <p className="font-medium">✅ Importación completada</p>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• Importados: {result.imported}</li>
                        <li>• Errores: {result.errors}</li>
                        <li>• Total: {result.total}</li>
                      </ul>
                      {result.imported > 0 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          🔮 Generando embeddings vectoriales en background...
                        </p>
                      )}
                    </div>
                  ) : (
                    <p>❌ Error: {result.error}</p>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📋 Instrucciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">1</span>
              </div>
              <p>Asegúrate de tener el archivo <code className="bg-muted px-1.5 py-0.5 rounded">renec.xlsx</code> con las columnas: Código, Nivel, Título, Comité, Sector Productivo</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">2</span>
              </div>
              <p>Sube el archivo usando el botón de arriba. La importación eliminará datos existentes.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">3</span>
              </div>
              <p>El sistema procesará automáticamente los estándares en lotes de 100.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">4</span>
              </div>
              <p>Al finalizar, se generarán los embeddings vectoriales automáticamente para búsquedas precisas.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
