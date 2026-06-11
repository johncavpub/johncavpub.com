import type { CollectionEntry } from "astro:content";

export type Book = CollectionEntry<"books">;

export interface OrderedBook {
	book: Book;
	/** True when the publish date is in the future. */
	comingSoon: boolean;
}

/**
 * Order books for display: released titles newest-first, then
 * upcoming titles soonest-first. Used by the homepage grid and the
 * books index so the two always agree.
 */
export function orderBooks(books: Book[], now = Date.now()): OrderedBook[] {
	const annotated = books.map((book) => {
		const ts = book.data.publish_date
			? Date.parse(book.data.publish_date)
			: null;
		return { book, ts: ts ?? 0, comingSoon: ts !== null && ts > now };
	});

	const released = annotated
		.filter((b) => !b.comingSoon)
		.sort((a, b) => b.ts - a.ts);
	const upcoming = annotated
		.filter((b) => b.comingSoon)
		.sort((a, b) => a.ts - b.ts);

	return [...released, ...upcoming].map(({ book, comingSoon }) => ({
		book,
		comingSoon,
	}));
}
