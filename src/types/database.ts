export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProblemStatus = 'todo' | 'attempted' | 'solved' | 'upsolved' | 'archived';
export type ProblemPlatform =
  | 'codeforces'
  | 'leetcode'
  | 'atcoder'
  | 'cses'
  | 'codechef'
  | 'spoj'
  | 'usaco'
  | 'kattis'
  | 'hackerrank'
  | 'other';

export type AttemptVerdict =
  | 'AC'
  | 'WA'
  | 'TLE'
  | 'MLE'
  | 'RE'
  | 'CE'
  | 'HACK'
  | 'TLE_MLE'
  | 'UPSOLVED_WITH_EDITORIAL'
  | 'GAVE_UP'
  | 'OTHER';

export type MistakeCategory =
  | 'logic_algorithm'
  | 'edge_case'
  | 'implementation_syntax'
  | 'overflow_precision'
  | 'complexity_tle_mle'
  | 'reading_comprehension'
  | 'contest_strategy'
  | 'testcase_reset'
  | 'other';

export type MistakeSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ConceptMastery = 'learning' | 'practicing' | 'mastered';
export type RevisionItemType = 'problem' | 'mistake' | 'pattern' | 'concept';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          display_name: string | null;
          avatar_url: string | null;
          codeforces_handle: string | null;
          leetcode_handle: string | null;
          atcoder_handle: string | null;
          daily_target: number;
          rating_target: number | null;
          preferred_language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          codeforces_handle?: string | null;
          leetcode_handle?: string | null;
          atcoder_handle?: string | null;
          daily_target?: number;
          rating_target?: number | null;
          preferred_language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          codeforces_handle?: string | null;
          leetcode_handle?: string | null;
          atcoder_handle?: string | null;
          daily_target?: number;
          rating_target?: number | null;
          preferred_language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      problems: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          platform: ProblemPlatform;
          problem_key: string | null;
          problem_url: string | null;
          difficulty_rating: number | null;
          difficulty_level: 'easy' | 'medium' | 'hard' | null;
          status: ProblemStatus;
          is_starred: boolean;
          time_spent_minutes: number;
          notes: string | null;
          editorial_url: string | null;
          first_attempted_at: string | null;
          solved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          platform?: ProblemPlatform;
          problem_key?: string | null;
          problem_url?: string | null;
          difficulty_rating?: number | null;
          difficulty_level?: 'easy' | 'medium' | 'hard' | null;
          status?: ProblemStatus;
          is_starred?: boolean;
          time_spent_minutes?: number;
          notes?: string | null;
          editorial_url?: string | null;
          first_attempted_at?: string | null;
          solved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          platform?: ProblemPlatform;
          problem_key?: string | null;
          problem_url?: string | null;
          difficulty_rating?: number | null;
          difficulty_level?: 'easy' | 'medium' | 'hard' | null;
          status?: ProblemStatus;
          is_starred?: boolean;
          time_spent_minutes?: number;
          notes?: string | null;
          editorial_url?: string | null;
          first_attempted_at?: string | null;
          solved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      problem_attempts: {
        Row: {
          id: string;
          user_id: string;
          problem_id: string;
          attempt_number: number;
          verdict: AttemptVerdict;
          submission_url: string | null;
          language: string;
          execution_time_ms: number | null;
          memory_used_kb: number | null;
          code_snippet: string | null;
          notes: string | null;
          attempted_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          problem_id: string;
          attempt_number?: number;
          verdict?: AttemptVerdict;
          submission_url?: string | null;
          language?: string;
          execution_time_ms?: number | null;
          memory_used_kb?: number | null;
          code_snippet?: string | null;
          notes?: string | null;
          attempted_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          problem_id?: string;
          attempt_number?: number;
          verdict?: AttemptVerdict;
          submission_url?: string | null;
          language?: string;
          execution_time_ms?: number | null;
          memory_used_kb?: number | null;
          code_snippet?: string | null;
          notes?: string | null;
          attempted_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      mistakes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          category: MistakeCategory;
          severity: MistakeSeverity;
          description: string | null;
          trigger_condition: string | null;
          prevention_checklist: string[];
          example_problem_url: string | null;
          occurrences_count: number;
          last_occurred_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          category?: MistakeCategory;
          severity?: MistakeSeverity;
          description?: string | null;
          trigger_condition?: string | null;
          prevention_checklist?: string[];
          example_problem_url?: string | null;
          occurrences_count?: number;
          last_occurred_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          category?: MistakeCategory;
          severity?: MistakeSeverity;
          description?: string | null;
          trigger_condition?: string | null;
          prevention_checklist?: string[];
          example_problem_url?: string | null;
          occurrences_count?: number;
          last_occurred_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      attempt_mistakes: {
        Row: {
          attempt_id: string;
          mistake_id: string;
          user_id: string;
          specific_notes: string | null;
          created_at: string;
        };
        Insert: {
          attempt_id: string;
          mistake_id: string;
          user_id: string;
          specific_notes?: string | null;
          created_at?: string;
        };
        Update: {
          attempt_id?: string;
          mistake_id?: string;
          user_id?: string;
          specific_notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      problem_mistakes: {
        Row: {
          problem_id: string;
          mistake_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          problem_id: string;
          mistake_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          problem_id?: string;
          mistake_id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      patterns: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          category: string;
          when_you_see: string;
          think: string;
          do_action: string;
          pitfalls: string | null;
          code_template: string | null;
          confidence_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          category?: string;
          when_you_see: string;
          think: string;
          do_action: string;
          pitfalls?: string | null;
          code_template?: string | null;
          confidence_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          category?: string;
          when_you_see?: string;
          think?: string;
          do_action?: string;
          pitfalls?: string | null;
          code_template?: string | null;
          confidence_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      problem_patterns: {
        Row: {
          problem_id: string;
          pattern_id: string;
          user_id: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          problem_id: string;
          pattern_id: string;
          user_id: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          problem_id?: string;
          pattern_id?: string;
          user_id?: string;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      concepts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: string;
          summary: string | null;
          time_complexity: string | null;
          space_complexity: string | null;
          code_template: string | null;
          resources: Json;
          mastery_level: ConceptMastery;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          category?: string;
          summary?: string | null;
          time_complexity?: string | null;
          space_complexity?: string | null;
          code_template?: string | null;
          resources?: Json;
          mastery_level?: ConceptMastery;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          category?: string;
          summary?: string | null;
          time_complexity?: string | null;
          space_complexity?: string | null;
          code_template?: string | null;
          resources?: Json;
          mastery_level?: ConceptMastery;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      problem_concepts: {
        Row: {
          problem_id: string;
          concept_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          problem_id: string;
          concept_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          problem_id?: string;
          concept_id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      problem_tags: {
        Row: {
          problem_id: string;
          tag_id: string;
          user_id: string;
        };
        Insert: {
          problem_id: string;
          tag_id: string;
          user_id: string;
        };
        Update: {
          problem_id?: string;
          tag_id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      mistake_tags: {
        Row: {
          mistake_id: string;
          tag_id: string;
          user_id: string;
        };
        Insert: {
          mistake_id: string;
          tag_id: string;
          user_id: string;
        };
        Update: {
          mistake_id?: string;
          tag_id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      pattern_tags: {
        Row: {
          pattern_id: string;
          tag_id: string;
          user_id: string;
        };
        Insert: {
          pattern_id: string;
          tag_id: string;
          user_id: string;
        };
        Update: {
          pattern_id?: string;
          tag_id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      concept_tags: {
        Row: {
          concept_id: string;
          tag_id: string;
          user_id: string;
        };
        Insert: {
          concept_id: string;
          tag_id: string;
          user_id: string;
        };
        Update: {
          concept_id?: string;
          tag_id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      revision_items: {
        Row: {
          id: string;
          user_id: string;
          item_type: RevisionItemType;
          problem_id: string | null;
          mistake_id: string | null;
          pattern_id: string | null;
          concept_id: string | null;
          repetition_count: number;
          interval_days: number;
          ease_factor: number;
          due_date: string;
          last_reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          item_type: RevisionItemType;
          problem_id?: string | null;
          mistake_id?: string | null;
          pattern_id?: string | null;
          concept_id?: string | null;
          repetition_count?: number;
          interval_days?: number;
          ease_factor?: number;
          due_date?: string;
          last_reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          item_type?: RevisionItemType;
          problem_id?: string | null;
          mistake_id?: string | null;
          pattern_id?: string | null;
          concept_id?: string | null;
          repetition_count?: number;
          interval_days?: number;
          ease_factor?: number;
          due_date?: string;
          last_reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      revision_logs: {
        Row: {
          id: string;
          revision_item_id: string;
          user_id: string;
          rating: number;
          time_spent_seconds: number;
          notes: string | null;
          reviewed_at: string;
        };
        Insert: {
          id?: string;
          revision_item_id: string;
          user_id: string;
          rating: number;
          time_spent_seconds?: number;
          notes?: string | null;
          reviewed_at?: string;
        };
        Update: {
          id?: string;
          revision_item_id?: string;
          user_id?: string;
          rating?: number;
          time_spent_seconds?: number;
          notes?: string | null;
          reviewed_at?: string;
        };
        Relationships: [];
      };
      extension_inbox: {
        Row: {
          id: string;
          user_id: string;
          platform: ProblemPlatform;
          problem_key: string | null;
          problem_title: string;
          problem_url: string;
          verdict: AttemptVerdict | null;
          submission_code: string | null;
          metadata: Json;
          status: 'pending' | 'processed' | 'discarded';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform?: ProblemPlatform;
          problem_key?: string | null;
          problem_title: string;
          problem_url: string;
          verdict?: AttemptVerdict | null;
          submission_code?: string | null;
          metadata?: Json;
          status?: 'pending' | 'processed' | 'discarded';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          platform?: ProblemPlatform;
          problem_key?: string | null;
          problem_title?: string;
          problem_url?: string;
          verdict?: AttemptVerdict | null;
          submission_code?: string | null;
          metadata?: Json;
          status?: 'pending' | 'processed' | 'discarded';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      v_user_weakness_analytics: {
        Row: {
          user_id: string;
          category: MistakeCategory;
          total_mistakes: number;
          total_occurrences: number;
          critical_high_count: number;
          most_recent_occurrence: string | null;
        };
        Relationships: [];
      };
      v_daily_revision_queue: {
        Row: {
          id: string;
          user_id: string;
          item_type: RevisionItemType;
          due_date: string;
          interval_days: number;
          repetition_count: number;
          ease_factor: number;
          item_title: string | null;
          item_subtitle: string | null;
        };
        Relationships: [];
      };
      v_user_problem_stats: {
        Row: {
          user_id: string;
          total_tracked: number;
          solved_count: number;
          upsolved_count: number;
          in_progress_count: number;
          starred_count: number;
          total_time_spent_minutes: number;
        };
        Relationships: [];
      };
    };
    Functions: {
      handle_new_user: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
      handle_updated_at: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    Enums: {
      problem_status: ProblemStatus;
      problem_platform: ProblemPlatform;
      attempt_verdict: AttemptVerdict;
      mistake_category: MistakeCategory;
      mistake_severity: MistakeSeverity;
      concept_mastery: ConceptMastery;
      revision_item_type: RevisionItemType;
    };
  };
}
