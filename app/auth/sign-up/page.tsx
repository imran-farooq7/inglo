import Link from 'next/link';
import { AuthForm } from '@/components/auth/auth-form';
import { signUpAction } from '@/app/auth/actions';

const SignUpPage = () => (
  <>
    <AuthForm
      title="Create account"
      submitLabel="Sign up"
      helperText="Create a secure account for staff and logged-in guest bookings."
      action={signUpAction}
    />
    <p style={{ textAlign: 'center' }}>
      Already have an account? <Link href="/auth/sign-in">Sign in</Link>
    </p>
  </>
);

export default SignUpPage;
