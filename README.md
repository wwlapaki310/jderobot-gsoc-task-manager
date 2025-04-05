# jderobot-gsoc-task-manager

# タスク管理アプリケーション - JdeRobot GSoC 2025

https://www.youtube.com/watch?v=wuFg_FXqGbk

このプロジェクトは、JdeRobot GSoC 2025の応募課題として作成されたタスク管理アプリケーションです。
React、Redux、TypeScriptを使用して構築されています。

## 機能

- タスクの追加、完了マーク、削除
- タスクのフィルタリング（完了状態、カテゴリ）
- タスクのソート（優先度、期日）
- タスク検索
- ドラッグ＆ドロップによるタスクの並べ替え
- カテゴリ分類（個人、仕事、買い物、その他）
- 優先度設定（高、中、低）
- 期日設定と期日が近いタスクの視覚的表示
- ローカルストレージを使用したデータの永続化
- レスポンシブデザイン

## 使用技術

- React 18
- TypeScript
- Redux Toolkit（状態管理）
- React DnD（ドラッグ＆ドロップ）
- React DatePicker（日付選択）
- ローカルストレージ（データ永続化）

## セットアップと実行方法

### 必要条件

- Node.js 16.0.0 以上
- npm または yarn

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/your-username/task-management-app.git
cd task-management-app

# 依存関係のインストール
npm install
# または
yarn install
```

### 開発サーバーの起動

```bash
npm start
# または
yarn start
```

アプリケーションは http://localhost:3000 で実行されます。

### ビルド

```bash
npm run build
# または
yarn build
```

ビルド済みのアプリケーションは `build` ディレクトリに出力されます。

## アプリケーションの使い方

### タスクの追加

1. フォームにタスクのタイトルを入力
2. カテゴリ、優先度、期日を選択
3. 「追加」ボタンをクリック

### タスクの管理

- チェックボックスをクリックしてタスクを完了/未完了に切り替え
- 「削除」ボタンでタスクを削除
- タスクをドラッグして順序を変更

### フィルタリングとソート

- 上部のドロップダウンメニューで完了状態によるフィルタリング
- カテゴリによるフィルタリング
- 優先度や期日によるソート

### 検索

- 検索バーにキーワードを入力してタスクを検索

## プロジェクト構造

```
src/
├── components/      # Reactコンポーネント
├── redux/           # Reduxストア、スライス
├── types/           # TypeScript型定義
├── App.css          # スタイルシート
└── index.tsx        # エントリーポイント
```

## 課題の要件に対する実装箇所

- **タスクのフィルタリング**: `TaskFilter.tsx`, `TaskList.tsx` での完了状態に基づいたフィルタリング
- **タスクカテゴリ**: `TaskForm.tsx` でカテゴリ設定、`TaskFilter.tsx` でフィルタリング
- **タスク優先度**: `TaskForm.tsx` で優先度設定、`TaskList.tsx` で優先度によるソート
- **検索機能**: `SearchBar.tsx` でタイトルによる検索
- **ドラッグ＆ドロップ**: `TaskItem.tsx`, `TaskList.tsx` で React DnD を使用した実装
- **期日**: `TaskForm.tsx` で期日設定、`TaskItem.tsx` で期日表示と視覚的な通知
