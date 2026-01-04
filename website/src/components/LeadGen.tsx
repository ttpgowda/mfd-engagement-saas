import Link from 'next/link';

export function LeadGen() {
    return (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 my-8 not-prose">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-indigo-900">
                        Need Expert Financial Advice?
                    </h3>
                    <p className="text-sm text-indigo-700">
                        Get a personalized portfolio review tailored to your life goals.
                    </p>
                </div>
                <Link
                    href="https://your-main-saas-url.com/contact"
                    className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Book Free Review
                </Link>
            </div>
        </div>
    );
}
