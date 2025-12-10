import { AdminTemplateUpload } from '@/components/admin/template-upload-wizard';

export default function CreateTemplatePage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Create Marketing Template</h1>
            <AdminTemplateUpload />
        </div>
    );
}
