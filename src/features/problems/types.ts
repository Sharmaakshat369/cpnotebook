import type { Database, ProblemStatus, ProblemPlatform, AttemptVerdict } from '@/types/database';

export type ProblemRow = Database['public']['Tables']['problems']['Row'];
export type ProblemInsert = Database['public']['Tables']['problems']['Insert'];
export type ProblemUpdate = Database['public']['Tables']['problems']['Update'];

export type ProblemAttemptRow = Database['public']['Tables']['problem_attempts']['Row'];
export type ProblemAttemptInsert = Database['public']['Tables']['problem_attempts']['Insert'];

export interface ProblemWithRelations extends ProblemRow {
  attempts?: ProblemAttemptRow[];
  mistakes?: {
    id: string;
    title: string;
    category: string;
    severity: string;
  }[];
  patterns?: {
    id: string;
    title: string;
    category: string;
  }[];
  concepts?: {
    id: string;
    name: string;
    category: string;
  }[];
  tags?: {
    id: string;
    name: string;
    color: string;
  }[];
}

export interface ProblemFilters {
  search?: string;
  platform?: ProblemPlatform | 'all';
  status?: ProblemStatus | 'all';
  minRating?: number;
  maxRating?: number;
  difficultyLevel?: 'easy' | 'medium' | 'hard' | 'all';
  isStarred?: boolean;
  tagId?: string;
}

export { type ProblemStatus, type ProblemPlatform, type AttemptVerdict };
