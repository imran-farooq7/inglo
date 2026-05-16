export type AnalyticsGroupBy = 'day' | 'week';

export type AnalyticsQueryParams = {
  restaurantSlug: string;
  from: string;
  to: string;
  groupBy: AnalyticsGroupBy;
  fromDate: Date;
  toDate: Date;
};

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const parseIsoDay = (value: string, field: 'from' | 'to') => {
  if (!DAY_PATTERN.test(value)) {
    throw new Error(`${field} must be in YYYY-MM-DD format.`);
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`${field} is not a valid date.`);
  }

  return parsed;
};

export const normalizeIsoDay = (day: Date) => day.toISOString().slice(0, 10);

export const getExclusiveEnd = (day: Date) => {
  const end = new Date(day);
  end.setUTCDate(end.getUTCDate() + 1);
  return end;
};

export const validateAnalyticsQueryParams = (searchParams: URLSearchParams): AnalyticsQueryParams => {
  const restaurantSlug = searchParams.get('restaurantSlug')?.trim() ?? '';
  const from = searchParams.get('from')?.trim() ?? '';
  const to = searchParams.get('to')?.trim() ?? '';
  const rawGroupBy = searchParams.get('groupBy')?.trim() ?? 'day';

  if (!restaurantSlug) {
    throw new Error('restaurantSlug is required.');
  }

  if (!from || !to) {
    throw new Error('from and to are required.');
  }

  if (rawGroupBy !== 'day' && rawGroupBy !== 'week') {
    throw new Error('groupBy must be either day or week.');
  }

  const fromDate = parseIsoDay(from, 'from');
  const toDate = parseIsoDay(to, 'to');

  if (toDate < fromDate) {
    throw new Error('to must be greater than or equal to from.');
  }

  return {
    restaurantSlug,
    from,
    to,
    groupBy: rawGroupBy,
    fromDate,
    toDate,
  };
};

export const getWeekBucketStart = (day: Date) => {
  const bucket = new Date(day);
  const dayOfWeek = bucket.getUTCDay();
  const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  bucket.setUTCDate(bucket.getUTCDate() + offset);
  bucket.setUTCHours(0, 0, 0, 0);
  return bucket;
};
