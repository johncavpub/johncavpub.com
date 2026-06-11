const ICON_MAP: Record<string, string> = {
	instagram: "cib:instagram",
	tiktok: "cib:tiktok",
};

/** Map a CMS-entered social link label to an astro-icon name. */
export function socialIconName(label: string | undefined): string {
	if (!label) return "mdi:link-variant";
	const key = label.toLowerCase().replace(/\s+/g, "");
	return ICON_MAP[key] ?? "mdi:link-variant";
}
