import { HelmetProvider, Helmet } from "react-helmet-async";

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: "website" | "article";
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    tags?: string[];
}

function getSiteUrl(): string {
    const configured = import.meta.env.VITE_SITE_URL as string | undefined;
    if (configured) return configured.replace(/\/$/, "");
    if (typeof window === "undefined") return "";
    return window.location.origin;
}

function toAbsoluteUrl(value: string, siteUrl: string): string {
    if (!value) return value;
    if (/^https?:\/\//i.test(value)) return value;
    if (!siteUrl) return value;
    return `${siteUrl}${value.startsWith("/") ? value : `/${value}`}`;
}

const defaultMeta = {
    siteName: (import.meta.env.VITE_SITE_NAME as string | undefined) || "Wavelength",
    title:
        (import.meta.env.VITE_DEFAULT_TITLE as string | undefined) ||
        "Wavelength - Personal Blog",
    description:
        (import.meta.env.VITE_DEFAULT_DESCRIPTION as string | undefined) ||
        "Personal blog about web development, technology, and building things.",
    image:
        (import.meta.env.VITE_DEFAULT_OG_IMAGE as string | undefined) ||
        "/logo.png",
    url: getSiteUrl(),
};

export function SEO({
    title,
    description,
    image,
    url,
    type = "website",
    author,
    publishedTime,
    modifiedTime,
    tags,
}: SEOProps = {}) {
    const siteUrl = defaultMeta.url;
    const currentUrl =
        typeof window !== "undefined" ? `${siteUrl}${window.location.pathname}${window.location.search}` : "";

    const seo = {
        title: title ? `${title} | ${defaultMeta.siteName}` : defaultMeta.title,
        description: description || defaultMeta.description,
        image: toAbsoluteUrl(image || defaultMeta.image, siteUrl),
        url: url || currentUrl || siteUrl,
    };

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{seo.title}</title>
            <meta name="description" content={seo.description} />
            <link rel="canonical" href={seo.url} />

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={seo.title} />
            <meta property="og:description" content={seo.description} />
            <meta property="og:image" content={seo.image} />
            <meta property="og:url" content={seo.url} />
            <meta property="og:site_name" content={defaultMeta.siteName} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={seo.title} />
            <meta name="twitter:description" content={seo.description} />
            <meta name="twitter:image" content={seo.image} />

            {/* Article specific */}
            {type === "article" && author && (
                <meta property="article:author" content={author} />
            )}
            {type === "article" && publishedTime && (
                <meta property="article:published_time" content={publishedTime} />
            )}
            {type === "article" && modifiedTime && (
                <meta property="article:modified_time" content={modifiedTime} />
            )}
            {type === "article" &&
                tags?.map((tag) => (
                    <meta key={tag} property="article:tag" content={tag} />
                ))}

            {/* Additional SEO */}
            <meta name="robots" content="index, follow" />
            <meta name="googlebot" content="index, follow" />
        </Helmet>
    );
}

export { HelmetProvider };
