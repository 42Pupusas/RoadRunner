import type { Dispatch, SetStateAction } from 'react';
import React from 'react';

import type { Ride } from '@/models/roadrunner/Ride';

interface RideContextType {
  ride: Ride | null;
  setRide: Dispatch<SetStateAction<Ride | null>>;
}

export const RideContext = React.createContext<RideContextType | null>(null);
