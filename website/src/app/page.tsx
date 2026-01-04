import Link from "next/link";
import { ArrowRight, TrendingUp, ShieldCheck, Banknote } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">
              Master Your Financial Destiny
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Expert guidance on Mutual Funds, SIPs, and Tax Planning tailored for the Indian investor. Build wealth with confidence.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/blog"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex items-center gap-2"
              >
                Read the Blog <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#features" className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div id="features" className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Why Us?</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            Investing made simple, not scary.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3">
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                  <TrendingUp className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Data-Backed Strategies
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                No guesswork. We use historical data and proven financial models to guide your decisions.
              </dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                  <ShieldCheck className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Unbiased Advice
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                We prioritize your financial health over commissions. Pure, educational content.
              </dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                  <Banknote className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Tax Efficient
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                Learn how to save tax u/s 80C and manage capital gains effectively.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
