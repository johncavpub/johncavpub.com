const CLOUD_NAME = "dkhct44d3";
const UPLOAD_PREFIX = "/uploads/";

type Crop = "fill" | "fit" | "limit" | "scale" | "thumb";

type Opts = {
	w?: number;
	h?: number;
	c?: Crop;
	g?: "auto" | "face" | "center";
	b?: string;
};

const buildTransform = (opts: Opts) => {
	const parts = ["f_auto", "q_auto"];
	if (opts.w) parts.push(`w_${opts.w}`);
	if (opts.h) parts.push(`h_${opts.h}`);
	if (opts.c) parts.push(`c_${opts.c}`);
	if (opts.g) parts.push(`g_${opts.g}`);
	if (opts.b) parts.push(`b_${opts.b}`);
	return parts.join(",");
};

const toPublicId = (src: string): string | null => {
	if (src.startsWith(UPLOAD_PREFIX)) return src.slice(UPLOAD_PREFIX.length);
	if (src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://")) {
		return null;
	}
	return src;
};

export function imgUrl(src: string, opts: Opts = {}): string {
	if (!src) return "";
	const publicId = toPublicId(src);
	if (publicId === null) return src;
	return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${buildTransform(opts)}/${publicId}`;
}

export function imgSrcset(
	src: string,
	widths: number[],
	opts: Omit<Opts, "w"> = {},
): string | undefined {
	if (!src) return undefined;
	const publicId = toPublicId(src);
	if (publicId === null) return undefined;
	return widths
		.map(
			(w) =>
				`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${buildTransform({ ...opts, w })}/${publicId} ${w}w`,
		)
		.join(", ");
}
