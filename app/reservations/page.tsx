import { ReservationForm } from '@/components/reservation-form';

const ReservationsPage = () => (
  <section className="section">
    <h1>Create Reservation</h1>
    <p className="subtitle">Book in seconds with real-time availability and smart booking types.</p>
    <ReservationForm />
  </section>
);

export default ReservationsPage;
