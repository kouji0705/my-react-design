# 階層型フロントエンドアーキテクチャ実装例

このプロジェクトは、**Martin Fowler**の記事 [Modularizing React Applications with Established UI Patterns](https://martinfowler.com/articles/modularizing-react-apps.html) に基づいて、階層型フロントエンドアプリケーションを実装しています。

## 🎯 プロジェクトの目的

大規模なReactアプリケーションにおいて、以下の課題を解決するためのアーキテクチャパターンを示します:

- コンポーネントが肥大化し、複数の責務を持ってしまう問題
- ビジネスロジックがViewに混在する問題
- テストしにくい、変更しにくいコードベース
- チーム開発でのコード整理の困難さ

## 🏗️ アーキテクチャ図

```
┌──────────────────────────────────────────┐
│   Presentation Layer (表現層)            │
│   - Pages (Container Components)         │
│   - Components (Presentational)          │
│   - Pure functions, no business logic    │
└──────────────┬───────────────────────────┘
               │ uses
               ↓
┌──────────────────────────────────────────┐
│   Application Layer (アプリケーション層)  │
│   - Custom Hooks                         │
│   - State management                     │
│   - React-specific logic                 │
└──────────────┬───────────────────────────┘
               │ uses
               ↓
┌──────────────────────────────────────────┐
│   Domain Layer (ドメイン層)              │
│   - Business logic                       │
│   - Domain models                        │
│   - Pure TypeScript (no React)           │
└──────────────┬───────────────────────────┘
               │ uses
               ↓
┌──────────────────────────────────────────┐
│   Infrastructure Layer (基盤層)          │
│   - API clients                          │
│   - Repositories                         │
│   - External service integration         │
└──────────────────────────────────────────┘
```

## 📁 ディレクトリ構造

```
src/
├── presentation/           # 表現層 (View)
│   ├── components/        # 再利用可能なUIコンポーネント
│   │   ├── SearchInput.tsx
│   │   ├── UserList.tsx
│   │   └── UserListItem.tsx
│   └── pages/            # ページ (コンテナコンポーネント)
│       └── UserSearchPage.tsx
│
├── application/           # アプリケーション層
│   └── hooks/            # カスタムHooks
│       └── useUserSearch.ts
│
├── domain/               # ドメイン層
│   └── models/          # ドメインモデル
│       └── User.ts
│
└── infrastructure/       # 基盤層
    └── api/             # API通信
        ├── UserApiClient.ts
        └── UserRepository.ts
```

## 🔑 各レイヤーの責務

### 1. Presentation Layer (表現層)

**役割**: UIの表示とユーザー操作のハンドリング

**特徴**:
- ビジネスロジックを持たない
- propsのみに依存する純粋関数
- 再利用性が高い
- テストが容易

**例**:
```tsx
// Pure Presentational Component
export const UserListItem = ({ user }: { user: UserModel }) => {
  return (
    <li>
      <div>{user.displayName}</div>
      {user.email && <div>{user.email}</div>}
    </li>
  );
};
```

### 2. Application Layer (アプリケーション層)

**役割**: アプリケーションのロジックとステート管理

**特徴**:
- Reactのhooksを使用
- PreseniationとDomain/Infrastructureの仲介
- ステートとライフサイクルの管理

**例**:
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

### 3. Domain Layer (ドメイン層)

**役割**: ビジネスロジックとドメインモデル

**特徴**:
- UIフレームワークに依存しない
- 純粋なTypeScriptコード
- 他のプロジェクトでも再利用可能
- ビジネスルールを集約

**例**:
```typescript
export class UserModel {
  constructor(private user: User) {}
  
  get displayName(): string {
    return this.user.name || this.user.username || "Unknown";
  }
  
  matchesQuery(query: string): boolean {
    return this.user.name.toLowerCase().includes(query.toLowerCase());
  }
}
```

### 4. Infrastructure Layer (基盤層)

**役割**: 外部システムとの通信

**特徴**:
- APIの詳細を隠蔽 (Anti-Corruption Layer)
- インターフェースで抽象化
- エラーハンドリングとデータ変換

**例**:
```typescript
export class UserRepositoryImpl implements UserRepository {
  constructor(private apiClient: UserApiClient) {}
  
  async getAll(): Promise<UserModel[]> {
    const users = await this.apiClient.fetchUsers();
    return users.map(createUserModel);
  }
}
```

## 🎨 適用しているデザインパターン

### 1. **Repository Pattern**
データアクセスの抽象化

```typescript
interface UserRepository {
  getAll(): Promise<UserModel[]>;
  search(query: string): Promise<UserModel[]>;
}
```

### 2. **Anti-Corruption Layer**
外部APIの変更から内部ドメインを保護

```typescript
class UserApiClient {
  async fetchUsers(): Promise<User[]> {
    // バリデーション、エラーハンドリング
    const result = UserListSchema.safeParse(rawData);
    return result.data;
  }
}
```

### 3. **Domain Model Pattern**
データとビジネスロジックをカプセル化

```typescript
class UserModel {
  matchesQuery(query: string): boolean {
    // ビジネスロジック
  }
}
```

### 4. **Custom Hook Pattern**
Reactのステート管理を再利用可能に

```typescript
const useUserSearch = (repository) => {
  // ステート管理とロジック
};
```

## ✅ この設計の利点

### 1. 保守性の向上
- 各レイヤーが明確な責務を持つ
- 変更箇所の特定が容易
- "Shotgun Surgery"（散弾銃手術）を回避

### 2. テスト容易性
- **Domain**: 純粋関数で単体テストが簡単
- **Application**: モックを使用したテストが可能
- **Presentation**: Storybookなどで独立してテスト

### 3. 再利用性
- Domainロジックは他のプロジェクトでも使用可能
- Presentationコンポーネントは様々な場所で再利用可能

### 4. スケーラビリティ
- 大規模アプリケーションでも構造を維持しやすい
- チーム開発でも役割分担が明確

### 5. 技術スタックの変更容易性
- Reactを他のフレームワーク(Vue, Svelteなど)に置き換えやすい
- APIの実装を切り替えやすい

## 🔄 データの流れ

```
User Input
    ↓
[Presentation Layer]
    ↓ Event
[Application Layer (Hook)]
    ↓ Request
[Domain Layer (Business Logic)]
    ↓ Use
[Infrastructure Layer (API)]
    ↓ Fetch Data
External API
    ↓ Return Data
[Infrastructure]
    ↓ Convert to Domain Model
[Domain]
    ↓ Return Result
[Application]
    ↓ Update State
[Presentation]
```

## 🚀 実装のポイント

### コンポーネントの分類

**Presentational Components (Pure)**
```tsx
// ステートを持たない、propsのみに依存
const SearchInput = ({ value, onChange }) => (
  <input value={value} onChange={onChange} />
);
```

**Container Components (Pages)**
```tsx
// ステートを管理、Hooksを使用
const UserSearchPage = () => {
  const { users, query, setQuery } = useUserSearch(repository);
  return <UserList users={users} />;
};
```

### 依存性の注入

```tsx
// 依存性を外部から注入
const apiClient = new UserApiClient();
const repository = new UserRepositoryImpl(apiClient);

// Hookに注入
const { users } = useUserSearch(repository);
```

## 📚 参考資料

- [Modularizing React Applications](https://martinfowler.com/articles/modularizing-react-apps.html) - Martin Fowler
- [Presentation Domain Data Layering](https://martinfowler.com/bliki/PresentationDomainDataLayering.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

## 🛠️ 使用技術

- React 18
- TypeScript
- Zod (スキーマバリデーション)
- Vite (ビルドツール)

## 🎯 次のステップ

このアーキテクチャをさらに拡張する場合:

1. **State Management**: Zustand, Jotai などの導入
2. **Routing**: React Router でページ遷移
3. **Testing**: Jest, Vitest, React Testing Library
4. **API Cache**: React Query, SWR の導入
5. **Error Boundary**: エラーハンドリングの改善
6. **Form Management**: React Hook Form の統合
7. **Feature-based Structure**: 機能ごとのディレクトリ構造

## 📝 まとめ

この実装は、Martin Fowlerの記事で紹介されている以下の進化過程の最終形です:

1. ✅ Single Component Application
2. ✅ Multiple Component Application
3. ✅ State management with hooks
4. ✅ Business models emerged
5. ✅ **Layered frontend application** ← ここを実装

階層型アーキテクチャにより、**関心の分離 (Separation of Concerns)** を実現し、保守性・テスト容易性・再利用性の高いコードベースを構築できます。
