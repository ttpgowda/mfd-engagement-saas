import { Template } from '@/services/templateService';
import { Quote } from 'lucide-react';

interface QuoteLayoutProps {
    template: Template;
}

export function QuoteLayout({ template }: QuoteLayoutProps) {
    const data = template.templateData || {};
    const quote = (data.quote as string) || template.description || "Insert quote here...";
    const author = (data.author as string) || template.name;

    return (
        <div
            className="w-full h-full relative flex flex-col justify-center items-center p-12 text-center"
            style={{
                backgroundColor: template.primaryColor || '#1e293b',
                color: template.secondaryColor || '#ffffff',
                fontFamily: template.fontFamily || 'serif',
            }}
        >
            <Quote size={48} className="mb-6 opacity-50" />

            <blockquote className="text-3xl font-light italic leading-relaxed mb-8">
                "{quote}"
            </blockquote>

            <div className="text-xl font-bold uppercase tracking-widest opacity-80">
                — {author}
            </div>

            {/* Footer Branding */}
            <div className="absolute bottom-6 flex items-center gap-2 opacity-60 text-sm">
                {template.logoUrl && <img src={template.logoUrl} className="h-6" alt="logo" />}
                <span>{template.companyName}</span>
            </div>
        </div>
    );
}
