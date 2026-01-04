import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/mdx';
import Link from 'next/link';
import { format } from 'date-fns';
import { TableOfContents } from '@/components/TableOfContents';
import rehypeSlug from 'rehype-slug';
import { slugify } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
    params: Promise<{
        slug: string[];
    }>;
}

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug.split('/'),
    }));
}

export default async function BlogPost({ params }: PageProps) {
    const { slug } = await params;
    const slugString = slug.join('/');
    const post = getPostBySlug(slugString);

    if (!post) {
        notFound();
    }

    // Extract headings for TOC
    const headings = post.content
        .split('\n')
        .filter((line) => line.match(/^##\s/) || line.match(/^###\s/))
        .map((line) => {
            const level = line.startsWith('###') ? 3 : 2;
            const text = line.replace(/^#+\s/, '');
            return { text, level };
        });

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <Link href="/blog" className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500 mb-8 inline-flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Link>

            <header className="mb-12 max-w-3xl">
                <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                        {post.category}
                    </span>
                    <time dateTime={post.date} className="text-sm text-gray-500">
                        {format(new Date(post.date), 'MMMM d, yyyy')}
                    </time>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
                    {post.title}
                </h1>
                <p className="text-xl text-gray-600">
                    {post.description}
                </p>
            </header>

            <div className="lg:grid lg:grid-cols-4 lg:gap-12">

                <article className="lg:col-span-3 prose prose-lg prose-indigo max-w-none dark:prose-invert">
                    <MDXRemote
                        source={post.content}
                        options={{
                            mdxOptions: {
                                rehypePlugins: [rehypeSlug],
                            }
                        }}
                    />
                </article>

                <TableOfContents headings={headings} />
            </div>

            {/* Recommendation Engine */}
            <div className="mt-16 border-t border-gray-100 pt-16 max-w-3xl">
                <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">
                    Recommended for You
                </h3>
                <div className="grid gap-8 sm:grid-cols-2">
                    {getRelatedPosts(post).map((relatedPost) => (
                        <article key={relatedPost.slug} className="flex flex-col items-start bg-white rounded-2xl p-6 shadow-sm ring-1 ring-gray-200">
                            <div className="flex items-center gap-x-4 text-xs">
                                <time dateTime={relatedPost.date} className="text-gray-500">
                                    {format(new Date(relatedPost.date), 'MMM d, yyyy')}
                                </time>
                                <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                                    {relatedPost.category}
                                </span>
                            </div>
                            <div className="group relative">
                                <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                                    <Link href={`/blog/${relatedPost.slug}`}>
                                        <span className="absolute inset-0" />
                                        {relatedPost.title}
                                    </Link>
                                </h3>
                                <p className="mt-5 line-clamp-2 text-sm leading-6 text-gray-600">
                                    {relatedPost.description}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}
