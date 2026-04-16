import Link from 'next/link';
import { AuthForm } from '@/components/auth/auth-form';
import { signInAction } from '@/app/auth/actions';

const SignInPage = () => (
  <>
    <AuthForm
      title="Sign in"
      submitLabel="Sign in"
      helperText="Use your restaurant account to manage bookings and access staff tools."
      action={signInAction}
    />
    <p style={{ textAlign: 'center' }}>
      New here? <Link href="/auth/sign-up">Create an account</Link>
    </p>
  </>
);

export default SignInPage;
