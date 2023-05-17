import type { Dispatch, SetStateAction } from 'react';
import React from 'react';

interface LookingContextType {
  looking: boolean;
  lookForRides: Dispatch<SetStateAction<boolean>>;
}

export const LookingContext = React.createContext<LookingContextType | null>(
  null
);
