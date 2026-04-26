import { useUserSearch } from "../../application/hooks/useUserSearch";
import { UserRepositoryImpl } from "../../infrastructure/api/UserRepository";
import { userApiClient } from "../../infrastructure/api/UserApiClient";
import { SearchInput } from "../components/SearchInput";
import { UserList } from "../components/UserList";

/**
 * Presentation Layer - Container Component (Page)
 * 
 * アプリケーション層のhookを使用してデータを取得し、
 * プレゼンテーショナルコンポーネントに渡す
 */

// 依存性注入: Repositoryのインスタンスを作成
const userRepository = new UserRepositoryImpl(userApiClient);

export const UserSearchPage = () => {
  // アプリケーション層からデータとロジックを取得
  const { users, query, setQuery, loading, error } = useUserSearch(userRepository);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            margin: "0 0 24px 0",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          ユーザー検索
        </h2>

        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="名前またはメールアドレスで検索..."
        />

        <div style={{ marginTop: "8px", marginBottom: "16px", color: "#666" }}>
          {!loading && `${users.length}件のユーザー`}
        </div>

        <UserList users={users} loading={loading} error={error} />
      </div>
    </div>
  );
};
