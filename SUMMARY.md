# 階層型フロントエンドアーキテクチャ - 実装完了

## ✅ 実装内容

Martin Fowlerの記事 [Modularizing React Applications with Established UI Patterns](https://martinfowler.com/articles/modularizing-react-apps.html) に基づいて、階層型フロントエンドアプリケーションを実装しました。

## 📂 作成したファイル

### Presentation Layer (表現層)
```
src/presentation/
├── components/
│   ├── SearchInput.tsx        # 検索入力フィールド (Pure Component)
│   ├── UserList.tsx          # ユーザーリスト (Pure Component)
│   └── UserListItem.tsx      # ユーザーアイテム (Pure Component)
└── pages/
    └── UserSearchPage.tsx    # ユーザー検索ページ (Container Component)
```

### Application Layer (アプリケーション層)
```
src/application/
└── hooks/
    └── useUserSearch.ts      # ユーザー検索Hook (State Management)
```

### Domain Layer (ドメイン層)
```
src/domain/
└── models/
    └── User.ts              # Userドメインモデル (Business Logic)
```

### Infrastructure Layer (基盤層)
```
src/infrastructure/
└── api/
    ├── UserApiClient.ts     # API通信クライアント
    └── UserRepository.ts    # リポジトリパターン
```

### ドキュメント
```
├── ARCHITECTURE.md          # アーキテクチャ概要
├── IMPLEMENTATION.md        # 実装ガイド
└── LAYERS.md               # レイヤー詳細解説
```

## 🏗️ アーキテクチャの特徴

### 1. 明確な責務分離

```
┌─────────────────────┐
│  Presentation       │  UI表示、ユーザー操作
├─────────────────────┤
│  Application        │  ステート管理、ロジック調整
├─────────────────────┤
│  Domain             │  ビジネスロジック、モデル
├─────────────────────┤
│  Infrastructure     │  API通信、外部サービス
└─────────────────────┘
```

### 2. 依存関係の方向

- ✅ 上位レイヤーは下位レイヤーに依存
- ✅ 下位レイヤーは上位レイヤーに依存しない
- ✅ Domainは最も独立している

### 3. 適用デザインパターン

1. **Repository Pattern** - データアクセスの抽象化
2. **Anti-Corruption Layer** - 外部APIの影響を局所化
3. **Domain Model Pattern** - ビジネスロジックのカプセル化
4. **Custom Hook Pattern** - Reactステート管理の再利用

## 🎯 実装のポイント

### Presentation Layer

**Pure Components (純粋コンポーネント)**
- ステートを持たない
- propsのみに依存
- 再利用性が高い

例:
```tsx
export const SearchInput = ({ value, onChange }) => (
  <input value={value} onChange={onChange} />
);
```

**Container Components (コンテナコンポーネント)**
- ステートを管理
- Hooksを使用
- Pure Componentsを組み合わせる

例:
```tsx
export const UserSearchPage = () => {
  const { users, query, setQuery } = useUserSearch(repository);
  return <UserList users={users} />;
};
```

### Application Layer

**Custom Hooks**
- Reactのステート管理
- ViewとDomain/Infrastructureの仲介

例:
```tsx
export const useUserSearch = (repository: UserRepository) => {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [query, setQuery] = useState("");
  
  useEffect(() => {
    repository.getAll().then(setUsers);
  }, [repository]);
  
  return { users, query, setQuery };
};
```

### Domain Layer

**Domain Model**
- ビジネスロジックをカプセル化
- UIフレームワークに依存しない
- 純粋なTypeScript

例:
```typescript
export class UserModel {
  matchesQuery(query: string): boolean {
    // ビジネスロジック
  }
  
  get displayName(): string {
    // 派生データ
  }
}
```

### Infrastructure Layer

**API Client (Anti-Corruption Layer)**
- 外部APIの詳細を隠蔽
- バリデーションとエラーハンドリング

例:
```typescript
export class JsonPlaceholderUserApiClient {
  async fetchUsers(): Promise<User[]> {
    const response = await fetch(this.baseUrl);
    const rawData = await response.json();
    
    // バリデーション
    const result = UserListSchema.safeParse(rawData);
    return result.data;
  }
}
```

**Repository Pattern**
- データアクセスの抽象化
- ドメインモデルへの変換

例:
```typescript
export class UserRepositoryImpl implements UserRepository {
  async getAll(): Promise<UserModel[]> {
    const users = await this.apiClient.fetchUsers();
    return users.map(createUserModel);
  }
}
```

## 📊 データフロー

### ユーザー検索の流れ

```
1. User types in SearchInput
   ↓
2. [Presentation] Event fired
   ↓
3. [Application] useUserSearch updates state
   ↓
4. [Domain] UserModel.matchesQuery() filters users
   ↓
5. [Presentation] UserList re-renders
```

### 初回データ取得の流れ

```
1. [Presentation] Page mounts
   ↓
2. [Application] useEffect runs
   ↓
3. [Infrastructure] Repository.getAll()
   ↓
4. [Infrastructure] API Client fetches data
   ↓
5. [Infrastructure] Validates with Zod
   ↓
6. [Domain] Converts to UserModel
   ↓
7. [Application] Updates state
   ↓
8. [Presentation] Components render
```

## 💡 この設計の利点

### 1. 保守性
- 各レイヤーが明確な責務
- 変更箇所の特定が容易
- "Shotgun Surgery" を回避

### 2. テスト容易性
- Domain: 純粋関数で単体テストが簡単
- Application: モックで独立テスト
- Presentation: Storybookで視覚的テスト

### 3. 再利用性
- Domainロジックは他のプロジェクトでも使用可能
- Presentationコンポーネントは様々な場所で再利用可能

### 4. スケーラビリティ
- 大規模アプリケーションでも構造を維持
- チーム開発での役割分担が明確

### 5. 技術スタック変更の容易性
- Reactを他のフレームワークに置き換え可能
- APIの実装を切り替え可能

## 🚀 実行方法

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:5174/ を開く

### ビルド

```bash
npm run build
```

## 📚 参考資料

- [Modularizing React Applications](https://martinfowler.com/articles/modularizing-react-apps.html) - Martin Fowler
- [Presentation Domain Data Layering](https://martinfowler.com/bliki/PresentationDomainDataLayering.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

## 📖 詳細ドキュメント

- **ARCHITECTURE.md** - アーキテクチャ概要とディレクトリ構造
- **IMPLEMENTATION.md** - 実装ガイドとコード例
- **LAYERS.md** - 各レイヤーの詳細解説とデータフロー

## 🎓 学習ポイント

この実装から学べること:

1. **関心の分離 (Separation of Concerns)**
   - UIとビジネスロジックの分離
   - データ取得とデータ表示の分離

2. **依存性の逆転 (Dependency Inversion)**
   - インターフェースへの依存
   - 実装の切り替え可能性

3. **単一責任の原則 (Single Responsibility)**
   - 各レイヤー、各クラスが1つの責務
   - コンポーネントの細分化

4. **開放閉鎖の原則 (Open/Closed)**
   - 拡張に対して開いている
   - 修正に対して閉じている

5. **インターフェース分離の原則**
   - 小さく特化したインターフェース
   - 不要な依存を持たない

## 🔄 次のステップ

このアーキテクチャをさらに発展させる:

1. **State Management**: Zustand, Jotai の導入
2. **Routing**: React Router でSPA化
3. **Testing**: Vitest, React Testing Library
4. **API Cache**: React Query, SWR
5. **Error Handling**: Error Boundary の実装
6. **Form Management**: React Hook Form
7. **Feature-based**: 機能ごとのディレクトリ構造

## 📝 まとめ

この実装は、Martin Fowlerの記事で紹介されている進化過程の最終形である「階層型フロントエンドアプリケーション」を実装しました。

**進化過程:**
1. ✅ Single Component Application
2. ✅ Multiple Component Application
3. ✅ State management with hooks
4. ✅ Business models emerged
5. ✅ **Layered frontend application** ← 実装完了

階層型アーキテクチャにより、大規模アプリケーションでも保守性・テスト容易性・再利用性の高いコードベースを構築できます。
