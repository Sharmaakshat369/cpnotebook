import type { Database, MistakeCategory, MistakeSeverity } from '@/types/database';

export type MistakeRow = Database['public']['Tables']['mistakes']['Row'];
export type MistakeInsert = Database['public']['Tables']['mistakes']['Insert'];
export type MistakeUpdate = Database['public']['Tables']['mistakes']['Update'];

export interface MistakeWithStats extends MistakeRow {
  tags?: {
    id: string;
    name: string;
    color: string;
  }[];
  associatedProblemsCount?: number;
}

export interface MistakeFilters {
  search?: string;
  category?: MistakeCategory | 'all';
  severity?: MistakeSeverity | 'all';
  tagId?: string;
}

export { type MistakeCategory, type MistakeSeverity };
