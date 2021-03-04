export type FileType = 'png' | 'jpeg';
export type Theme = 'light' | 'dark';

export interface ParsedRequest {
    fileType: FileType;
    text: string;
    md: boolean;
    fontSize: string;
    fontColor?: string;
    background?: string;
    align: Position;
    images: string[];
    widths: string[];
    heights: string[];
}

export type Position = 'center' | 'left' | 'right';