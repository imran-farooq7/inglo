'use client';

import { FormEvent, useMemo, useState } from 'react';
import { bookingTypes } from '@/lib/reservation-schema';

type ReservationApiResponse = {
  reservationId: string;
  status: 'confirmed';
};

const toIsoTime = (rawValue: string) => new Date(rawValue).toISOString();

export const ReservationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const defaultDatetime = useMemo(() => {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    now.setHours(now.getHours() + 2);
    return now.toISOString().slice(0, 16);
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = {
      restaurantSlug: String(formData.get('restaurantSlug')),
      tableName: String(formData.get('tableName')),
      bookingType: String(formData.get('bookingType')),
      guestName: String(formData.get('guestName')),
      guestEmail: String(formData.get('guestEmail')),
      partySize: Number(formData.get('partySize')),
      reservationAt: toIsoTime(String(formData.get('reservationAt'))),
      notes: String(formData.get('notes') ?? ''),
    };

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        setMessage(error.error ?? 'Reservation failed.');
        return;
      }

      const result = (await response.json()) as ReservationApiResponse;
      setMessage(`Reservation confirmed. Ref: ${result.reservationId}`);
      event.currentTarget.reset();
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <input name="restaurantSlug" placeholder="Restaurant slug" defaultValue="inglo-demo" required />
      <input name="tableName" placeholder="Table name" defaultValue="T1" required />
      <select name="bookingType" defaultValue={bookingTypes[0]}>
        {bookingTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <input name="guestName" placeholder="Guest full name" required />
      <input name="guestEmail" type="email" placeholder="Guest email" required />
      <input name="partySize" type="number" min={1} max={20} defaultValue={2} required />
      <input name="reservationAt" type="datetime-local" defaultValue={defaultDatetime} required />
      <input name="notes" placeholder="Optional notes" />
      <button disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Confirming...' : 'Confirm reservation'}
      </button>
      {message ? <p>{message}</p> : null}
    </form>
  );
};
