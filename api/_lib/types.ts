export type FileType = 'png' | 'jpeg';
export type Theme = 'light' | 'dark';

export interface ParsedRequest {
    isHtml: boolean;
    fileType: FileType;
    text: string;
    md: boolean;
    fontSize: string;
    fontColor? : string;
    background?: string;
    icons: string[];
    iconSize: string[];
    fontWeight: string;
}
