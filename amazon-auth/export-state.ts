// ローカルPCで Amazon.co.jp にログインし、ログイン状態（Cookie / localStorage）を
// Playwright の storageState 形式で書き出すスクリプト。
//
// 使い方: pnpm export-state [出力パス]
// 出力ファイルはアカウントを操作できる認証情報そのもの。コミット・共有厳禁。

import { chmod } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';
import { chromium } from 'playwright';

const ORDER_HISTORY_URL = 'https://www.amazon.co.jp/gp/css/order-history';
const outputPath = process.argv[2] ?? 'amazon-state.json';

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({ locale: 'ja-JP', timezoneId: 'Asia/Tokyo' });
const page = await context.newPage();
await page.goto(ORDER_HISTORY_URL);

const rl = createInterface({ input: process.stdin, output: process.stdout });
await rl.question('ブラウザでログイン（2段階認証含む）し、注文履歴が表示されたら Enter を押してください: ');
rl.close();

// ログインできているか確認（未ログインならサインイン画面へ飛ばされる）
await page.goto(ORDER_HISTORY_URL);
if (page.url().includes('/ap/signin')) {
  console.error('ログインが確認できませんでした。もう一度実行してください。');
  await browser.close();
  process.exit(1);
}

await context.storageState({ path: outputPath });
await chmod(outputPath, 0o600);
await browser.close();

console.log(`${outputPath} を保存しました（パーミッション 600）。`);
console.log('受け渡し後は、このファイルと Drive / Dropbox 上のコピーを必ず削除してください。');
