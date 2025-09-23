import React from 'react';
import { Logo } from './Logo';
import { SearchBar } from './SearchBar';
import { UserMenu } from './UserMenu';
import { useIsMobile } from '../../hooks/use-mobile';

export const DesktopNav: React.FC = () => {
  const isMobile = useIsMobile();

  if (isMobile) return null;

  return (
    <div className="flex h-16 items-center justify-between">
      <Logo />
      <SearchBar />
      <div className="flex items-center gap-3">
        <UserMenu />
      </div>
    </div>
  );
};