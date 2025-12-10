import { NextRequest, NextResponse } from 'next/server';
import * as fabric from 'fabric';
import { loadImage } from 'canvas'; // Use node-canvas for image loading

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { width, height, backgroundImage, objects } = body;

        console.log(`Rendering High-Res: ${width}x${height}, Objects: ${objects?.length}`);

        const canvas = new fabric.StaticCanvas(undefined, { width, height });

        // 1. Load Background
        if (backgroundImage) {
            try {
                const img = await loadImage(backgroundImage);
                // Create fabric image from node-canvas Image
                // @ts-ignore - mismatch between node-canvas Image and Fabric expected HTMLImageElement type
                const fabImg = new fabric.Image(img);

                fabImg.scaleToWidth(width);
                fabImg.scaleToHeight(height);
                canvas.backgroundImage = fabImg;
            } catch (err) {
                console.error("Failed to load bg", err);
            }
        }

        // 2. Add Objects
        if (objects && Array.isArray(objects)) {
            for (const obj of objects) {
                if (obj.type === 'text') {
                    const text = new fabric.IText(obj.text, {
                        left: obj.left,
                        top: obj.top,
                        fontSize: obj.fontSize,
                        fill: obj.fill,
                        angle: obj.angle,
                        scaleX: obj.scaleX,
                        scaleY: obj.scaleY
                    });
                    canvas.add(text);
                } else if (obj.type === 'image') {
                    try {
                        const img = await loadImage(obj.url);
                        // @ts-ignore
                        const fabImg = new fabric.Image(img);

                        fabImg.set({
                            left: obj.left,
                            top: obj.top,
                            angle: obj.angle,
                            scaleX: obj.scaleX,
                            scaleY: obj.scaleY,
                        });

                        if (obj.width && obj.height) {
                            fabImg.scaleToWidth(obj.width);
                            fabImg.scaleToHeight(obj.height);
                        }

                        canvas.add(fabImg);
                    } catch (e) {
                        console.error("Failed to load object image", e);
                    }
                }
            }
        }

        canvas.renderAll();

        const dataUrl = canvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 1
        });

        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'image/png',
                'Content-Disposition': 'attachment; filename="render.png"'
            }
        });

    } catch (error) {
        console.error("Render service error:", error);
        return NextResponse.json({ error: "Rendering failed", details: String(error) }, { status: 500 });
    }
}
