# amazon-auth

ローカルPCで Amazon.co.jp（Amazon ビジネス含む）にログインし、ログイン状態を `storageState`（JSON）として書き出すツール。
書き出したファイルをクラウド環境（Claude Code on the web など）に渡すことで、ログイン済みの状態で
購入履歴の確認や領収書のダウンロードを自動化できる。

> [!WARNING]
> `amazon-state.json` は **パスワード・2段階認証なしでアカウントを操作できる認証情報** です。
> - 絶対にコミットしない（`.gitignore` で除外済み。このリポジトリは公開リポジトリです）
> - 受け渡しに使った Drive / Dropbox 上のファイルは作業後すぐ削除する
> - 作業後は Amazon の「ログインとセキュリティ」→ 全端末からログアウト でセッションを無効化すると安全

## 必要なもの

- Node.js 20 以上
- pnpm（`corepack enable pnpm` で有効化可）

## 手順

### 1. セットアップ（初回のみ）

```bash
git clone https://github.com/funamen/tryhard-workautomation.git
cd tryhard-workautomation/amazon-auth
pnpm install
pnpm exec playwright install chromium
```

### 2. ログイン状態を書き出す

```bash
pnpm export-state
```

1. Chromium が起動し、Amazon のサインイン画面が開く
2. 普段どおりログインする（2段階認証も手動で通す）
3. 注文履歴が表示されたら、ターミナルに戻って Enter
4. `amazon-state.json` が作成される

出力先を変える場合: `pnpm export-state ~/secure/amazon-state.json`

### 3. クラウド環境へ渡す

1. `amazon-state.json` を Google Drive または Dropbox の **非共有フォルダ** にアップロード
2. Claude にファイル名（またはパス）を伝える
3. Claude が取得後、Drive / Dropbox 上のファイルを削除する

### 4. 作業後

- ローカル・クラウド上の `amazon-state.json` を削除
- 必要に応じて Amazon で全端末からログアウト

## 注意

- Amazon はセッションを IP やブラウザ環境と照合するため、クラウド側では再認証や CAPTCHA を求められて
  使えない場合がある。その場合はローカルPCで自動化スクリプトを直接実行する方式に切り替える。
- ログイン状態の有効期限が切れたら、手順 2 からやり直す。
