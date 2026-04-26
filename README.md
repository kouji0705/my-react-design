# 階層型フロントエンドアーキテクチャ (Layered Frontend Application)

Martin Fowlerの記事 [Modularizing React Applications with Established UI Patterns](https://martinfowler.com/articles/modularizing-react-apps.html) に基づいた階層型フロントエンドアプリケーションの実装例です。

## 🎯 プロジェクトの目的

大規模なReactアプリケーション開発における以下の課題を解決するためのアーキテクチャパターンを実装:

- コンポーネントの肥大化と責務の混在
- ビジネスロジックとViewの分離
- テスト容易性と保守性の向上
- チーム開発でのコード整理

## 🏗️ アーキテクチャ

```
┌──────────────────────┐
│  Presentation Layer  │  UIコンポーネント
├──────────────────────┤
│  Application Layer   │  Hooks、ステート管理
├──────────────────────┤
│  Domain Layer        │  ビジネスロジック
├──────────────────────┤
│  Infrastructure      │  API通信、外部サービス
└──────────────────────┘
```

## 📁 ディレクトリ構造

```
src/
├── presentation/         # 表現層
│   ├── components/      # Pure Components
│   └── pages/          # Container Components
├── application/         # アプリケーション層
│   └── hooks/          # Custom Hooks
├── domain/             # ドメイン層
│   └── models/         # Business Logic
└── infrastructure/     # 基盤層
    └── api/           # API Clients & Repositories
```

## 🚀 クイックスタート

### インストール

```bash
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

ブラウザで http://localhost:5173/ を開く

### ビルド

```bash
npm run build
```

## 📚 ドキュメント

詳細な実装ガイドとアーキテクチャの説明:

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - アーキテクチャ概要とディレクトリ構造
- **[IMPLEMENTATION.md](./IMPLEMENTATION.md)** - 実装ガイドとコード例
- **[LAYERS.md](./LAYERS.md)** - 各レイヤーの詳細解説とデータフロー
- **[COMPARISON.md](./COMPARISON.md)** - Before/After 比較
- **[SUMMARY.md](./SUMMARY.md)** - 実装完了サマリー
- **[CLEANUP.md](./CLEANUP.md)** - クリーンアップと重複削除の記録

## 🎨 採用デザインパターン

1. **Repository Pattern** - データアクセスの抽象化
2. **Anti-Corruption Layer** - 外部APIの影響を局所化
3. **Domain Model Pattern** - ビジネスロジックのカプセル化
4. **Custom Hook Pattern** - Reactステート管理の再利用

## 💡 主な特徴

### 1. 明確な責務分離

各レイヤーが1つの責務のみを持ち、変更の影響を局所化

### 2. テスト容易性

- **Domain Layer**: 純粋関数で単体テストが簡単
- **Application Layer**: モックを使った独立テスト
- **Presentation Layer**: Storybookで視覚的テスト

### 3. 再利用性

- ビジネスロジックは他のプロジェクトでも使用可能
- UIコンポーネントは様々な場所で再利用可能

### 4. スケーラビリティ

大規模アプリケーションでも構造を維持しやすい

## 🔑 実装のポイント

### Presentation Layer (表現層)

```tsx
// Pure Component
export const SearchInput = ({ value, onChange }) => (
  <input value={value} onChange={onChange} />
);
```

### Application Layer (アプリケーション層)

```tsx
// Custom Hook
export const useUserSearch = (repository: UserRepository) => {
  const [users, setUsers] = useState<UserModel[]>([]);
  // ...
  return { users, query, setQuery };
};
```

### Domain Layer (ドメイン層)

```typescript
// Domain Model
export class UserModel {
  matchesQuery(query: string): boolean {
    // ビジネスロジック
  }
}
```

### Infrastructure Layer (基盤層)

```typescript
// Repository Pattern
export class UserRepositoryImpl implements UserRepository {
  async getAll(): Promise<UserModel[]> {
    // データ取得とドメインモデルへの変換
  }
}
```

## 📖 参考資料

- [Modularizing React Applications](https://martinfowler.com/articles/modularizing-react-apps.html) - Martin Fowler
- [Presentation Domain Data Layering](https://martinfowler.com/bliki/PresentationDomainDataLayering.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

## 🛠️ 技術スタック

- React 18
- TypeScript
- Vite
- Zod (スキーマバリデーション)
- ESLint

## 🎓 学習ポイント

この実装から学べる設計原則:

1. **Separation of Concerns** (関心の分離)
2. **Dependency Inversion** (依存性の逆転)
3. **Single Responsibility** (単一責任の原則)
4. **Open/Closed Principle** (開放閉鎖の原則)
5. **Interface Segregation** (インターフェース分離の原則)

## 🔄 次のステップ

アーキテクチャをさらに拡張:

- State Management (Zustand, Jotai)
- Routing (React Router)
- Testing (Vitest, React Testing Library)
- API Cache (React Query, SWR)
- Error Handling (Error Boundary)

## 📝 ライセンス

MIT

---

## React + Vite について

このテンプレートは、ViteとReactを使用した最小限のセットアップです。

### 使用可能なプラグイン

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) - [Oxc](https://oxc.rs) を使用
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) - [SWC](https://swc.rs/) を使用


```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
