-- ============================================================================
-- Competitive Programming Knowledge & Mistake Tracker
-- Database Migration: 20261014000000_cp_tracker_schema.sql
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM ENUMS & TYPES
DO $$ BEGIN
  CREATE TYPE public.problem_status AS ENUM (
    'todo',
    'attempted',
    'solved',
    'upsolved',
    'archived'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.problem_platform AS ENUM (
    'codeforces',
    'leetcode',
    'atcoder',
    'cses',
    'codechef',
    'spoj',
    'usaco',
    'kattis',
    'hackerrank',
    'other'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.attempt_verdict AS ENUM (
    'AC',
    'WA',
    'TLE',
    'MLE',
    'RE',
    'CE',
    'HACK',
    'TLE_MLE',
    'UPSOLVED_WITH_EDITORIAL',
    'GAVE_UP',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.mistake_category AS ENUM (
    'logic_algorithm',
    'edge_case',
    'implementation_syntax',
    'overflow_precision',
    'complexity_tle_mle',
    'reading_comprehension',
    'contest_strategy',
    'testcase_reset',
    'other'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.mistake_severity AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.concept_mastery AS ENUM (
    'learning',
    'practicing',
    'mastered'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.revision_item_type AS ENUM (
    'problem',
    'mistake',
    'pattern',
    'concept'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. REUSABLE TRIGGER FUNCTIONS
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. PROFILES TABLE (Linked 1-to-1 with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  codeforces_handle TEXT,
  leetcode_handle TEXT,
  atcoder_handle TEXT,
  daily_target INTEGER NOT NULL DEFAULT 3 CHECK (daily_target >= 0),
  rating_target INTEGER CHECK (rating_target >= 0),
  preferred_language TEXT NOT NULL DEFAULT 'cpp',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger to auto-create profile on auth.users sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. PROBLEMS TABLE
CREATE TABLE IF NOT EXISTS public.problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  platform public.problem_platform NOT NULL DEFAULT 'codeforces',
  problem_key TEXT,
  problem_url TEXT,
  difficulty_rating INTEGER CHECK (difficulty_rating >= 0),
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  status public.problem_status NOT NULL DEFAULT 'todo',
  is_starred BOOLEAN NOT NULL DEFAULT FALSE,
  time_spent_minutes INTEGER NOT NULL DEFAULT 0 CHECK (time_spent_minutes >= 0),
  notes TEXT,
  editorial_url TEXT,
  first_attempted_at TIMESTAMPTZ,
  solved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PROBLEM ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS public.problem_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL DEFAULT 1 CHECK (attempt_number >= 1),
  verdict public.attempt_verdict NOT NULL DEFAULT 'WA',
  submission_url TEXT,
  language TEXT NOT NULL DEFAULT 'cpp',
  execution_time_ms INTEGER CHECK (execution_time_ms >= 0),
  memory_used_kb INTEGER CHECK (memory_used_kb >= 0),
  code_snippet TEXT,
  notes TEXT,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. MISTAKE LIBRARY TABLE
CREATE TABLE IF NOT EXISTS public.mistakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category public.mistake_category NOT NULL DEFAULT 'logic_algorithm',
  severity public.mistake_severity NOT NULL DEFAULT 'medium',
  description TEXT,
  trigger_condition TEXT,
  prevention_checklist TEXT[] NOT NULL DEFAULT '{}',
  example_problem_url TEXT,
  occurrences_count INTEGER NOT NULL DEFAULT 1 CHECK (occurrences_count >= 1),
  last_occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. JUNCTION: ATTEMPT MISTAKES
CREATE TABLE IF NOT EXISTS public.attempt_mistakes (
  attempt_id UUID NOT NULL REFERENCES public.problem_attempts(id) ON DELETE CASCADE,
  mistake_id UUID NOT NULL REFERENCES public.mistakes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  specific_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (attempt_id, mistake_id)
);

-- 9. JUNCTION: PROBLEM MISTAKES
CREATE TABLE IF NOT EXISTS public.problem_mistakes (
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  mistake_id UUID NOT NULL REFERENCES public.mistakes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (problem_id, mistake_id)
);

-- 10. PATTERNS LIBRARY (WHEN YOU SEE -> THINK -> DO)
CREATE TABLE IF NOT EXISTS public.patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  when_you_see TEXT NOT NULL,
  think TEXT NOT NULL,
  do_action TEXT NOT NULL,
  pitfalls TEXT,
  code_template TEXT,
  confidence_score INTEGER NOT NULL DEFAULT 3 CHECK (confidence_score BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. JUNCTION: PROBLEM PATTERNS
CREATE TABLE IF NOT EXISTS public.problem_patterns (
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  pattern_id UUID NOT NULL REFERENCES public.patterns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (problem_id, pattern_id)
);

-- 12. CONCEPT LIBRARY
CREATE TABLE IF NOT EXISTS public.concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Data Structures',
  summary TEXT,
  time_complexity TEXT,
  space_complexity TEXT,
  code_template TEXT,
  resources JSONB NOT NULL DEFAULT '[]'::jsonb,
  mastery_level public.concept_mastery NOT NULL DEFAULT 'learning',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. JUNCTION: PROBLEM CONCEPTS
CREATE TABLE IF NOT EXISTS public.problem_concepts (
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (problem_id, concept_id)
);

-- 14. TAGS TABLE
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_tags_user_name UNIQUE (user_id, name)
);

-- 15. TAG JUNCTION TABLES
CREATE TABLE IF NOT EXISTS public.problem_tags (
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (problem_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.mistake_tags (
  mistake_id UUID NOT NULL REFERENCES public.mistakes(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (mistake_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.pattern_tags (
  pattern_id UUID NOT NULL REFERENCES public.patterns(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (pattern_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.concept_tags (
  concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (concept_id, tag_id)
);

-- 16. REVISION SYSTEM (Spaced Repetition Queue)
CREATE TABLE IF NOT EXISTS public.revision_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type public.revision_item_type NOT NULL,
  problem_id UUID REFERENCES public.problems(id) ON DELETE CASCADE,
  mistake_id UUID REFERENCES public.mistakes(id) ON DELETE CASCADE,
  pattern_id UUID REFERENCES public.patterns(id) ON DELETE CASCADE,
  concept_id UUID REFERENCES public.concepts(id) ON DELETE CASCADE,
  repetition_count INTEGER NOT NULL DEFAULT 0 CHECK (repetition_count >= 0),
  interval_days INTEGER NOT NULL DEFAULT 1 CHECK (interval_days >= 1),
  ease_factor NUMERIC(4,2) NOT NULL DEFAULT 2.50 CHECK (ease_factor >= 1.30),
  due_date DATE NOT NULL DEFAULT CURRENT_DATE,
  last_reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT check_revision_target CHECK (
    (item_type = 'problem' AND problem_id IS NOT NULL AND mistake_id IS NULL AND pattern_id IS NULL AND concept_id IS NULL) OR
    (item_type = 'mistake' AND mistake_id IS NOT NULL AND problem_id IS NULL AND pattern_id IS NULL AND concept_id IS NULL) OR
    (item_type = 'pattern' AND pattern_id IS NOT NULL AND problem_id IS NULL AND mistake_id IS NULL AND concept_id IS NULL) OR
    (item_type = 'concept' AND concept_id IS NOT NULL AND problem_id IS NULL AND mistake_id IS NULL AND pattern_id IS NULL)
  )
);

-- 17. REVISION LOGS
CREATE TABLE IF NOT EXISTS public.revision_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  revision_item_id UUID NOT NULL REFERENCES public.revision_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 0 AND 5),
  time_spent_seconds INTEGER NOT NULL DEFAULT 0 CHECK (time_spent_seconds >= 0),
  notes TEXT,
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. BROWSER EXTENSION QUICK CAPTURE INBOX
CREATE TABLE IF NOT EXISTS public.extension_inbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform public.problem_platform NOT NULL DEFAULT 'codeforces',
  problem_key TEXT,
  problem_title TEXT NOT NULL,
  problem_url TEXT NOT NULL,
  verdict public.attempt_verdict,
  submission_code TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'discarded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. TIMESTAMPS TRIGGERS
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_problems_updated_at ON public.problems;
CREATE TRIGGER trg_problems_updated_at
  BEFORE UPDATE ON public.problems
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_mistakes_updated_at ON public.mistakes;
CREATE TRIGGER trg_mistakes_updated_at
  BEFORE UPDATE ON public.mistakes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_patterns_updated_at ON public.patterns;
CREATE TRIGGER trg_patterns_updated_at
  BEFORE UPDATE ON public.patterns
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_concepts_updated_at ON public.concepts;
CREATE TRIGGER trg_concepts_updated_at
  BEFORE UPDATE ON public.concepts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_revision_items_updated_at ON public.revision_items;
CREATE TRIGGER trg_revision_items_updated_at
  BEFORE UPDATE ON public.revision_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_extension_inbox_updated_at ON public.extension_inbox;
CREATE TRIGGER trg_extension_inbox_updated_at
  BEFORE UPDATE ON public.extension_inbox
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 20. INDEXES (Foreign Keys, Queries, Performance)
CREATE INDEX IF NOT EXISTS idx_problems_user_id ON public.problems(user_id);
CREATE INDEX IF NOT EXISTS idx_problems_user_status ON public.problems(user_id, status);
CREATE INDEX IF NOT EXISTS idx_problems_user_platform ON public.problems(user_id, platform);
CREATE INDEX IF NOT EXISTS idx_problems_user_rating ON public.problems(user_id, difficulty_rating);

CREATE INDEX IF NOT EXISTS idx_attempts_problem_id ON public.problem_attempts(problem_id);
CREATE INDEX IF NOT EXISTS idx_attempts_user_id ON public.problem_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_verdict ON public.problem_attempts(user_id, verdict);

CREATE INDEX IF NOT EXISTS idx_mistakes_user_id ON public.mistakes(user_id);
CREATE INDEX IF NOT EXISTS idx_mistakes_user_category ON public.mistakes(user_id, category);
CREATE INDEX IF NOT EXISTS idx_mistakes_occurrences ON public.mistakes(user_id, occurrences_count DESC);

CREATE INDEX IF NOT EXISTS idx_attempt_mistakes_mistake ON public.attempt_mistakes(mistake_id);
CREATE INDEX IF NOT EXISTS idx_attempt_mistakes_user ON public.attempt_mistakes(user_id);
CREATE INDEX IF NOT EXISTS idx_problem_mistakes_mistake ON public.problem_mistakes(mistake_id);
CREATE INDEX IF NOT EXISTS idx_problem_mistakes_user ON public.problem_mistakes(user_id);

CREATE INDEX IF NOT EXISTS idx_patterns_user_id ON public.patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_patterns_category ON public.patterns(user_id, category);
CREATE INDEX IF NOT EXISTS idx_problem_patterns_pattern ON public.problem_patterns(pattern_id);
CREATE INDEX IF NOT EXISTS idx_problem_patterns_user ON public.problem_patterns(user_id);

CREATE INDEX IF NOT EXISTS idx_concepts_user_id ON public.concepts(user_id);
CREATE INDEX IF NOT EXISTS idx_concepts_category ON public.concepts(user_id, category);
CREATE INDEX IF NOT EXISTS idx_problem_concepts_concept ON public.problem_concepts(concept_id);
CREATE INDEX IF NOT EXISTS idx_problem_concepts_user ON public.problem_concepts(user_id);

CREATE INDEX IF NOT EXISTS idx_tags_user_id ON public.tags(user_id);
CREATE INDEX IF NOT EXISTS idx_problem_tags_tag ON public.problem_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_mistake_tags_tag ON public.mistake_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_pattern_tags_tag ON public.pattern_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_concept_tags_tag ON public.concept_tags(tag_id);

CREATE INDEX IF NOT EXISTS idx_revision_user_due ON public.revision_items(user_id, due_date ASC);
CREATE INDEX IF NOT EXISTS idx_revision_logs_item ON public.revision_logs(revision_item_id);
CREATE INDEX IF NOT EXISTS idx_revision_logs_user ON public.revision_logs(user_id, reviewed_at DESC);

CREATE INDEX IF NOT EXISTS idx_extension_inbox_user_status ON public.extension_inbox(user_id, status);

-- FULL-TEXT SEARCH GIN INDEXES
CREATE INDEX IF NOT EXISTS idx_problems_fts ON public.problems
  USING GIN (to_tsvector('english', title || ' ' || COALESCE(notes, '')));

CREATE INDEX IF NOT EXISTS idx_mistakes_fts ON public.mistakes
  USING GIN (to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(trigger_condition, '')));

CREATE INDEX IF NOT EXISTS idx_patterns_fts ON public.patterns
  USING GIN (to_tsvector('english', title || ' ' || when_you_see || ' ' || think || ' ' || do_action));

CREATE INDEX IF NOT EXISTS idx_concepts_fts ON public.concepts
  USING GIN (to_tsvector('english', name || ' ' || COALESCE(summary, '')));

-- 21. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mistakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempt_mistakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_mistakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mistake_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pattern_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concept_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extension_inbox ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_delete_own" ON public.profiles
  FOR DELETE USING (auth.uid() = id);

-- PROBLEMS POLICIES
CREATE POLICY "problems_select_own" ON public.problems
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "problems_insert_own" ON public.problems
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "problems_update_own" ON public.problems
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "problems_delete_own" ON public.problems
  FOR DELETE USING (auth.uid() = user_id);

-- PROBLEM ATTEMPTS POLICIES
CREATE POLICY "attempts_select_own" ON public.problem_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "attempts_insert_own" ON public.problem_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "attempts_update_own" ON public.problem_attempts
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "attempts_delete_own" ON public.problem_attempts
  FOR DELETE USING (auth.uid() = user_id);

-- MISTAKES POLICIES
CREATE POLICY "mistakes_select_own" ON public.mistakes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "mistakes_insert_own" ON public.mistakes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "mistakes_update_own" ON public.mistakes
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "mistakes_delete_own" ON public.mistakes
  FOR DELETE USING (auth.uid() = user_id);

-- ATTEMPT MISTAKES POLICIES
CREATE POLICY "attempt_mistakes_select_own" ON public.attempt_mistakes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "attempt_mistakes_insert_own" ON public.attempt_mistakes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "attempt_mistakes_update_own" ON public.attempt_mistakes
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "attempt_mistakes_delete_own" ON public.attempt_mistakes
  FOR DELETE USING (auth.uid() = user_id);

-- PROBLEM MISTAKES POLICIES
CREATE POLICY "problem_mistakes_select_own" ON public.problem_mistakes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "problem_mistakes_insert_own" ON public.problem_mistakes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "problem_mistakes_update_own" ON public.problem_mistakes
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "problem_mistakes_delete_own" ON public.problem_mistakes
  FOR DELETE USING (auth.uid() = user_id);

-- PATTERNS POLICIES
CREATE POLICY "patterns_select_own" ON public.patterns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "patterns_insert_own" ON public.patterns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "patterns_update_own" ON public.patterns
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "patterns_delete_own" ON public.patterns
  FOR DELETE USING (auth.uid() = user_id);

-- PROBLEM PATTERNS POLICIES
CREATE POLICY "problem_patterns_select_own" ON public.problem_patterns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "problem_patterns_insert_own" ON public.problem_patterns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "problem_patterns_update_own" ON public.problem_patterns
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "problem_patterns_delete_own" ON public.problem_patterns
  FOR DELETE USING (auth.uid() = user_id);

-- CONCEPTS POLICIES
CREATE POLICY "concepts_select_own" ON public.concepts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "concepts_insert_own" ON public.concepts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "concepts_update_own" ON public.concepts
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "concepts_delete_own" ON public.concepts
  FOR DELETE USING (auth.uid() = user_id);

-- PROBLEM CONCEPTS POLICIES
CREATE POLICY "problem_concepts_select_own" ON public.problem_concepts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "problem_concepts_insert_own" ON public.problem_concepts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "problem_concepts_update_own" ON public.problem_concepts
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "problem_concepts_delete_own" ON public.problem_concepts
  FOR DELETE USING (auth.uid() = user_id);

-- TAGS POLICIES
CREATE POLICY "tags_select_own" ON public.tags
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "tags_insert_own" ON public.tags
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tags_update_own" ON public.tags
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tags_delete_own" ON public.tags
  FOR DELETE USING (auth.uid() = user_id);

-- TAG JUNCTIONS POLICIES
CREATE POLICY "problem_tags_all_own" ON public.problem_tags
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "mistake_tags_all_own" ON public.mistake_tags
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "pattern_tags_all_own" ON public.pattern_tags
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "concept_tags_all_own" ON public.concept_tags
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- REVISION ITEMS POLICIES
CREATE POLICY "revision_items_select_own" ON public.revision_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "revision_items_insert_own" ON public.revision_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "revision_items_update_own" ON public.revision_items
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "revision_items_delete_own" ON public.revision_items
  FOR DELETE USING (auth.uid() = user_id);

-- REVISION LOGS POLICIES
CREATE POLICY "revision_logs_select_own" ON public.revision_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "revision_logs_insert_own" ON public.revision_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "revision_logs_update_own" ON public.revision_logs
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "revision_logs_delete_own" ON public.revision_logs
  FOR DELETE USING (auth.uid() = user_id);

-- EXTENSION INBOX POLICIES
CREATE POLICY "extension_inbox_select_own" ON public.extension_inbox
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "extension_inbox_insert_own" ON public.extension_inbox
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "extension_inbox_update_own" ON public.extension_inbox
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "extension_inbox_delete_own" ON public.extension_inbox
  FOR DELETE USING (auth.uid() = user_id);

-- 22. ANALYTICS & WEAKNESS VIEWS (Security Invoker)
CREATE OR REPLACE VIEW public.v_user_weakness_analytics
WITH (security_invoker = true) AS
SELECT
  user_id,
  category,
  COUNT(*) AS total_mistakes,
  SUM(occurrences_count) AS total_occurrences,
  COUNT(*) FILTER (WHERE severity IN ('high', 'critical')) AS critical_high_count,
  MAX(last_occurred_at) AS most_recent_occurrence
FROM public.mistakes
GROUP BY user_id, category;

CREATE OR REPLACE VIEW public.v_daily_revision_queue
WITH (security_invoker = true) AS
SELECT
  r.id,
  r.user_id,
  r.item_type,
  r.due_date,
  r.interval_days,
  r.repetition_count,
  r.ease_factor,
  CASE r.item_type
    WHEN 'problem' THEN p.title
    WHEN 'mistake' THEN m.title
    WHEN 'pattern' THEN pt.title
    WHEN 'concept' THEN c.name
  END AS item_title,
  CASE r.item_type
    WHEN 'problem' THEN p.difficulty_rating::TEXT
    WHEN 'mistake' THEN m.category::TEXT
    WHEN 'pattern' THEN pt.category
    WHEN 'concept' THEN c.category
  END AS item_subtitle
FROM public.revision_items r
LEFT JOIN public.problems p ON r.problem_id = p.id
LEFT JOIN public.mistakes m ON r.mistake_id = m.id
LEFT JOIN public.patterns pt ON r.pattern_id = pt.id
LEFT JOIN public.concepts c ON r.concept_id = c.id
WHERE r.due_date <= CURRENT_DATE;

CREATE OR REPLACE VIEW public.v_user_problem_stats
WITH (security_invoker = true) AS
SELECT
  user_id,
  COUNT(*) AS total_tracked,
  COUNT(*) FILTER (WHERE status = 'solved') AS solved_count,
  COUNT(*) FILTER (WHERE status = 'upsolved') AS upsolved_count,
  COUNT(*) FILTER (WHERE status = 'attempted') AS in_progress_count,
  COUNT(*) FILTER (WHERE is_starred = TRUE) AS starred_count,
  COALESCE(SUM(time_spent_minutes), 0) AS total_time_spent_minutes
FROM public.problems
GROUP BY user_id;
