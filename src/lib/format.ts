const STYLES = {
	/** "June 11, 2026" — book detail pages, book lists, next-event card */
	long: { year: "numeric", month: "long", day: "numeric" },
	/** "Jun 11, 2026" — compact event rows */
	short: { year: "numeric", month: "short", day: "numeric" },
	/** "June 2026" — book grid captions */
	monthYear: { year: "numeric", month: "long" },
} satisfies Record<string, Intl.DateTimeFormatOptions>;

export type DateStyle = keyof typeof STYLES;

/**
 * Format a date string for display. Dates are stored as plain
 * YYYY-MM-DD strings, so always format in UTC to avoid the date
 * shifting by a day in other timezones.
 */
export function formatDate(
	date: string | Date | null | undefined,
	style: DateStyle = "long",
): string | null {
	if (!date) return null;
	return new Date(date).toLocaleDateString("en-US", {
		...STYLES[style],
		timeZone: "UTC",
	});
}
