import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthStatus } from '@/components/auth/auth-status';
import './globals.css';

export const metadata: Metadata = {
  title: 'Inglo | Smart Table Reservation Software',
  description:
    'Manage bookings, optimize tables, and deliver better dining experiences with a modern reservation platform.',
};

const RootLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <html lang="en">
    <body>
      <main className="container">
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem' }}>
          <Link href="/" style={{ fontWeight: 800, textDecoration: 'none' }}>
            Inglo
          </Link>
          <AuthStatus />
        </nav>
        {children}
      </main>
    </body>
  </html>
);

export default RootLayout;
