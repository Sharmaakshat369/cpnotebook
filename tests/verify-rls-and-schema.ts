import * as fs from 'fs';
import * as path from 'path';

function verifyRlsAndSchema() {
  console.log('--- Verifying Comprehensive CP Tracker Schema & RLS Policies ---');
  
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20261014000000_cp_tracker_schema.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  // List of all expected tables
  const expectedTables = [
    'profiles',
    'problems',
    'problem_attempts',
    'mistakes',
    'attempt_mistakes',
    'problem_mistakes',
    'patterns',
    'problem_patterns',
    'concepts',
    'problem_concepts',
    'tags',
    'problem_tags',
    'mistake_tags',
    'pattern_tags',
    'concept_tags',
    'revision_items',
    'revision_logs',
    'extension_inbox'
  ];

  console.log(`Checking ${expectedTables.length} required tables...`);
  for (const table of expectedTables) {
    const tableRegex = new RegExp(`CREATE TABLE IF NOT EXISTS public\\.${table}\\s*\\(`, 'i');
    if (!tableRegex.test(sql)) {
      throw new Error(`Missing expected table: ${table}`);
    }
    console.log(`  ✓ Table defined: public.${table}`);
  }

  console.log('\nChecking Row Level Security (RLS) enforcement on all tables...');
  for (const table of expectedTables) {
    const rlsRegex = new RegExp(`ALTER TABLE public\\.${table}\\s+ENABLE ROW LEVEL SECURITY;`, 'i');
    if (!rlsRegex.test(sql)) {
      throw new Error(`Table ${table} is missing ENABLE ROW LEVEL SECURITY!`);
    }
    console.log(`  ✓ RLS enabled on: public.${table}`);
  }

  console.log('\nChecking RLS policies for each table...');
  for (const table of expectedTables) {
    const policyRegex = new RegExp(`CREATE POLICY [^;]+ ON public\\.${table}\\s+FOR`, 'gi');
    const policies = sql.match(policyRegex);
    if (!policies || policies.length === 0) {
      throw new Error(`Table public.${table} has no RLS policies defined!`);
    }
    console.log(`  ✓ Policies found for public.${table}: ${policies.length} policies`);
  }

  console.log('\nChecking Foreign Keys and CASCADE Deletions...');
  const cascadeMatches = sql.match(/ON DELETE CASCADE/gi);
  console.log(`  ✓ Found ${cascadeMatches ? cascadeMatches.length : 0} ON DELETE CASCADE references.`);
  if (!cascadeMatches || cascadeMatches.length < expectedTables.length) {
    throw new Error('Some foreign keys might be missing ON DELETE CASCADE!');
  }

  console.log('\nChecking Full-Text Search GIN Indexes...');
  const ftsIndexes = ['idx_problems_fts', 'idx_mistakes_fts', 'idx_patterns_fts', 'idx_concepts_fts'];
  for (const idx of ftsIndexes) {
    if (!sql.includes(idx)) {
      throw new Error(`Missing FTS index: ${idx}`);
    }
    console.log(`  ✓ FTS index defined: ${idx}`);
  }

  console.log('\nChecking Pattern Library (WHEN YOU SEE -> THINK -> DO)...');
  const requiredPatternColumns = ['when_you_see', 'think', 'do_action'];
  for (const col of requiredPatternColumns) {
    if (!sql.includes(col)) {
      throw new Error(`patterns table missing required column: ${col}`);
    }
    console.log(`  ✓ Pattern heuristic column present: ${col}`);
  }

  console.log('\nChecking Verdicts & Mistake Categories...');
  const verdicts = ['AC', 'WA', 'TLE', 'MLE', 'RE', 'CE', 'HACK', 'TLE_MLE', 'UPSOLVED_WITH_EDITORIAL', 'GAVE_UP'];
  for (const v of verdicts) {
    if (!sql.includes(`'${v}'`)) {
      throw new Error(`Missing CP verdict in enum: ${v}`);
    }
  }
  console.log(`  ✓ All ${verdicts.length} competitive programming verdicts verified.`);

  const mistakeCategories = [
    'logic_algorithm',
    'edge_case',
    'implementation_syntax',
    'overflow_precision',
    'complexity_tle_mle',
    'reading_comprehension',
    'contest_strategy',
    'testcase_reset'
  ];
  for (const cat of mistakeCategories) {
    if (!sql.includes(`'${cat}'`)) {
      throw new Error(`Missing mistake category in enum: ${cat}`);
    }
  }
  console.log(`  ✓ All ${mistakeCategories.length} CP mistake categories verified.`);

  console.log('\nChecking Analytics Views...');
  const expectedViews = [
    'v_user_weakness_analytics',
    'v_daily_revision_queue',
    'v_user_problem_stats'
  ];
  for (const v of expectedViews) {
    if (!sql.includes(`VIEW public.${v}`)) {
      throw new Error(`Missing analytics view: ${v}`);
    }
    console.log(`  ✓ Analytics view present: public.${v}`);
  }

  console.log('\n======================================================');
  console.log('ALL SCHEMA AND RLS VERIFICATION CHECKS PASSED (100%)');
  console.log('======================================================\n');
}

verifyRlsAndSchema();
