import Link from 'next/link';
import { getAllPosts } from '@/lib/mdx';
import { format } from 'date-fns';
import { slugify } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export default function BlogIndex() {
    const posts = getAllPosts();

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
                    Wealth Insights
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
                    Clear, practical guidance for your financial journey in India.
                </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <article key={post.slug} className="flex flex-col items-start bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 transition-shadow hover:shadow-md">
                        <div className="flex items-center gap-x-4 text-xs w-full mb-4">
                            <time dateTime={post.date} className="text-gray-500 dark:text-gray-400">
                                {format(new Date(post.date), 'MMM d, yyyy')}
                            </time>
                            <Link
                                href={`/blog/category/${slugify(post.category)}`}
                                className="relative z-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 font-medium text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                            >
                                {post.category}
                            </Link>
                        </div>
                        <div className="group relative flex-1">
                            <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                <Link href={`/blog/${post.slug}`}>
                                    <span className="absolute inset-0" />
                                    {post.title}
                                </Link>
                            </h3>
                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                                {post.description}
                            </p>
                        </div>
                        <div className="mt-6 flex items-center gap-x-2 text-sm font-semibold leading-6 text-indigo-600 dark:text-indigo-400">
                            <Link href={`/blog/${post.slug}`} className="flex items-center gap-1 group-hover:gap-2 transition-all">
                                Read more <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
