import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';

import type { Ride } from '@/models/roadrunner/Ride';

interface RideHistoryContextValue {
  rideHistory: Ride[];
  setRideHistory: Dispatch<SetStateAction<Ride[]>>;
}

const RideHistoryContext = createContext<RideHistoryContextValue | null>(null);

export default RideHistoryContext;
