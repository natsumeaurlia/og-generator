import { IncomingMessage } from 'http';
import { parse } from 'url';
import { ParsedRequest, Position } from './types';

export function parseRequest(req: IncomingMessage) {
    console.log('HTTP ' + req.url);
    const { pathname, query } = parse(req.url || '/', true);
    const { fontSize, md, background, fontColor, images, widths, heights} = (query || {});
    let { align } = (query || {});

    if (Array.isArray(fontSize) || Array.isArray(align) || Array.isArray(fontColor) || Array.isArray(background)) {
        throw new Error('Expected a single fontSize');
    }

    if (align !== 'center' && align !== 'left' && align !== 'right') {
        align = 'center';
    }

    const arr = (pathname || '/').slice(1).split('.');
    let extension = '';
    let text = '';
    if (arr.length === 0) {
        text = '';
    } else if (arr.length === 1) {
        text = arr[0];
    } else {
        extension = arr.pop() as string;
        text = arr.join('.');
    }

    const parsedRequest: ParsedRequest = {
        fileType: extension === 'jpeg' ? extension : 'png',
        text: decodeURIComponent(text),
        md: md === '1' || md === 'true',
        fontSize: fontSize || '96px',
        background: decodeURIComponent(background),
        fontColor: fontColor,
        align: align as Position,
        images: getArray(images),
        widths: getArray(widths),
        heights: getArray(heights),
    };
    return parsedRequest;
}

function getArray(stringOrArray: string[] | string | undefined): string[] {
    if (typeof stringOrArray === 'undefined') {
        return [];
    } else if (Array.isArray(stringOrArray)) {
        return stringOrArray;
    } else {
        return [stringOrArray];
    }
}
