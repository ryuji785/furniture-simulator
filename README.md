# 家具配置シミュレーション

iOSスマホ向けの家具・家電配置シミュレーションアプリ。1LDK賃貸物件に家具や家電を配置し、現実的に成立する暮らしを確認できます。

## 機能

### 間取り設定
- LDK：6～20帖
- 洋室：4～12帖
- スライダー操作で直感的に調整

### 配置ルール

**基本判定**
- 部屋からのはみ出し防止
- 家具・家電同士の衝突検出
- 通路幅チェック（最小60cm）
- 生活動線の確保

**家電特有ルール**
- 冷蔵庫：床置きのみ
- 電子レンジ・オーブントースター：天板上のみ配置可
- 空中浮遊状態の防止
- 家具サイズからのはみ出し防止

### 操作方法
- **ドラッグ**：家具・家電を配置移動
- **タップ**：選択 / 90度回転
- **タップ（削除ボタン）**：選択アイテム削除
- グリッドスナップ：10cm単位で安定配置

## 配置可能アイテム

### 家具
- シングルベッド（100×200cm）
- セミダブルベッド（120×200cm）
- 2人掛けソファ（150×80cm）
- デスク（120×60cm）
- テーブル（120×75cm）
- テレビボード（120×40cm）
- 本棚（60×30cm）
- カラーボックス（42×29cm）
- レンジラック（60×45cm）

### 家電
- 冷蔵庫（60×65cm）
- 電子レンジ（50×40cm）
- オーブントースター（35×35cm）

## 開発環境

### セットアップ
```bash
npm install
```

### 開発サーバー起動
```bash
npm run dev
```
http://localhost:5173 でアクセス

### ビルド
```bash
npm run build
```

### プレビュー
```bash
npm run preview
```

## 技術スタック

- React 19
- TypeScript
- Vite
- SVG（キャンバス）
- CSS Modules

## デプロイ

### Vercelへのデプロイ

1. リポジトリをGitHubにプッシュ

```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/furniture-simulator.git
git push -u origin main
```

2. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
3. 「Add New...」→「Project」
4. GitHubリポジトリを選択
5. デプロイ（自動的にビルド実行）

### その他のホスティング

`dist/` フォルダの内容を以下にデプロイ可能：
- Netlify
- GitHub Pages
- AWS S3
- その他の静的ファイルサーバー

## iOS対応

- Safe Area完全対応
- 縦画面固定
- ホーム画面追加対応
- タッチ操作最適化

## UIデザイン思想

- エラーメッセージなし（自然に配置不可）
- 判定根拠が明確
- UI崩れなし
- シンプルで直感的

## ライセンス

MIT
