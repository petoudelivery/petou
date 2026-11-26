import type { MetadataRoute } from "next";
import { DEMO_PRODUCTS } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://petou.com.br";
  const now = new Date();

  // Core static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/busca`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // Category pages
  const categories = [
    "racoes-para-caes",
    "racoes-para-gatos",
    "petiscos",
    "brinquedos",
    "higiene",
    "acessorios",
  ];

  for (const cat of categories) {
    routes.push({
      url: `${baseUrl}/categoria/${cat}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // Demo product routes
  for (const prod of DEMO_PRODUCTS) {
    routes.push({
      url: `${baseUrl}/produto/${prod.id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  return routes;
}
