import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Inglo | Smart Table Reservation Software',
  description:
    'Manage bookings, optimize tables, and deliver better dining experiences with a modern reservation platform.',
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <html lang="en">
    <body>
      <main className="container">{children}</main>
    </body>
  </html>
);

export default RootLayout;
