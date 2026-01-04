import { MetadataRoute } from 'next';
import { getAllPosts, getAllCategories } from '@/lib/mdx';
import { slugify } from '@/lib/utils';

export default function sitemap(): MetadataRoute.Sitemap {
    const posts = getAllPosts();
    const categories = getAllCategories();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourwebsite.com';

    const postUrls = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    const categoryUrls = categories.map((cat) => ({
        url: `${baseUrl}/blog/category/${slugify(cat)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...postUrls,
        ...categoryUrls,
    ];
}
