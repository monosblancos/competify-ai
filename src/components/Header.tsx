import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { useIsMobile } from '../hooks/use-mobile';
import { Logo } from './header/Logo';
import { DesktopNav } from './header/DesktopNav';
import { NavigationMenu } from './header/NavigationMenu';
import { MobileMenu } from './header/MobileMenu';

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClasses = scrolled
    ? "bg-background/95 backdrop-blur-md shadow-lg border-border/50"
    : "bg-background/80 backdrop-blur-sm border-transparent";

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 border-b ${headerClasses}`}>
      {/* Main Navigation */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logo />
          <DesktopNav />
          
          {/* Mobile Menu Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-analytics="nav_mobile_toggle"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>

      {/* Desktop Navigation Menu */}
      {!isMobile && <NavigationMenu />}

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
};

export default Header;