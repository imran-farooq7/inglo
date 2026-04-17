'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { bookingTypes } from '@/lib/reservation-schema';

type ReservationApiResponse = {
  reservationId: string;
  status: 'confirmed';
};

type SessionUser = {
  id: string;
  email?: string;
};

type AvailabilityTable = {
  id: string;
  name: string;
  capacity: number;
};

type AvailabilityResponse = {
  availableTables: AvailabilityTable[];
  unavailableTables: AvailabilityTable[];
};

const toIsoTime = (rawValue: string) => new Date(rawValue).toISOString();

export const ReservationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [availableTables, setAvailableTables] = useState<AvailabilityTable[]>([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [partySize, setPartySize] = useState(2);

  const defaultDatetime = useMemo(() => {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    now.setHours(now.getHours() + 2);
    return now.toISOString().slice(0, 16);
  }, []);

  const [reservationAtInput, setReservationAtInput] = useState(defaultDatetime);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch('/api/auth/user');
        const payload = (await response.json()) as { user: SessionUser | null };
        setSessionUser(payload.user);
      } catch {
        setSessionUser(null);
      }
    };

    void loadSession();
  }, []);

  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const query = new URLSearchParams({
          restaurantSlug: 'inglo-demo',
          reservationAt: toIsoTime(reservationAtInput),
          partySize: String(partySize),
        });

        const response = await fetch(`/api/availability?${query.toString()}`);

        if (!response.ok) {
          setAvailableTables([]);
          setSelectedTable('');
          setAvailabilityMessage('Unable to load available tables for the selected slot.');
          return;
        }

        const payload = (await response.json()) as AvailabilityResponse;
        setAvailableTables(payload.availableTables);

        if (payload.availableTables.length === 0) {
          setSelectedTable('');
          setAvailabilityMessage('No tables available for the selected date/time and party size.');
          return;
        }

        setSelectedTable((currentTable) => {
          const existing = payload.availableTables.find((table) => table.name === currentTable);
          return existing ? currentTable : payload.availableTables[0].name;
        });

        setAvailabilityMessage(`${payload.availableTables.length} table(s) available.`);
      } catch {
        setAvailableTables([]);
        setSelectedTable('');
        setAvailabilityMessage('Network issue while loading availability.');
      }
    };

    void loadAvailability();
  }, [partySize, reservationAtInput]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const bookingTypeValue = String(formData.get('bookingType'));

    const payload = {
      restaurantSlug: String(formData.get('restaurantSlug')),
      tableName: selectedTable,
      bookingType: sessionUser && bookingTypeValue === 'guest' ? 'logged_in' : bookingTypeValue,
      guestName: String(formData.get('guestName')),
      guestEmail: sessionUser?.email ?? String(formData.get('guestEmail')),
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
      <input name="restaurantSlug" placeholder="Restaurant slug" defaultValue="inglo-demo" required readOnly />

      <input
        name="partySize"
        type="number"
        min={1}
        max={20}
        defaultValue={2}
        required
        onChange={(event) => setPartySize(Number(event.target.value))}
      />

      <input
        name="reservationAt"
        type="datetime-local"
        defaultValue={defaultDatetime}
        required
        onChange={(event) => setReservationAtInput(event.target.value)}
      />

      <select name="tableName" value={selectedTable} onChange={(event) => setSelectedTable(event.target.value)} required>
        {availableTables.length === 0 ? (
          <option value="">No table available</option>
        ) : null}
        {availableTables.map((table) => (
          <option key={table.id} value={table.name}>
            {table.name} (capacity {table.capacity})
          </option>
        ))}
      </select>

      <p>{availabilityMessage}</p>

      <select name="bookingType" defaultValue={sessionUser ? 'logged_in' : bookingTypes[0]}>
        {bookingTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <input name="guestName" placeholder="Guest full name" required />
      <input
        name="guestEmail"
        type="email"
        placeholder="Guest email"
        defaultValue={sessionUser?.email ?? ''}
        readOnly={Boolean(sessionUser?.email)}
        required
      />

      <input name="notes" placeholder="Optional notes" />

      <button disabled={isSubmitting || !selectedTable} type="submit">
        {isSubmitting ? 'Confirming...' : 'Confirm reservation'}
      </button>

      {sessionUser ? <p>Logged in booking detected. Email is locked to your account.</p> : null}
      {message ? <p>{message}</p> : null}
    </form>
  );
};
