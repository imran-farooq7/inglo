'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

type AuthActionState = {
  error?: string;
};

const getField = (formData: FormData, field: string) => String(formData.get(field) ?? '').trim();

const invalidCredentialsState: AuthActionState = { error: 'Invalid credentials. Please try again.' };

export const signInAction = async (_state: AuthActionState, formData: FormData): Promise<AuthActionState> => {
  const email = getField(formData, 'email');
  const password = getField(formData, 'password');

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return invalidCredentialsState;
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
};

export const signUpAction = async (_state: AuthActionState, formData: FormData): Promise<AuthActionState> => {
  const email = getField(formData, 'email');
  const password = getField(formData, 'password');

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/sign-in`
        : undefined,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect('/auth/sign-in?registered=1');
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
};
