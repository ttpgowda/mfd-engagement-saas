import { Canvas, Rect, IText, Image } from 'fabric';

export interface ZoneOptions {
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
    fill?: string;
    text?: string;
    fontSize?: number;
    type: 'LOGO' | 'CONTACT_INFO' | 'TEXT';
}

export const initCanvas = (canvasId: string, width: number, height: number, backgroundColor: string = '#f3f4f6') => {
    return new Canvas(canvasId, {
        width,
        height,
        backgroundColor,
        preserveObjectStacking: true, // Selected object stays on top
        selection: true,
    });
};

export const setBackground = (canvas: Canvas, imageUrl: string, width: number, height: number) => {
    return Image.fromURL(imageUrl, { crossOrigin: 'anonymous' }).then((img) => {
        // Scale image to fit canvas or cover
        // For template rendering, we usually want exact fit if canvas dimensions match variant
        img.set({
            originX: 'left',
            originY: 'top',
        });

        // Simple scale to fit logic
        const scaleX = width / img.width!;
        const scaleY = height / img.height!;
        img.scaleX = scaleX;
        img.scaleY = scaleY;

        canvas.backgroundImage = img;
        canvas.requestRenderAll();
    });
};

export const addZoneRect = (canvas: Canvas, options: ZoneOptions) => {
    const rect = new Rect({
        left: options.left,
        top: options.top,
        width: options.width,
        height: options.height,
        fill: options.type === 'LOGO' ? 'rgba(0,0,255,0.2)' : 'rgba(0,255,0,0.2)',
        stroke: options.type === 'LOGO' ? 'blue' : 'green',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        cornerColor: 'blue',
        cornerSize: 10,
        transparentCorners: false,
        // Custom properties
        // @ts-ignore
        id: options.id,
        // @ts-ignore
        zoneType: options.type,
    });

    // Add a label? Fabric doesn't support groups easily for this in v5/6 without Group
    // For now just the rect
    canvas.add(rect);
    canvas.setActiveObject(rect);
    return rect;
};

export const addZoneText = (canvas: Canvas, options: ZoneOptions) => {
    const text = new IText(options.text || 'Text Zone', {
        left: options.left,
        top: options.top,
        fontSize: options.fontSize || 40,
        fill: options.fill || '#000000',
        fontFamily: 'Arial',
        // @ts-ignore
        id: options.id,
        // @ts-ignore
        zoneType: options.type,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    return text;
};

export const serializeCanvas = (canvas: Canvas) => {
    // @ts-ignore
    return canvas.toJSON(['id', 'zoneType']); // Include custom props
};

// --- Relative Coordinate Helpers ---

/**
 * Converts absolute object properties to relative percentages based on canvas size.
 */
export const toPercent = (canvas: Canvas, object: any) => {
    if (!canvas.width || !canvas.height) return object;

    // Calculate centers for safer relative positioning if needed, 
    // but top/left relative to canvas 0,0 is standard for Fabric.
    return {
        left_pct: (object.left / canvas.width) * 100,
        top_pct: (object.top / canvas.height) * 100,
        width_pct: (object.getScaledWidth() / canvas.width) * 100,
        height_pct: (object.getScaledHeight() / canvas.height) * 100,
        angle: object.angle || 0,
        scaleX: object.scaleX || 1, // We might normalize scale if width is relative
        scaleY: object.scaleY || 1
    };
};

/**
 * Converts relative percentages to absolute pixels for the current canvas size.
 */
export const fromPercent = (canvasWidth: number, canvasHeight: number, zoneData: any) => {
    return {
        left: (zoneData.left_pct / 100) * canvasWidth,
        top: (zoneData.top_pct / 100) * canvasHeight,
        // We set width/height. Fabric objects use scale, so we might need to adjust.
        // For simple Rects/Images, setting width/height works if scale is 1.
        width: (zoneData.width_pct / 100) * canvasWidth,
        height: (zoneData.height_pct / 100) * canvasHeight,
    };
};
