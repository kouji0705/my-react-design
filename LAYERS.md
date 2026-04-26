# レイヤー間の依存関係とデータフロー

## 依存関係の原則

階層型アーキテクチャでは、**依存関係は常に下向き**です。

```
Presentation Layer
       ↓ (depends on)
Application Layer
       ↓ (depends on)
Domain Layer ← Infrastructure Layer
```

### ルール

1. **上位レイヤーは下位レイヤーに依存できる**
   - Presentationは Application, Domain を使える
   - Application は Domain を使える

2. **下位レイヤーは上位レイヤーに依存してはいけない**
   - Domain は Presentation を知らない
   - Domain は Application を知らない

3. **Domain は Infrastructure を直接知らない**
   - インターフェース（抽象）を通じて間接的に使用

## 各レイヤーの詳細解説

### Presentation Layer (表現層)

#### 責務
- UIの表示
- ユーザー操作の受付
- データの視覚的表現

#### ファイル例

**Pure Component (純粋コンポーネント)**
```tsx
// src/presentation/components/SearchInput.tsx
export const SearchInput = ({ value, onChange }) => {
  return <input value={value} onChange={onChange} />;
};
```

**Container Component (コンテナコンポーネント)**
```tsx
// src/presentation/pages/UserSearchPage.tsx
export const UserSearchPage = () => {
  // Application層のhookを使用
  const { users, query, setQuery } = useUserSearch(repository);
  
  // Presentational componentsを組み合わせる
  return (
    <>
      <SearchInput value={query} onChange={setQuery} />
      <UserList users={users} />
    </>
  );
};
```

#### 特徴
- **Props Down, Events Up**: データは上から下へ、イベントは下から上へ
- **Pure Functions**: 同じpropsなら同じ結果を返す
- **No Business Logic**: ビジネスルールを持たない

---

### Application Layer (アプリケーション層)

#### 責務
- アプリケーション固有のロジック
- ステート管理
- Presentationと他のレイヤーの仲介

#### ファイル例

```tsx
// src/application/hooks/useUserSearch.ts
export const useUserSearch = (repository: UserRepository) => {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  // 初回ロード
  useEffect(() => {
    repository.getAll().then(setUsers);
  }, [repository]);
  
  // フィルタリング (Domain層のロジックを使用)
  const filteredUsers = users.filter(user => user.matchesQuery(query));
  
  return { users: filteredUsers, query, setQuery, loading };
};
```

#### 特徴
- **React Hooks**: useState, useEffect などを使用
- **Orchestration**: 複数のドメイン操作を組み合わせる
- **State Management**: UIのステートを管理

---

### Domain Layer (ドメイン層)

#### 責務
- ビジネスロジック
- ドメインモデルの定義
- ビジネスルールの実装

#### ファイル例

```typescript
// src/domain/models/User.ts

// データ構造の定義
export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email().optional(),
});

export type User = z.infer<typeof UserSchema>;

// ドメインモデル: データ + ビジネスロジック
export class UserModel {
  constructor(private user: User) {}
  
  // ゲッター: 派生データ
  get displayName(): string {
    return this.user.name || "Unknown User";
  }
  
  // ビジネスロジック: 検索マッチング
  matchesQuery(query: string): boolean {
    if (!query) return true;
    
    const searchableText = [
      this.user.name,
      this.user.email,
    ].filter(Boolean).join(" ").toLowerCase();
    
    return searchableText.includes(query.toLowerCase());
  }
  
  // ビジネスロジック: サマリー生成
  getSummary(): string {
    return `${this.displayName} (${this.user.email})`;
  }
}

// ファクトリー関数
export const createUserModel = (user: User): UserModel => {
  return new UserModel(user);
};
```

#### 特徴
- **Framework Agnostic**: React に依存しない
- **Pure TypeScript**: 純粋なTypeScriptコード
- **Testable**: 単体テストが容易
- **Reusable**: 他のプロジェクトでも使用可能

---

### Infrastructure Layer (基盤層)

#### 責務
- 外部システムとの通信
- データの永続化
- 外部サービスの統合

#### ファイル例

**API Client (Anti-Corruption Layer)**
```typescript
// src/infrastructure/api/UserApiClient.ts
export interface UserApiClient {
  fetchUsers(): Promise<User[]>;
}

export class JsonPlaceholderUserApiClient implements UserApiClient {
  constructor(private baseUrl: string) {}
  
  async fetchUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${this.baseUrl}/users`);
      const rawData = await response.json();
      
      // バリデーション: 外部データを検証
      const result = UserListSchema.safeParse(rawData);
      
      if (!result.success) {
        console.error("Validation error:", result.error);
        return [];
      }
      
      return result.data;
    } catch (error) {
      console.error("API error:", error);
      return [];
    }
  }
}
```

**Repository Pattern**
```typescript
// src/infrastructure/api/UserRepository.ts
export interface UserRepository {
  getAll(): Promise<UserModel[]>;
  search(query: string): Promise<UserModel[]>;
}

export class UserRepositoryImpl implements UserRepository {
  constructor(private apiClient: UserApiClient) {}
  
  async getAll(): Promise<UserModel[]> {
    // API Clientを使ってデータ取得
    const users = await this.apiClient.fetchUsers();
    
    // Domain Modelに変換
    return users.map(createUserModel);
  }
  
  async search(query: string): Promise<UserModel[]> {
    const allUsers = await this.getAll();
    return allUsers.filter(user => user.matchesQuery(query));
  }
}
```

#### 特徴
- **Interface Segregation**: インターフェースで抽象化
- **Anti-Corruption Layer**: 外部APIの変更を吸収
- **Error Handling**: エラーハンドリングの集約

---

## データフローの例

### ユーザーが検索フィールドに入力した場合

```
1. User types "John" in SearchInput
   ↓
2. [Presentation] SearchInput calls onChange("John")
   ↓
3. [Presentation] UserSearchPage receives event
   ↓
4. [Application] useUserSearch hook updates query state
   ↓
5. [Application] Hook filters users using domain logic
   ↓
6. [Domain] UserModel.matchesQuery("John") is called for each user
   ↓
7. [Application] Returns filtered users to component
   ↓
8. [Presentation] UserList re-renders with filtered users
```

### 初回ロード時のデータ取得

```
1. [Presentation] UserSearchPage mounts
   ↓
2. [Application] useUserSearch hook runs useEffect
   ↓
3. [Application] Calls repository.getAll()
   ↓
4. [Infrastructure] UserRepository calls apiClient.fetchUsers()
   ↓
5. [Infrastructure] API Client fetches from external API
   ↓
6. [Infrastructure] Validates response with Zod schema
   ↓
7. [Infrastructure] Converts to User[] (Domain type)
   ↓
8. [Infrastructure] Repository converts User[] to UserModel[]
   ↓
9. [Application] Hook updates users state
   ↓
10. [Presentation] Components re-render with new data
```

## 依存性注入のパターン

### 1. コンストラクタ注入

```typescript
// Infrastructure層
class UserRepositoryImpl {
  constructor(private apiClient: UserApiClient) {}
}

// Application層
const apiClient = new JsonPlaceholderUserApiClient();
const repository = new UserRepositoryImpl(apiClient);
```

### 2. Hook引数注入

```typescript
// Hook定義
export const useUserSearch = (repository: UserRepository) => {
  // ...
};

// 使用側
const repository = new UserRepositoryImpl(apiClient);
const { users } = useUserSearch(repository);
```

### 3. Context注入 (大規模アプリ)

```typescript
// 依存性をContextで提供
const RepositoryContext = createContext<UserRepository | null>(null);

// Provider
<RepositoryContext.Provider value={repository}>
  <App />
</RepositoryContext.Provider>

// Hook内で使用
const repository = useContext(RepositoryContext);
```

## レイヤー間のインターフェース

### Application → Domain

```typescript
// Applicationは Domainのモデルとメソッドを使用
const filteredUsers = users.filter(user => user.matchesQuery(query));
```

### Application → Infrastructure

```typescript
// Applicationは Infrastructureのインターフェースを使用
interface UserRepository {
  getAll(): Promise<UserModel[]>;
}

const { users } = useUserSearch(repository);
```

### Infrastructure → Domain

```typescript
// InfrastructureはDomainの型とファクトリーを使用
const users: User[] = await apiClient.fetchUsers();
const models: UserModel[] = users.map(createUserModel);
```

## テストの観点

### Presentation Layer のテスト

```typescript
// Pure componentは簡単にテスト可能
test('SearchInput renders correctly', () => {
  const handleChange = jest.fn();
  render(<SearchInput value="test" onChange={handleChange} />);
  
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'new value' } });
  
  expect(handleChange).toHaveBeenCalledWith('new value');
});
```

### Application Layer のテスト

```typescript
// Mockを使用してテスト
test('useUserSearch filters users', async () => {
  const mockRepository = {
    getAll: jest.fn().mockResolvedValue([
      createUserModel({ id: 1, name: 'John' }),
      createUserModel({ id: 2, name: 'Jane' }),
    ])
  };
  
  const { result } = renderHook(() => useUserSearch(mockRepository));
  
  await waitFor(() => expect(result.current.loading).toBe(false));
  
  act(() => result.current.setQuery('John'));
  
  expect(result.current.users).toHaveLength(1);
  expect(result.current.users[0].name).toBe('John');
});
```

### Domain Layer のテスト

```typescript
// 純粋関数なので最もテストしやすい
test('UserModel.matchesQuery works correctly', () => {
  const user = createUserModel({ id: 1, name: 'John Doe', email: 'john@example.com' });
  
  expect(user.matchesQuery('john')).toBe(true);
  expect(user.matchesQuery('doe')).toBe(true);
  expect(user.matchesQuery('example')).toBe(true);
  expect(user.matchesQuery('jane')).toBe(false);
});
```

### Infrastructure Layer のテスト

```typescript
// Mockを使用してAPIをモック
test('UserRepository.getAll fetches and converts users', async () => {
  const mockApiClient = {
    fetchUsers: jest.fn().mockResolvedValue([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ])
  };
  
  const repository = new UserRepositoryImpl(mockApiClient);
  const users = await repository.getAll();
  
  expect(mockApiClient.fetchUsers).toHaveBeenCalled();
  expect(users).toHaveLength(2);
  expect(users[0]).toBeInstanceOf(UserModel);
});
```

## まとめ

階層型アーキテクチャの本質は、**関心の分離 (Separation of Concerns)** です:

- **Presentation**: どう見せるか
- **Application**: どう使うか
- **Domain**: 何をするか
- **Infrastructure**: どこから取得するか

この分離により、各レイヤーは独立して開発・テスト・変更が可能になります。
