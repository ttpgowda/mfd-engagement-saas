import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define the Content Directory
const contentDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    category: string;
    tags: string[];
    description: string;
    content: string;
}

export function getAllPosts(): BlogPost[] {
    // Ensure directory exists
    if (!fs.existsSync(contentDirectory)) {
        return [];
    }

    // Recursive function to find all mdx files in subdirectories
    const getFiles = (dir: string): string[] => {
        const files = fs.readdirSync(dir);
        let allFiles: string[] = [];

        files.forEach(file => {
            const filePath = path.join(dir, file);
            if (fs.statSync(filePath).isDirectory()) {
                allFiles = [...allFiles, ...getFiles(filePath)];
            } else if (file.endsWith('.mdx') || file.endsWith('.md')) {
                allFiles.push(filePath);
            }
        });

        return allFiles;
    };

    const files = getFiles(contentDirectory);

    const posts = files.map((filePath) => {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        // Create slug from file path relative to content directory
        // e.g., content/blog/category/post.mdx -> category/post
        const relativePath = path.relative(contentDirectory, filePath);
        const slug = relativePath.replace(/\.mdx?$/, '').replace(/\\/g, '/');

        return {
            slug,
            title: data.title,
            date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
            category: data.category || 'Uncategorized',
            tags: data.tags || [],
            description: data.description || '',
            content,
        };
    });

    // Sort posts by date
    return posts.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
}

export function getPostBySlug(slug: string): BlogPost | null {
    const allPosts = getAllPosts();
    return allPosts.find((post) => post.slug === slug) || null;
}

export function getRelatedPosts(currentPost: BlogPost, limit = 3): BlogPost[] {
    const allPosts = getAllPosts().filter(p => p.slug !== currentPost.slug);

    // Simple rudimentary relevance score
    const scoredPosts = allPosts.map(post => {
        let score = 0;
        if (post.category === currentPost.category) score += 5;
        const sharedTags = post.tags.filter(tag => currentPost.tags.includes(tag));
        score += sharedTags.length * 2;
        return { post, score };
    });

    return scoredPosts
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(p => p.post);
}

export function getAllCategories(): string[] {
    const posts = getAllPosts();
    const categories = new Set(posts.map(post => post.category));
    return Array.from(categories);
}
