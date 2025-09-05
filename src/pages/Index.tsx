import React from 'react';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-2xl mx-auto p-8">
        <div className="gradient-hero rounded-2xl p-12 mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            Certifica<span className="text-accent">Global</span>
          </h1>
          <p className="text-xl text-white/90 mb-6">
            Análisis Predictivo de Competencias
          </p>
          <p className="text-white/80 mb-8">
            Plataforma inteligente que analiza tu CV y recomienda las certificaciones exactas 
            que necesitas para destacar en el mercado laboral mexicano.
          </p>
          <div className="space-y-4">
            <a 
              href="/register" 
              className="btn-hero bg-white text-primary hover:bg-white/90 block"
            >
              Comenzar Ahora
            </a>
            <a 
              href="/login" 
              className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20 block"
            >
              Ya tengo cuenta
            </a>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="card-elegant p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Análisis AI</h3>
            <p className="text-muted-foreground text-sm">Analiza tu CV con inteligencia artificial</p>
          </div>
          
          <div className="card-elegant p-6">
            <div className="w-12 h-12 bg-success/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Certificaciones</h3>
            <p className="text-muted-foreground text-sm">Estándares reconocidos por CONOCER</p>
          </div>
          
          <div className="card-elegant p-6">
            <div className="w-12 h-12 bg-accent/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Oportunidades</h3>
            <p className="text-muted-foreground text-sm">Conecta con empleos específicos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
