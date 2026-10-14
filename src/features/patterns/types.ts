import type { Database } from '@/types/database';

export type PatternRow = Database['public']['Tables']['patterns']['Row'];
export type PatternInsert = Database['public']['Tables']['patterns']['Insert'];
export type PatternUpdate = Database['public']['Tables']['patterns']['Update'];

export interface PatternWithRelations extends PatternRow {
  tags?: {
    id: string;
    name: string;
    color: string;
  }[];
  problems?: {
    id: string;
    title: string;
    platform: string;
    difficulty_rating: number | null;
  }[];
}

export interface PatternFilters {
  search?: string;
  category?: string;
  minConfidence?: number;
  tagId?: string;
}
