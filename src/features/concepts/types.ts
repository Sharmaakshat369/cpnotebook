import type { Database, ConceptMastery } from '@/types/database';

export type ConceptRow = Database['public']['Tables']['concepts']['Row'];
export type ConceptInsert = Database['public']['Tables']['concepts']['Insert'];
export type ConceptUpdate = Database['public']['Tables']['concepts']['Update'];

export interface ConceptWithRelations extends ConceptRow {
  tags?: {
    id: string;
    name: string;
    color: string;
  }[];
  problemsCount?: number;
}

export interface ConceptFilters {
  search?: string;
  category?: string;
  masteryLevel?: ConceptMastery | 'all';
  tagId?: string;
}

export { type ConceptMastery };
