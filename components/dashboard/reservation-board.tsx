'use client';

import { useEffect, useMemo, useState } from 'react';

type TableRecord = {
  id: string;
  name: string;
  capacity: number;
};

type ReservationRecord = {
  id: string;
  tableId: string;
  guestName: string;
  guestEmail: string;
  partySize: number;
  bookingType: string;
  status: 'confirmed' | 'seated' | 'completed' | 'cancelled';
  reservationAt: string;
};

type DashboardPayload = {
  date: string;
  tables: TableRecord[];
  reservations: ReservationRecord[];
};

const statusFlow: ReservationRecord['status'][] = ['confirmed', 'seated', 'completed', 'cancelled'];

const toTimeLabel = (isoString: string) =>
  new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const getNextStatus = (currentStatus: ReservationRecord['status']) => {
  const currentIndex = statusFlow.indexOf(currentStatus);

  if (currentIndex < 0 || currentIndex === statusFlow.length - 1) {
    return null;
  }

  return statusFlow[currentIndex + 1];
};

export const ReservationBoard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [payload, setPayload] = useState<DashboardPayload | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Loading reservations...');

  const fetchBoard = async (date: string) => {
    setLoadingMessage('Loading reservations...');

    try {
      const query = new URLSearchParams({ restaurantSlug: 'inglo-demo', date });
      const response = await fetch(`/api/dashboard/reservations?${query.toString()}`);

      if (!response.ok) {
        setPayload(null);
        setLoadingMessage('Unable to load board data.');
        return;
      }

      const data = (await response.json()) as DashboardPayload;
      setPayload(data);
      setLoadingMessage('');
    } catch {
      setPayload(null);
      setLoadingMessage('Network error while loading board data.');
    }
  };

  useEffect(() => {
    void fetchBoard(selectedDate);
  }, [selectedDate]);

  const reservationsByTable = useMemo(() => {
    if (!payload) {
      return {} as Record<string, ReservationRecord[]>;
    }

    return payload.reservations.reduce<Record<string, ReservationRecord[]>>((bucket, reservation) => {
      const current = bucket[reservation.tableId] ?? [];
      return { ...bucket, [reservation.tableId]: [...current, reservation] };
    }, {});
  }, [payload]);

  const updateStatus = async (reservationId: string, status: ReservationRecord['status']) => {
    const response = await fetch('/api/dashboard/reservations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reservationId, status }),
    });

    if (!response.ok) {
      setLoadingMessage('Could not update reservation status.');
      return;
    }

    await fetchBoard(selectedDate);
  };

  if (!payload) {
    return (
      <section className="section">
        <h2>Reservation Board</h2>
        <p>{loadingMessage}</p>
      </section>
    );
  }

  return (
    <section className="section">
      <h2>Reservation Board</h2>
      <p className="subtitle">Manage daily reservations by table and status.</p>
      <div className="form" style={{ maxWidth: 280 }}>
        <label htmlFor="boardDate">Date</label>
        <input
          id="boardDate"
          name="boardDate"
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
        />
      </div>

      <div className="grid" style={{ marginTop: '1rem' }}>
        {payload.tables.map((table) => {
          const tableReservations = reservationsByTable[table.id] ?? [];

          return (
            <article key={table.id} className="step">
              <h3>
                {table.name} <small>(cap {table.capacity})</small>
              </h3>

              {tableReservations.length === 0 ? <p>No reservations.</p> : null}

              {tableReservations.map((reservation) => {
                const nextStatus = getNextStatus(reservation.status);

                return (
                  <div key={reservation.id} style={{ borderTop: '1px solid #2f486c', paddingTop: '0.5rem' }}>
                    <p>
                      <strong>{toTimeLabel(reservation.reservationAt)}</strong> • {reservation.guestName} • party{' '}
                      {reservation.partySize}
                    </p>
                    <p>
                      {reservation.bookingType} • <em>{reservation.status}</em>
                    </p>
                    {nextStatus ? (
                      <button type="button" className="badge" onClick={() => void updateStatus(reservation.id, nextStatus)}>
                        Mark as {nextStatus}
                      </button>
                    ) : null}
                    {reservation.status !== 'cancelled' ? (
                      <button
                        type="button"
                        className="badge"
                        style={{ marginLeft: '0.5rem' }}
                        onClick={() => void updateStatus(reservation.id, 'cancelled')}
                      >
                        Cancel
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </article>
          );
        })}
      </div>
    </section>
  );
};
