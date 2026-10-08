import React from 'react';
import { Navbar } from './layout/Navbar';

interface HeaderProps {
  onNewDecision: () => void;
  onOpenRules: () => void;
  onOpenHistory: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  status: string;
}

export const Header: React.FC<HeaderProps> = (props) => {
  return <Navbar {...props} />;
};
