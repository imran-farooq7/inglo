'use client';

import { useActionState } from 'react';

type AuthActionState = {
  error?: string;
};

type AuthFormProps = {
  title: string;
  submitLabel: string;
  action: (state: AuthActionState, formData: FormData) => Promise<AuthActionState>;
  helperText: string;
};

const initialState: AuthActionState = {};

export const AuthForm = ({ title, submitLabel, action, helperText }: AuthFormProps) => {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <section className="section" style={{ maxWidth: 520, marginInline: 'auto' }}>
      <h1>{title}</h1>
      <p className="subtitle">{helperText}</p>
      <form className="form" action={formAction}>
        <input type="email" name="email" placeholder="you@restaurant.com" required />
        <input type="password" name="password" placeholder="Minimum 8 characters" minLength={8} required />
        <button type="submit" disabled={pending}>
          {pending ? 'Processing...' : submitLabel}
        </button>
        {state.error ? <p>{state.error}</p> : null}
      </form>
    </section>
  );
};
