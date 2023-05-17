import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';

interface OfferHistoryContextValue {
  offerHistory: {
    invoice: string;
    driver: string;
    contractId: string;
    htlc: string;
  }[];
  setOfferHistory: Dispatch<
    SetStateAction<
      { invoice: string; driver: string; contractId: string; htlc: string }[]
    >
  >;
}

const OfferHistoryContext = createContext<OfferHistoryContextValue | null>(
  null
);

export default OfferHistoryContext;
