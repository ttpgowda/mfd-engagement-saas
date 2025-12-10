import { Template } from '@/services/templateService';

interface GenericLayoutProps {
    template: Template;
}

export function GenericLayout({ template }: GenericLayoutProps) {
    return (
        <div
            className="w-full h-full relative overflow-hidden"
            style={{
                background: `linear-gradient(135deg, ${template.primaryColor || '#3b82f6'}, ${template.secondaryColor || '#8b5cf6'})`,
                fontFamily: template.fontFamily || 'Inter',
            }}
        >
            {/* Content Overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
                {/* Header / Logo */}
                <div className="flex justify-between items-start">
                    {template.logoUrl ? (
                        <img
                            src={template.logoUrl}
                            alt="Logo"
                            className="h-16 object-contain bg-white/10 rounded p-2 backdrop-blur-sm"
                        />
                    ) : (
                        <div className="text-2xl font-bold bg-white/10 px-4 py-2 rounded backdrop-blur-sm">
                            {template.companyName || 'Company Name'}
                        </div>
                    )}
                    <div className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                        {template.category.replace('_', ' ')}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4 my-8">
                    <h1 className="text-4xl font-bold drop-shadow-md">
                        {template.name}
                    </h1>
                    {template.description && (
                        <p className="text-xl opacity-90 max-w-md drop-shadow-sm">
                            {template.description}
                        </p>
                    )}
                </div>

                {/* Footer / Contact Info */}
                <div className="bg-black/20 -mx-8 -mb-8 p-6 backdrop-blur-md">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        {template.companyName && (
                            <div className="font-semibold text-lg col-span-2">
                                {template.companyName}
                            </div>
                        )}
                        <div className="space-y-1">
                            {template.phone && <div>📞 {template.phone}</div>}
                            {template.email && <div>✉️ {template.email}</div>}
                        </div>
                        <div className="space-y-1 text-right">
                            {template.website && <div>🌐 {template.website}</div>}
                            {template.address && <div>📍 {template.address}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
