import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

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
		draft: z.boolean().optional(),
		amazon_url: z.string().url().optional(),
		barnes_noble_url: z.string().url().optional(),
	}),
});

const site = defineCollection({
	loader: file("src/content/site.yml"),
	schema: z.object({
		author_name: z.string(),
		site_tagline: z.string(),
		author_headshot_image: z.string().optional(),
		author_bio: z.string().optional(),
		social_links: z
			.array(z.object({ label: z.string(), url: z.string().url() }))
			.optional(),
		redbubble_url: z.string().url().optional(),
		newsletter_url: z.string().url().optional(),
		contact_email: z.string().email(),
		contact_page_intro: z.string().optional(),
		contact_page_body: z.string().optional(),
		contact_response_time: z.string().optional(),
	}),
});

const events = defineCollection({
	loader: file("src/content/events.yml"),
	schema: z.array(
		z.object({
			title: z.string(),
			date: z.string(),
			location: z.string(),
			address: z.string().optional(),
			time: z.string().optional(),
			url: z.string().url().optional(),
			description: z.string().optional(),
		})
	),
});

const testimonials = defineCollection({
	loader: file("src/content/testimonials.yml"),
	schema: z.array(
		z.object({
			quote: z.string(),
			author: z.string(),
			role: z.string().optional(),
			source: z.string().optional(),
		})
	),
});

export const collections = { books, site, events, testimonials };
