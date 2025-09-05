import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="card-elegant p-8">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl font-bold text-primary">404</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Página no encontrada</h1>
          <p className="text-muted-foreground mb-8">La página que buscas no existe.</p>
          <Link to="/" className="btn-primary">Volver al Inicio</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
