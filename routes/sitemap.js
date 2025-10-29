import express from "express";
import Listing from "../models/Listing.js";
import Blog from "../models/Blog.js";

const router = express.Router();

router.get("/sitemap.xml", async (req, res) => {
    try {
        const baseUrl = "https://www.sierracatalogue.com";

        // Fetch only necessary fields for efficiency
        const [listings, blogs] = await Promise.all([
            Listing.find({ isActive: true }).select("_id updatedAt"),
            Blog.find({ isPublished: true }).select("_id updatedAt"),
        ]);

        // Core static routes (homepage, shop, blog, contact, etc.)
        const staticUrls = [
            { loc: `${baseUrl}/`, changefreq: "daily", priority: "1.0" },
            { loc: `${baseUrl}/shop`, changefreq: "daily", priority: "0.9" },
            { loc: `${baseUrl}/blog`, changefreq: "weekly", priority: "0.8" },
            { loc: `${baseUrl}/contact`, changefreq: "monthly", priority: "0.5" },
            { loc: `${baseUrl}/faq`, changefreq: "monthly", priority: "0.5" },
            { loc: `${baseUrl}/vendor-guidelines`, changefreq: "yearly", priority: "0.3" },
            { loc: `${baseUrl}/terms-of-service`, changefreq: "yearly", priority: "0.2" },
        ];

        // Dynamic product listings
        const listingUrls = listings.map((item) => ({
            loc: `${baseUrl}/shop/product/${item._id}`,
            lastmod: item.updatedAt?.toISOString(),
            changefreq: "weekly",
            priority: "0.8",
        }));

        // Dynamic blogs
        const blogUrls = blogs.map((post) => ({
            loc: `${baseUrl}/blog/${post._id}`,
            lastmod: post.updatedAt?.toISOString(),
            changefreq: "monthly",
            priority: "0.6",
        }));

        // Merge all URLs
        const urls = [...staticUrls, ...listingUrls, ...blogUrls];

        // Build XML
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                      http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  ${urls
            .map(
                (u) => `<url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
            )
            .join("")}
</urlset>`;

        res.header("Content-Type", "application/xml");
        res.header("Cache-Control", "public, max-age=3600"); // cache for 1h
        res.status(200).send(xml);
    } catch (err) {
        console.error("❌ Error generating sitemap:", err);
        res.status(500).send("Error generating sitemap.");
    }
});

export default router;
