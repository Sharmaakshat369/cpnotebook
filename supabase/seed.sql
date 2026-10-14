-- ============================================================================
-- Competitive Programming Knowledge & Mistake Tracker - Seed Data
-- ============================================================================

-- Note: Seed data creates standard patterns, concepts, and reference mistake templates
-- for development and local testing.

DO $$
DECLARE
  demo_user_id UUID := '00000000-0000-0000-0000-000000000001';
  prob_rain_water UUID := '11111111-1111-1111-1111-111111111101';
  prob_balanced_str UUID := '11111111-1111-1111-1111-111111111102';
  prob_subarray_sum UUID := '11111111-1111-1111-1111-111111111103';
  
  mistake_overflow UUID := '22222222-2222-2222-2222-222222222201';
  mistake_edge_n1 UUID := '22222222-2222-2222-2222-222222222202';
  mistake_memset_tle UUID := '22222222-2222-2222-2222-222222222203';
  mistake_greedy_fail UUID := '22222222-2222-2222-2222-222222222204';
  
  pattern_bs_ans UUID := '33333333-3333-3333-3333-333333333301';
  pattern_mono_stack UUID := '33333333-3333-3333-3333-333333333302';
  pattern_prefix_hash UUID := '33333333-3333-3333-3333-333333333303';
  
  concept_segtree UUID := '44444444-4444-4444-4444-444444444401';
  concept_dsu UUID := '44444444-4444-4444-4444-444444444402';
  
  tag_dp UUID := '55555555-5555-5555-5555-555555555501';
  tag_bs UUID := '55555555-5555-5555-5555-555555555502';
  tag_graphs UUID := '55555555-5555-5555-5555-555555555503';
BEGIN

  -- 1. DEMO PROFILE
  INSERT INTO public.profiles (id, username, display_name, codeforces_handle, leetcode_handle, daily_target, rating_target)
  VALUES (
    demo_user_id,
    'tourist_in_training',
    'Candidate Master Wannabe',
    'tourist_wannabe',
    'algo_enthusiast',
    4,
    1900
  ) ON CONFLICT (id) DO NOTHING;

  -- 2. TAGS
  INSERT INTO public.tags (id, user_id, name, color) VALUES
    (tag_dp, demo_user_id, 'dynamic-programming', '#8b5cf6'),
    (tag_bs, demo_user_id, 'binary-search', '#3b82f6'),
    (tag_graphs, demo_user_id, 'graphs', '#10b981')
  ON CONFLICT (user_id, name) DO NOTHING;

  -- 3. PROBLEMS
  INSERT INTO public.problems (id, user_id, title, platform, problem_key, problem_url, difficulty_rating, difficulty_level, status, is_starred, time_spent_minutes, notes) VALUES
    (prob_rain_water, demo_user_id, 'Trapping Rain Water', 'leetcode', 'LC-42', 'https://leetcode.com/problems/trapping-rain-water/', 1700, 'hard', 'solved', TRUE, 45, 'Monotonic stack or two pointers from both ends.'),
    (prob_balanced_str, demo_user_id, 'Balanced String Contest', 'codeforces', '1850D', 'https://codeforces.com/contest/1850/problem/D', 1400, 'medium', 'upsolved', TRUE, 60, 'Fell into WA on test 7 due to 32-bit int multiplication overflow.'),
    (prob_subarray_sum, demo_user_id, 'Subarray Sums II', 'cses', 'CSES-1661', 'https://cses.fi/problemset/task/1661', 1500, 'medium', 'solved', FALSE, 25, 'Negative numbers present, prefix sums with map required.')
  ON CONFLICT (id) DO NOTHING;

  -- 4. PROBLEM ATTEMPTS
  INSERT INTO public.problem_attempts (problem_id, user_id, attempt_number, verdict, language, execution_time_ms, memory_used_kb, notes) VALUES
    (prob_balanced_str, demo_user_id, 1, 'WA', 'cpp', 120, 2048, 'WA on test 7. Overflow occurred when squaring difference.'),
    (prob_balanced_str, demo_user_id, 2, 'AC', 'cpp', 95, 2048, 'Cast to 1LL before multiplication. Clean AC.')
  ON CONFLICT (id) DO NOTHING;

  -- 5. MISTAKE LIBRARY
  INSERT INTO public.mistakes (id, user_id, title, category, severity, description, trigger_condition, prevention_checklist, occurrences_count) VALUES
    (
      mistake_overflow,
      demo_user_id,
      '32-bit Integer Overflow in Intermediate Multiplication',
      'overflow_precision',
      'critical',
      'Multiplying two 32-bit ints (e.g. a * b with a, b <= 10^9) overflows before assignment to long long.',
      'Any formula involving a * b, sum of array where elements exceed 10^5, or prefix sums of positive numbers.',
      ARRAY['Use #define int long long OR explicitly multiply by 1LL * a * b', 'Always check constraints: if N * max(A) > 2*10^9, use 64-bit int'],
      4
    ),
    (
      mistake_edge_n1,
      demo_user_id,
      'Unchecked N=1 Base Case in Sliding Window / Two Pointers',
      'edge_case',
      'high',
      'Two pointers loop assuming right = left + 1 accessed out of bounds when N=1 or left == right.',
      'Problems with 1 <= N <= 10^5 where N=1 produces immediate answer or trivial cycle.',
      ARRAY['Manually dry-run N=1 on scratchpad before submitting', 'Add explicit if (n == 1) return edge condition if loop invariant assumes size >= 2'],
      2
    ),
    (
      mistake_memset_tle,
      demo_user_id,
      'Multi-testcase Memset of MAXN causing O(T * MAXN) TLE',
      'testcase_reset',
      'critical',
      'Running memset(visited, 0, sizeof(visited)) where MAXN=10^6 and T=10^4 gives 10^10 ops -> TLE.',
      'Codeforces multi-testcase problems where sum of N over all testcases <= 2*10^5.',
      ARRAY['Only clear indices used in current testcase (e.g. for (int x : nodes_used) visited[x] = 0)', 'Use a testcase counter timer `visited[x] = current_test_id`'],
      3
    ),
    (
      mistake_greedy_fail,
      demo_user_id,
      'Premature Greedy Choice without Matroid / Exchange Argument Proof',
      'logic_algorithm',
      'high',
      'Assuming locally optimal choice (e.g. always taking smallest weight) yields global optimal, failing on counterexamples.',
      'Optimization problems with non-monotonic cost functions.',
      ARRAY['Find a 3-element counterexample before implementing', 'Prove exchange argument: if swapping adjacent inversions hurts solution'],
      1
    )
  ON CONFLICT (id) DO NOTHING;

  -- 6. ATTEMPT MISTAKES JUNCTION
  INSERT INTO public.problem_mistakes (problem_id, mistake_id, user_id) VALUES
    (prob_balanced_str, mistake_overflow, demo_user_id)
  ON CONFLICT (problem_id, mistake_id) DO NOTHING;

  -- 7. PATTERNS LIBRARY (WHEN YOU SEE -> THINK -> DO)
  INSERT INTO public.patterns (id, user_id, title, category, when_you_see, think, do_action, pitfalls, confidence_score) VALUES
    (
      pattern_bs_ans,
      demo_user_id,
      'Binary Search on Answer Space',
      'Binary Search',
      '1. "Find the minimum maximum" or "Find the maximum minimum".\n2. Feasibility function check(X) is monotonic (if valid for X, valid for all > X).\n3. Answer range is known [1, 10^14].',
      'Instead of constructing the optimal solution directly, guess candidate answer X and check if it is achievable.',
      '1. Define search range: L = lower_bound, R = upper_bound.\n2. Write `bool check(long long mid)` returning true if feasible.\n3. Standard loop:\n   while (L <= R) {\n     long long mid = L + (R - L) / 2;\n     if (check(mid)) { ans = mid; R = mid - 1; } else { L = mid + 1; }\n   }',
      'Upper bound too small (overflow or missing valid ans); integer division rounding issues with negatives.',
      4
    ),
    (
      pattern_mono_stack,
      demo_user_id,
      'Monotonic Stack for Next Greater / Previous Smaller Element',
      'Data Structures',
      '1. Need the nearest element to the left or right greater/smaller than current element in O(1) amortized.\n2. Histogram problems, trapping rain water, stock span.',
      'Maintain an invariant in a stack where elements are strictly increasing or decreasing. Elements popped will never be needed again.',
      '1. Create `stack<int> st` storing indices.\n2. Iterate through array:\n   while (!st.empty() && A[st.top()] <= A[i]) st.pop();\n   int prev_greater = st.empty() ? -1 : st.top();\n   st.push(i);',
      'Empty stack checking before accessing st.top(); strict inequality (<) vs non-strict (<=) for duplicate values.',
      5
    ),
    (
      pattern_prefix_hash,
      demo_user_id,
      'Prefix Sum with Hash Map for Subarray Target Sums',
      'Hashing / Prefix Sums',
      '1. "Count subarrays with sum equal to K".\n2. Array contains both positive and negative values (ruling out two pointers).\n3. 1 <= N <= 2*10^5.',
      'Subarray sum(L..R) = prefix[R] - prefix[L-1] == K <=> prefix[L-1] == prefix[R] - K. Store frequency of prefix sums encountered so far.',
      '1. Initialize `map<long long, int> freq; freq[0] = 1;`\n2. Maintain `long long current_sum = 0, count = 0;`\n3. For each num:\n   current_sum += num;\n   count += freq[current_sum - K];\n   freq[current_sum]++;',
      'Forgetting `freq[0] = 1` for subarrays starting at index 0; unordered_map worst-case O(N^2) on Codeforces anti-hash tests (use custom hash).',
      4
    )
  ON CONFLICT (id) DO NOTHING;

  -- 8. CONCEPTS LIBRARY
  INSERT INTO public.concepts (id, user_id, name, category, summary, time_complexity, space_complexity, mastery_level) VALUES
    (
      concept_segtree,
      demo_user_id,
      'Segment Tree with Lazy Propagation',
      'Data Structures',
      'Tree data structure for storing intervals or segments, allowing querying range minimum/sum and range updates in logarithmic time.',
      'O(log N) per query and update',
      'O(4N)',
      'practicing'
    ),
    (
      concept_dsu,
      demo_user_id,
      'Disjoint Set Union (DSU) with Path Compression & Union by Rank',
      'Data Structures',
      'Near O(1) disjoint set structure for dynamic connectivity, Kruskal MST, and cycle detection.',
      'O(alpha(N)) ~ O(1) amortized',
      'O(N)',
      'mastered'
    )
  ON CONFLICT (id) DO NOTHING;

  -- 9. PROBLEM CONCEPTS & PATTERNS
  INSERT INTO public.problem_patterns (problem_id, pattern_id, user_id) VALUES
    (prob_rain_water, pattern_mono_stack, demo_user_id),
    (prob_subarray_sum, pattern_prefix_hash, demo_user_id)
  ON CONFLICT (problem_id, pattern_id) DO NOTHING;

  -- 10. REVISION SYSTEM (SM-2 Spaced Repetition queue items)
  INSERT INTO public.revision_items (user_id, item_type, problem_id, repetition_count, interval_days, ease_factor, due_date) VALUES
    (demo_user_id, 'problem', prob_balanced_str, 1, 3, 2.50, CURRENT_DATE)
  ON CONFLICT DO NOTHING;

  INSERT INTO public.revision_items (user_id, item_type, mistake_id, repetition_count, interval_days, ease_factor, due_date) VALUES
    (demo_user_id, 'mistake', mistake_overflow, 2, 7, 2.60, CURRENT_DATE)
  ON CONFLICT DO NOTHING;

END $$;
