
import { Metadata } from 'next';
import { Mail, MapPin, Phone, MessageSquare, Clock } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Contact Us - Wealth Insights',
    description: 'Get in touch with the Wealth Insights team. Whether you need support, have feedback, or want to schedule a meeting in Bengaluru, we are here to assist you on your financial journey.'
};

export default function ContactPage() {
    return (
        <div className="bg-white isolate">
            {/* Header */}
            <div className="bg-slate-900 py-24 sm:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2874&q=80')] opacity-10 bg-cover bg-center" />
                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Let&#39;s Connect</h2>
                        <p className="mt-6 text-lg leading-8 text-gray-300">
                            Whether you have a question about our tools, need support, or just want to say hello, we are here for you.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-6 lg:px-8 -mt-12 sm:-mt-16 pb-24 relative z-10">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                    {/* Email Card */}
                    <div className="flex flex-col rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-900/10 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50">
                            <Mail className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                        </div>
                        <h3 className="mt-6 text-base font-bold leading-7 text-gray-900">Email Us</h3>
                        <p className="mt-2 text-base leading-7 text-gray-600 flex-grow">
                            For general inquiries, feedback, and support. We typically respond within 24 hours.
                        </p>
                        <a href="mailto:info@thewealthweb.in" className="mt-8 text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500 flex items-center gap-2">
                            info@thewealthweb.in <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>

                    {/* Office Card */}
                    <div className="flex flex-col rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-900/10 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50">
                            <MapPin className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                        </div>
                        <h3 className="mt-6 text-base font-bold leading-7 text-gray-900">Meet Us</h3>
                        <p className="mt-2 text-base leading-7 text-gray-600 flex-grow">
                            We don't have a physical office yet, but we are available to meet in Bengaluru or virtually.
                        </p>
                        <div className="mt-4 not-italic text-sm text-gray-600">
                            Bengaluru, Karnataka<br />
                            India
                        </div>
                        <a href="mailto:info@thewealthweb.in?subject=Meeting Request" className="mt-4 text-sm font-semibold leading-6 text-emerald-600 hover:text-emerald-500 flex items-center gap-2">
                            Request Meeting <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>

                    {/* Phone Card */}
                    <div className="flex flex-col rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-900/10 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                            <Phone className="h-6 w-6 text-blue-600" aria-hidden="true" />
                        </div>
                        <h3 className="mt-6 text-base font-bold leading-7 text-gray-900">Call Us</h3>
                        <p className="mt-2 text-base leading-7 text-gray-600 flex-grow">
                            Mon-Fri from 9am to 6pm. We are available for urgent inquiries.
                        </p>
                        <a href="tel:+919876543210" className="mt-8 text-sm font-semibold leading-6 text-blue-600 hover:text-blue-500 flex items-center gap-2">
                            +91 (987) 654-3210 <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                </div>

                <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* FAQ Section */}
                    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-indigo-600" /> Frequently Asked
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-gray-900">Are the tools free?</h4>
                                <p className="text-sm text-gray-600 mt-1">Yes, all our calculators and surveys are completely free to use.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Can I request a new feature?</h4>
                                <p className="text-sm text-gray-600 mt-1">Absolutely! Send us an email with your suggestions.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Are you SEBI registered?</h4>
                                <p className="text-sm text-gray-600 mt-1">We are a platform for tools and education. Our "Spot a Scam" tools are aligned with SEBI guidelines, but we ourselves are a tech provider.</p>
                            </div>
                        </div>
                    </div>

                    {/* Office Hours */}
                    <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
                        <div className="absolute right-0 top-0 opacity-10">
                            <Clock className="w-40 h-40 -mr-10 -mt-10" />
                        </div>
                        <h3 className="text-xl font-bold mb-6 relative z-10">Office Hours</h3>
                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                <span>Monday - Friday</span>
                                <span className="font-mono text-indigo-300">9:00 AM - 6:00 PM</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                <span>Saturday</span>
                                <span className="font-mono text-indigo-300">10:00 AM - 2:00 PM</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span>Sunday</span>
                                <span className="text-red-300 font-semibold">Closed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
