'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export interface AuthActionResult {
  error?: string;
  success?: boolean;
}

function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export async function loginAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;
  const nextPath = (formData.get('next') as string) || '/dashboard';

  if (!email || !validateEmail(email)) {
    return { error: 'Please enter a valid email address.' };
  }

  if (!password || password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.toLowerCase().includes('invalid login credentials')) {
      return { error: 'Incorrect email or password. Please try again.' };
    }
    if (error.message.toLowerCase().includes('email not confirmed')) {
      return { error: 'Please confirm your email address before logging in.' };
    }
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect(nextPath.startsWith('/') ? nextPath : '/dashboard');
}

export async function signupAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;
  const username = (formData.get('username') as string)?.trim();
  const codeforcesHandle = (formData.get('codeforcesHandle') as string)?.trim();

  if (!email || !validateEmail(email)) {
    return { error: 'Please enter a valid email address.' };
  }

  if (!password || password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' };
  }

  if (username && username.length < 2) {
    return { error: 'Username must be at least 2 characters.' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username || email.split('@')[0],
        full_name: username || email.split('@')[0],
        codeforces_handle: codeforcesHandle || null,
      },
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes('already registered')) {
      return { error: 'An account with this email already exists. Try signing in instead.' };
    }
    return { error: error.message };
  }

  // If Supabase has email confirmation enabled and session is not immediately returned
  if (data?.user && !data.session) {
    return {
      success: true,
      error: undefined,
    };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/auth/login');
}
