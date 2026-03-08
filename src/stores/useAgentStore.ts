import { create } from 'zustand';
import { AgentRun } from '@/types';

interface AgentState {
  agentRuns: AgentRun[];
  addAgentRun: (run: AgentRun) => void;
  updateAgentRun: (id: string, updates: Partial<AgentRun>) => void;
  setAgentRuns: (runs: AgentRun[]) => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  agentRuns: [],
  addAgentRun: (run) => set((state) => ({ agentRuns: [run, ...state.agentRuns] })),
  updateAgentRun: (id, updates) => set((state) => ({
    agentRuns: state.agentRuns.map((r) => r.id === id ? { ...r, ...updates } : r)
  })),
  setAgentRuns: (runs) => set({ agentRuns: runs }),
}));
