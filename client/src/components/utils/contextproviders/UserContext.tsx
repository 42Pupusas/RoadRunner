import React from 'react';

import type { User } from '@/models/roadrunner/User';

interface UserContextType {
  user: User | null;
  login: (privatekey: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const UserContext = React.createContext<UserContextType | null>(null);
