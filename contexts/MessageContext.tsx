
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Message {
  id: string;
  type: 'SMS' | 'EMAIL';
  recipient: string;
  recipientName: string;
  subject?: string; // For Email
  content: string;
  status: 'Sent' | 'Failed' | 'Queued';
  timestamp: Date;
}

interface MessageContextType {
  messages: Message[];
  addMessage: (msg: Omit<Message, 'id' | 'timestamp' | 'status'>) => void;
  clearMessages: () => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (msg: Omit<Message, 'id' | 'timestamp' | 'status'>) => {
    const newMessage: Message = {
      ...msg,
      id: uuidv4(),
      timestamp: new Date(),
      status: 'Sent'
    };
    setMessages(prev => [newMessage, ...prev]);
  };

  const clearMessages = () => setMessages([]);

  return (
    <MessageContext.Provider value={{ messages, addMessage, clearMessages }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};
