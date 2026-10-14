import type { Database } from '@/types/database';

export type UserWeaknessAnalytics = Database['public']['Views']['v_user_weakness_analytics']['Row'];
export type UserProblemStats = Database['public']['Views']['v_user_problem_stats']['Row'];

export interface DashboardSummary {
  stats: UserProblemStats;
  weaknesses: UserWeaknessAnalytics[];
  dueRevisionsCount: number;
  recentActivity: {
    date: string;
    problemsAttempted: number;
    problemsSolved: number;
    mistakesLogged: number;
  }[];
}
