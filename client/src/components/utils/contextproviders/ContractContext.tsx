import type { Dispatch, SetStateAction } from 'react';
import React from 'react';

import type { Contract } from '@/models/roadrunner/Contract';

interface ContractContextType {
  contract: Contract | null;
  setContract: Dispatch<SetStateAction<Contract | null>>;
}

export const ContractContext = React.createContext<ContractContextType | null>(
  null
);
