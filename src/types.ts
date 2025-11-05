import type { ElementsDefinition } from 'cytoscape';

export type ActiveWorkspaceTab = 'visualize' | 'reasoning' | 'jury';

export interface ProjectFile {
  name: string;
  path: string;
  content: string;
  extension: string;
  lines: number;
}

export interface ExtensionStat {
  extension: string;
  count: number;
}

export interface LineStat {
  path: string;
  lines: number;
}

export interface ProjectSummary {
  totalFiles: number;
  totalLines: number;
  extensionHistogram: ExtensionStat[];
  lastUploadedAt: string;
}

export interface ProcessedProject {
  files: ProjectFile[];
  summary: ProjectSummary;
  graphElements: ElementsDefinition;
  topFilesByLines: LineStat[];
}

export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
}
