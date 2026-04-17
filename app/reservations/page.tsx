import { ReservationForm } from '@/components/reservation-form';

const ReservationsPage = () => (
  <section className="section">
    <h1>Create Reservation</h1>
    <p className="subtitle">
      Select party size and date/time to fetch real-time available tables. Double-bookings are blocked
      automatically.
    </p>
    <ReservationForm />
  </section>
);

export default ReservationsPage;
