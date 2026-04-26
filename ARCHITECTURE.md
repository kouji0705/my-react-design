# 階層型フロントエンドアーキテクチャ

このプロジェクトは、Martin Fowlerの記事 [Modularizing React Applications with Established UI Patterns](https://martinfowler.com/articles/modularizing-react-apps.html) に基づいた階層型アーキテクチャを実装しています。

## アーキテクチャ概要

```
┌─────────────────────────────────────┐
│     Presentation Layer (View)      │  ← React Components (UI)
├─────────────────────────────────────┤
│     Application Layer              │  ← Hooks, Services
├─────────────────────────────────────┤
│     Domain Layer                   │  ← Business Logic, Models
├─────────────────────────────────────┤
│     Infrastructure Layer           │  ← API, External Services
└─────────────────────────────────────┘
```

## レイヤーの責務

### 1. Presentation Layer (`src/presentation/`)

**責務**: UIの表示とユーザーインタラクション

- **Components**: 再利用可能なUIコンポーネント（純粋関数）
  - `SearchInput.tsx` - 検索入力フィールド
  - `UserList.tsx` - ユーザー一覧の表示
  - `UserListItem.tsx` - 個別のユーザー表示

- **Pages**: ページ全体を構成するコンテナコンポーネント
  - `UserSearchPage.tsx` - ユーザー検索ページ

**特徴**:
- ビジネスロジックを持たない
- propsのみに依存する純粋関数コンポーネント
- 再利用性とテスト容易性が高い

### 2. Application Layer (`src/application/`)

**責務**: アプリケーションのロジックとステート管理

- **Hooks**: カスタムReact Hook
  - `useUserSearch.ts` - ユーザー検索のステート管理

**特徴**:
- ViewとDomain/Infrastructureの仲介役
- React特有のステート管理とライフサイクル
- 複数のコンポーネントで共有可能なロジック

### 3. Domain Layer (`src/domain/`)

**責務**: ビジネスロジックとドメインモデル

- **Models**: ドメインモデルとビジネスルール
  - `User.ts` - Userドメインモデル、バリデーション、ビジネスロジック

**特徴**:
- UIフレームワークに依存しない
- 純粋なTypeScript/JavaScriptコード
- ビジネスルールの集約
- 他のプロジェクトでも再利用可能

**ビジネスロジックの例**:
```typescript
class UserModel {
  // データのカプセル化
  matchesQuery(query: string): boolean { /* ... */ }
  get displayName(): string { /* ... */ }
  getSummary(): string { /* ... */ }
}
```

### 4. Infrastructure Layer (`src/infrastructure/`)

**責務**: 外部システムとの通信とデータ永続化

- **API**: APIクライアントの実装
  - `UserApiClient.ts` - HTTP通信とデータ取得
  - `UserRepository.ts` - データアクセスの抽象化（Repository パターン）

**特徴**:
- 外部APIの詳細を隠蔽（Anti-Corruption Layer）
- インターフェースで抽象化し、実装を切り替え可能
- エラーハンドリングとデータ変換

## デザインパターン

### 1. Repository Pattern
外部データソースへのアクセスを抽象化

```typescript
interface UserRepository {
  getAll(): Promise<UserModel[]>;
  search(query: string): Promise<UserModel[]>;
}
```

### 2. Anti-Corruption Layer
外部APIの変化から内部ドメインを保護

```typescript
class JsonPlaceholderUserApiClient implements UserApiClient {
  async fetchUsers(): Promise<User[]> {
    // 外部APIの詳細を隠蔽
    // バリデーションとエラーハンドリング
  }
}
```

### 3. Domain Model Pattern
ビジネスロジックをデータと共にカプセル化

```typescript
class UserModel {
  private readonly _name: string;
  
  get displayName(): string {
    return this._name || this._username || "Unknown User";
  }
  
  matchesQuery(query: string): boolean {
    // ビジネスロジック
  }
}
```

### 4. Custom Hook Pattern
Reactのステート管理とロジックを再利用可能に

```typescript
export const useUserSearch = (repository: UserRepository) => {
  // ステート管理
  // 副作用の処理
  return { users, query, setQuery, loading, error };
};
```

## 依存関係の方向

```
Presentation
    ↓
Application
    ↓
Domain ← Infrastructure
```

- 上位レイヤーは下位レイヤーに依存
- 下位レイヤーは上位レイヤーに依存しない
- Domainは最も独立している（Pure Business Logic）

## 利点

### 1. 保守性の向上
各レイヤーが明確な責務を持つため、変更箇所が特定しやすい

### 2. テスト容易性
- Domain: 純粋関数で単体テストが容易
- Application: モックを使用したテストが可能
- Presentation: Storybookなどで独立してテスト可能

### 3. 再利用性
- Domainロジックは他のプロジェクトでも使用可能
- Presentationコンポーネントは様々なページで再利用可能

### 4. スケーラビリティ
大規模アプリケーションでも構造を維持しやすい

### 5. 技術スタックの変更容易性
- Reactを他のフレームワークに置き換えやすい
- APIの実装を切り替えやすい

## ディレクトリ構造

```
src/
├── presentation/          # View Layer
│   ├── components/       # 再利用可能なUIコンポーネント
│   │   ├── SearchInput.tsx
│   │   ├── UserList.tsx
│   │   └── UserListItem.tsx
│   └── pages/           # ページコンポーネント
│       └── UserSearchPage.tsx
│
├── application/          # Application Layer
│   └── hooks/           # カスタムフック
│       └── useUserSearch.ts
│
├── domain/              # Domain Layer
│   └── models/         # ドメインモデル
│       └── User.ts
│
├── infrastructure/      # Infrastructure Layer
│   └── api/            # API通信
│       ├── UserApiClient.ts
│       └── UserRepository.ts
│
├── App.tsx             # アプリケーションエントリーポイント
└── main.tsx           # Reactエントリーポイント
```

## 実装のポイント

### コンポーネントの分類

**Pure Components (Presentational)**
- ステートを持たない
- propsのみに依存
- 再利用性が高い

**Container Components (Pages)**
- ステートを管理
- Hooksを使用
- Pure Componentsを組み合わせる

### データの流れ

1. **User入力** → Presentation Layer
2. **Event発火** → Application Layer (Hook)
3. **ビジネスロジック実行** → Domain Layer
4. **データ取得** → Infrastructure Layer
5. **結果の返却** → Application Layer → Presentation Layer

## 参考資料

- [Modularizing React Applications with Established UI Patterns](https://martinfowler.com/articles/modularizing-react-apps.html)
- [Presentation Domain Data Layering](https://martinfowler.com/bliki/PresentationDomainDataLayering.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

## 次のステップ

このアーキテクチャをさらに拡張する場合:

1. **State Management**: Zustand, Redux などの状態管理ライブラリの導入
2. **Routing**: React Router でページ遷移を追加
3. **Testing**: Jest, React Testing Library でテスト追加
4. **Type Safety**: より厳密な型定義
5. **Error Boundary**: エラーハンドリングの改善
6. **Loading States**: より洗練されたローディング表示
7. **Caching**: React Query などでデータキャッシング
