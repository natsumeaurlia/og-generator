import { IncomingMessage } from 'http';
import { parse } from 'url';
import { ParsedRequest } from './types';

export function parseRequest(req: IncomingMessage) {
    console.log('HTTP ' + req.url);
    const { pathname, query } = parse(req.url || '/', true);
    const { fontSize, fontWeight, md, background, fontColor, icons, iconSize, isHtml } = (query || {});

    if (Array.isArray(fontSize)) {
        throw new Error('Expected a single fontSize');
    }

    if (Array.isArray(fontColor)) {
        throw new Error('Expected a single fontColor');
    }

    if (Array.isArray(background)) {
        throw new Error('Expected a single background');
    }

    if (Array.isArray(fontWeight)) {
        throw new Error('Expected a single background');
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
        isHtml: Boolean(isHtml),
        fileType: extension === 'jpeg' ? extension : 'png',
        text: decodeURIComponent(text),
        md: md === '1' || md === 'true',
        fontSize: fontSize || '96px',
        background: decodeURIComponent(background),
        fontColor: fontColor,
        icons: getArray(icons),
        iconSize: getArray(iconSize),
        fontWeight: fontWeight
    };
    return parsedRequest;
}

function getArray(stringOrArray: string[] | string | undefined): string[] {
    if (typeof stringOrArray === 'undefined') {
        return [];
    } else if (Array.isArray(stringOrArray)) {
        return stringOrArray.map((a) => {
            return decodeURIComponent(a);
        })
    } else {
        return [decodeURIComponent(stringOrArray)];
    }
}
