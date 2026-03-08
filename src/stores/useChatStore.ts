import { create } from 'zustand';
import { Message } from '@/types';

interface ChatState {
  messages: Message[];
  streamingText: string;
  isStreaming: boolean;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  appendStreamToken: (token: string) => void;
  setStreaming: (isStreaming: boolean) => void;
  clearStreaming: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  streamingText: '',
  isStreaming: false,
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  appendStreamToken: (token) => set((state) => ({ streamingText: state.streamingText + token })),
  setStreaming: (isStreaming) => set({ isStreaming }),
  clearStreaming: () => set({ streamingText: '', isStreaming: false }),
}));
