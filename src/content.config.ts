import { defineCollection, z } from 'astro:content';

const books = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		cover_image: z.string().optional(),
		publish_date: z
			.union([z.string(), z.date()])
			.transform((v) =>
				v instanceof Date ? v.toISOString().slice(0, 10) : v
			)
			.optional(),
		highlight: z.boolean().optional(),
		amazon_url: z.string().url(),
		barnes_noble_url: z.string().url(),
	}),
});

const pages = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		intro: z.string().optional(),
		redbubble_url: z.string().url().optional(),
		newsletter_url: z.string().url().optional(),
		headshot_image: z.string().optional(),
		socials: z
			.array(
				z.object({
					label: z.string(),
					url: z.string().url(),
				})
			)
			.optional(),
	}),
});

const events = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		date: z.string(),
		location: z.string(),
		address: z.string().optional(),
		time: z.string().optional(),
		url: z.string().url().optional(),
		description: z.string().optional(),
	}),
});

const testimonials = defineCollection({
	type: 'content',
	schema: z.object({
		quote: z.string(),
		author: z.string(),
		role: z.string().optional(),
		source: z.string().optional(),
	}),
});

const contact = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		intro: z.string(),
		email: z.string().email(),
		response_time: z.string().optional(),
	}),
});

export const collections = { books, pages, events, testimonials, contact };
