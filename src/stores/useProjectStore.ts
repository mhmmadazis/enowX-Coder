import { create } from 'zustand';
import { Project } from '@/types';

interface ProjectState {
  projects: Project[];
  activeProjectId: string | null;
  setProjects: (projects: Project[]) => void;
  setActiveProjectId: (id: string | null) => void;
  addProject: (project: Project) => void;
  removeProject: (id: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  activeProjectId: null,
  setProjects: (projects) => set({ projects }),
  setActiveProjectId: (id) => set({ activeProjectId: id }),
  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
  removeProject: (id) => set((state) => ({ 
    projects: state.projects.filter((p) => p.id !== id),
    activeProjectId: state.activeProjectId === id ? null : state.activeProjectId
  })),
}));
