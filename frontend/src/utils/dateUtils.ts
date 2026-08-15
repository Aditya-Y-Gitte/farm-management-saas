/**
 * Returns the current date in YYYY-MM-DD format using the local timezone.
 * This prevents the issue where new Date().toISOString() shifts to the previous
 * or next day depending on the user's timezone relative to UTC.
 */
export const getLocalCalendarDate = (date: Date = new Date()): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
