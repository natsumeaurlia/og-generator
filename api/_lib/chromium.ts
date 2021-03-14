import core from 'puppeteer-core';
import { getOptions } from './options';
import { FileType } from './types';

async function getPage(isDev: boolean) {
    const options = await getOptions(isDev);
    const browser = await core.launch(options);
    return await browser.newPage();
}

export async function getScreenshot(html: string, type: FileType, isDev: boolean) {
    const page = await getPage(isDev);
    await page.setViewport({ width: 2048, height: 1170 });
    await page.setContent(html, { timeout: 0, waitUntil: ['load', 'networkidle0'] });
    await page.waitFor(200);
    if (await page.$('.svg-loading')) {
        await page.waitFor(500);
    }
    const file = await page.screenshot({ type });
    return file;
};