import { AdminTemplateUpload } from '@/components/admin/template-upload-wizard';

export default function EditTemplatePage({ params }: { params: { id: string } }) {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Edit Marketing Template</h1>
            <AdminTemplateUpload templateId={parseInt(params.id)} />
        </div>
    );
}
