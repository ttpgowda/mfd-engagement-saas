import { Template } from '@/services/templateService';
import { Phone, Mail, Globe, MapPin } from 'lucide-react';

interface InfographicLayoutProps {
    template: Template;
}

export function InfographicLayout({ template }: InfographicLayoutProps) {
    const data = template.templateData || {};
    const points = (data.points as any[]) || [];
    const title = (data.title as string) || template.name;

    return (
        <div
            className="w-full h-full bg-white flex flex-col relative overflow-hidden"
            style={{ fontFamily: template.fontFamily || 'Inter' }}
        >
            {/* Header */}
            <div className="p-8 flex justify-between items-center">
                {template.logoUrl ? (
                    <img src={template.logoUrl} alt="Logo" className="h-12 object-contain" />
                ) : (
                    <div className="text-xl font-bold text-slate-800">{template.companyName}</div>
                )}
                {/* Right side logo or branding if needed */}
                <div className="text-right">
                    <h2 className="text-xl font-bold" style={{ color: template.primaryColor || '#1e3a8a' }}>
                        MutualFund<span style={{ color: template.secondaryColor || '#f97316' }}>Tools</span>
                    </h2>
                    <p className="text-xs text-gray-500">www.mutualfundtools.com</p>
                </div>
            </div>

            {/* Title */}
            <div className="px-8 mb-6">
                <h1 className="text-4xl font-black uppercase text-slate-800 leading-tight">
                    {title}
                </h1>
            </div>

            {/* Content Body */}
            <div className="flex-1 px-8 flex flex-col gap-6 relative z-10">
                {points.length > 0 ? (
                    points.map((point, index) => (
                        <div key={index} className="flex gap-3 items-start">
                            <div className="mt-1.5 min-w-[12px] h-[12px] rotate-45"
                                style={{ backgroundColor: template.secondaryColor || '#f97316' }} />
                            <div>
                                <span className="font-bold text-lg text-slate-800">
                                    {point.title} {point.title && point.description && '–'}
                                </span>
                                <span className="text-lg text-slate-700 ml-1">
                                    {point.description}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-400 italic">No points added. Edit template to add points.</div>
                )}
            </div>

            {/* Illustration Area (Bottom Right) */}
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 pointer-events-none">
                {/* Placeholder for illustration */}
                <img
                    src={data.illustrationUrl || "https://placehold.co/600x400/png"}
                    alt="Illustration"
                    className="w-full h-full object-contain object-bottom-right opacity-90"
                />
            </div>

            {/* Footer / Contact */}
            <div className="mt-auto p-8 bg-slate-100/50 backdrop-blur-sm relative z-20">
                <div className="flex flex-col gap-2 text-slate-700">
                    {template.phone && (
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-full text-white" style={{ backgroundColor: template.primaryColor || '#1e3a8a' }}>
                                <Phone size={14} />
                            </div>
                            <span className="font-medium">{template.phone}</span>
                        </div>
                    )}
                    {template.email && (
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-full text-white" style={{ backgroundColor: template.primaryColor || '#1e3a8a' }}>
                                <Mail size={14} />
                            </div>
                            <span className="font-medium">{template.email}</span>
                        </div>
                    )}
                    {template.website && (
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-full text-white" style={{ backgroundColor: template.primaryColor || '#1e3a8a' }}>
                                <Globe size={14} />
                            </div>
                            <span className="font-medium">{template.website}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Decorative Dots */}
            <div className="absolute top-1/3 right-4 flex flex-col gap-1">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                ))}
            </div>
        </div>
    );
}
