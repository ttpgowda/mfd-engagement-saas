
import { Metadata } from 'next';
import { Mail, MapPin, Phone } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Contact Us - Wealth Insights',
    description: 'Get in touch with the Wealth Insights team. Whether you need support, have feedback, or want to schedule a meeting in Bengaluru, we are here to assist you on your financial journey.'
};

export default function ContactPage() {
    return (
        <div className="bg-white dark:bg-black transition-colors min-h-screen">
            {/* Header */}
            <div className="bg-slate-900 py-24 sm:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2874&q=80')] opacity-10 bg-cover bg-center" />
                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Get in touch</h2>
                        <p className="mt-6 text-lg leading-8 text-indigo-100">
                            We'd love to hear from you. Our team is always here to chat.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-6 lg:px-8 -mt-12 sm:-mt-16 pb-24 relative z-10">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                    {/* Email Card */}
                    <div className="flex flex-col bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 h-full transition-all duration-300">
                        <div className="flex-none p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg w-fit text-indigo-600 dark:text-indigo-400">
                            <Mail className="h-6 w-6" />
                        </div>
                        <h3 className="mt-6 text-base font-bold leading-7 text-gray-900 dark:text-gray-100">Email Us</h3>
                        <p className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300 flex-grow">
                            For support, feedback, or inquiries.
                        </p>
                        <a href="mailto:info@thewealthweb.in" className="mt-4 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                            people@thewealthweb.in <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>

                    {/* Office Card */}
                    <div className="flex flex-col bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 h-full hover:shadow-lg transition-all duration-300">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                            <MapPin className="h-6 w-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                        </div>
                        <h3 className="mt-6 text-base font-bold leading-7 text-gray-900 dark:text-gray-100">Meet Us</h3>
                        <p className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300 flex-grow">
                            We don't have a physical office yet, but we are available to meet in Bengaluru or virtually.
                        </p>
                        <div className="mt-4 not-italic text-sm text-gray-600 dark:text-gray-400">
                            Bengaluru, Karnataka<br />
                            India
                        </div>
                        <a href="mailto:info@thewealthweb.in?subject=Meeting Request" className="mt-4 text-sm font-semibold leading-6 text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-2">
                            Request Meeting <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>

                    {/* Phone Card */}
                    <div className="flex flex-col bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 h-full hover:shadow-lg transition-all duration-300">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30">
                            <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                        </div>
                        <h3 className="mt-6 text-base font-bold leading-7 text-gray-900 dark:text-gray-100">Call Us</h3>
                        <p className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300 flex-grow">
                            Mon-Fri from 9am to 6pm. We are available for urgent inquiries.
                        </p>
                        <a href="tel:+919876543210" className="mt-8 text-sm font-semibold leading-6 text-blue-600 dark:text-blue-400 hover:text-blue-500 flex items-center gap-2">
                            +91 (987) 654-3210 <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
