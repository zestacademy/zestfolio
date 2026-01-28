import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ templateId: string }> }
) {
    const { templateId } = await params;

    try {
        // Validate template ID
        if (!templateId || !templateId.match(/^template\d{2}$/)) {
            return new NextResponse('Invalid template ID', { status: 400 });
        }

        // Load template HTML
        const templatePath = path.join(process.cwd(), 'portfolio_templates', templateId, 'index.html');

        if (!fs.existsSync(templatePath)) {
            return new NextResponse(`Template ${templateId} not found`, { status: 404 });
        }

        const htmlContent = fs.readFileSync(templatePath, 'utf8');

        // Return the raw HTML for preview
        return new NextResponse(htmlContent, {
            headers: {
                'Content-Type': 'text/html',
            },
        });

    } catch (error) {
        console.error('Error loading template preview:', error);
        return new NextResponse(`Error: ${error}`, { status: 500 });
    }
}
