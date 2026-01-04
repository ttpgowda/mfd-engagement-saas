import { MetadataRoute } from 'next';
import { getAllPosts, getAllCategories } from '@/lib/mdx';
import { slugify } from '@/lib/utils';
import { tools } from '@/lib/tools-registry';
import { surveys } from '@/lib/surveys-registry';

export default function sitemap(): MetadataRoute.Sitemap {
    const posts = getAllPosts();
    const categories = getAllCategories();
    // Default to thewealthweb.in if env var not set
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thewealthweb.in';
    const lastModified = new Date();

    // 1. Static Routes
    const staticRoutes = [
        '',
        '/about',
        '/contact',
        '/login',
        '/tools',
        '/surveys',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // 2. Blog Posts
    const postUrls = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // 3. Blog Categories
    const categoryUrls = categories.map((cat) => ({
        url: `${baseUrl}/blog/category/${slugify(cat)}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    // 4. Tools (Calculators)
    const toolUrls = tools.map((tool) => ({
        url: `${baseUrl}/tools/${tool.slug}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.9,
    }));

    // 5. Surveys
    const surveyUrls = surveys.map((survey) => ({
        url: `${baseUrl}/surveys/${survey.slug}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.9,
    }));

    // 6. Blog Index (Specific priority)
    const blogIndex = {
        url: `${baseUrl}/blog`,
        lastModified,
        changeFrequency: 'daily' as const,
        priority: 0.8,
    };

    return [
        ...staticRoutes,
        blogIndex,
        ...toolUrls,
        ...surveyUrls,
        ...postUrls,
        ...categoryUrls,
    ];
}
