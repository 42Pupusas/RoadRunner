import React from 'react';
import type { ReadyState, SendMessage } from 'react-use-websocket';

interface RelayContextType {
  sendMessage: SendMessage;
  lastMessage: MessageEvent<any> | null;
  readyState: ReadyState;
}

export const RelayContext = React.createContext<RelayContextType | null>(null);
