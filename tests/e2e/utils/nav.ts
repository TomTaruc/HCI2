import { Page } from '@playwright/test';

// Use the Vite base path for the local dev server
const BASE_PATH = '/HCI2';

export async function navigateTo(page: Page, path: string) {
  // Path should start with a slash, e.g. '/welcome'
  const hashPath = path.startsWith('/') ? path : `/${path}`;
  await page.goto(`${BASE_PATH}/#${hashPath}`);
}

export function getExpectedUrl(path: string) {
  const hashPath = path.startsWith('/') ? path : `/${path}`;
  return `**${BASE_PATH}/#${hashPath}`;
}
