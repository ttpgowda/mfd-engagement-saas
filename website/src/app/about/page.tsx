
import { Metadata } from 'next';
import { Target, Lightbulb, Users, ShieldCheck, TrendingUp, Heart } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About Us - Wealth Insights',
    description: 'Learn more about our mission to democratize financial knowledge.'
};

export default function AboutPage() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
                <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
                    <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
                        <div className="mt-24 sm:mt-32 lg:mt-16">
                            <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
                                Our Vision
                            </span>
                        </div>
                        <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Democratizing <span className="text-indigo-600">Financial Freedom</span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            We believe that smart investing shouldn't be a privilege. We build tools that turn complex financial data into clear, actionable insights for everyone.
                        </p>
                        <div className="mt-10 flex items-center gap-x-6">
                            <a href="/tools" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all">
                                Explore Tools
                            </a>
                            <a href="/contact" className="text-sm font-semibold leading-6 text-gray-900 group">
                                Contact Us <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                            </a>
                        </div>
                    </div>
                    {/* Abstract Visual Shape */}
                    <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
                        <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
                            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                                <div className="rounded-md bg-white p-8 shadow-2xl ring-1 ring-gray-900/10 sm:rounded-xl">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-indigo-50 rounded-lg">
                                            <TrendingUp className="h-8 w-8 text-indigo-600 mb-2" />
                                            <div className="text-2xl font-bold text-gray-900">15+</div>
                                            <div className="text-sm text-gray-600">Calculators</div>
                                        </div>
                                        <div className="p-4 bg-green-50 rounded-lg">
                                            <ShieldCheck className="h-8 w-8 text-green-600 mb-2" />
                                            <div className="text-2xl font-bold text-gray-900">SEBI</div>
                                            <div className="text-sm text-gray-600">Aligned Tools</div>
                                        </div>
                                        <div className="p-4 bg-purple-50 rounded-lg col-span-2">
                                            <Users className="h-8 w-8 text-purple-600 mb-2" />
                                            <div className="text-2xl font-bold text-gray-900">100%</div>
                                            <div className="text-sm text-gray-600">Unbiased Analysis</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 bg-slate-50">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-indigo-600">Why We Exist</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Principles over Profit
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        The financial world is noisy. We act as your signal, providing tools and surveys that help you cut through the clutter.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                        <div className="relative pl-16">
                            <dt className="text-base font-semibold leading-7 text-gray-900">
                                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                    <Target className="h-6 w-6 text-white" aria-hidden="true" />
                                </div>
                                Precision First
                            </dt>
                            <dd className="mt-2 text-base leading-7 text-gray-600">
                                We obsess over the accuracy of our calculators. Whether it's SIP returns or tax implications, our math is rigorous.
                            </dd>
                        </div>
                        <div className="relative pl-16">
                            <dt className="text-base font-semibold leading-7 text-gray-900">
                                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                    <Lightbulb className="h-6 w-6 text-white" aria-hidden="true" />
                                </div>
                                Education Centric
                            </dt>
                            <dd className="mt-2 text-base leading-7 text-gray-600">
                                We don't just give you a number; we explain it. Our goal is to make you a smarter investor with every click.
                            </dd>
                        </div>
                        <div className="relative pl-16">
                            <dt className="text-base font-semibold leading-7 text-gray-900">
                                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                    <ShieldCheck className="h-6 w-6 text-white" aria-hidden="true" />
                                </div>
                                Safety & Trust
                            </dt>
                            <dd className="mt-2 text-base leading-7 text-gray-600">
                                We actively fight scams and misinformation. Our "Spot a Scam" tools are built to protect your hard-earned money.
                            </dd>
                        </div>
                        <div className="relative pl-16">
                            <dt className="text-base font-semibold leading-7 text-gray-900">
                                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                    <Heart className="h-6 w-6 text-white" aria-hidden="true" />
                                </div>
                                Investor First
                            </dt>
                            <dd className="mt-2 text-base leading-7 text-gray-600">
                                We are not a bank. We are a platform built by investors, for investors. Your financial health is our only metric.
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}
