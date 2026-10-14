import type { Database, RevisionItemType } from '@/types/database';

export type RevisionItemRow = Database['public']['Tables']['revision_items']['Row'];
export type RevisionItemInsert = Database['public']['Tables']['revision_items']['Insert'];
export type RevisionLogRow = Database['public']['Tables']['revision_logs']['Row'];
export type RevisionLogInsert = Database['public']['Tables']['revision_logs']['Insert'];

export type DailyRevisionQueueItem = Database['public']['Views']['v_daily_revision_queue']['Row'];

export interface ReviewSubmissionPayload {
  revisionItemId: string;
  rating: number; // 0 to 5 (SM-2 spaced repetition rating)
  timeSpentSeconds?: number;
  notes?: string;
}

export { type RevisionItemType };
