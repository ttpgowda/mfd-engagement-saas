import { getAllPosts, getAllCategories } from '@/lib/mdx';
import Link from 'next/link';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import { slugify } from '@/lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    const categories = getAllCategories();
    return categories.map((cat) => ({
        slug: slugify(cat),
    }));
}

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params;
    const categories = getAllCategories();
    // Find category by matching slugified version
    const category = categories.find((cat) => slugify(cat) === slug);

    if (!category) {
        notFound();
    }

    const posts = getAllPosts().filter((post) => post.category === category);

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
                <Link href="/blog" className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500 mb-4 inline-flex items-center gap-1">
                    <ArrowLeft className="h-4 w-4" /> All Articles
                </Link>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl capitalize">
                    {category}
                </h1>
                <p className="mt-4 text-lg text-gray-500">
                    {posts.length} articles found
                </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <article key={post.slug} className="flex flex-col items-start bg-white rounded-2xl p-6 shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-md">
                        <div className="flex items-center gap-x-4 text-xs w-full mb-4">
                            <time dateTime={post.date} className="text-gray-500">
                                {format(new Date(post.date), 'MMM d, yyyy')}
                            </time>
                            <span className="relative z-10 rounded-full bg-indigo-50 px-3 py-1.5 font-medium text-indigo-700">
                                {post.category}
                            </span>
                        </div>
                        <div className="group relative flex-1">
                            <h3 className="text-lg font-semibold leading-6 text-gray-900 group-hover:text-indigo-600 transition-colors">
                                <Link href={`/blog/${post.slug}`}>
                                    <span className="absolute inset-0" />
                                    {post.title}
                                </Link>
                            </h3>
                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                                {post.description}
                            </p>
                        </div>
                        <div className="mt-6 flex items-center gap-x-2 text-sm font-semibold leading-6 text-indigo-600">
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
