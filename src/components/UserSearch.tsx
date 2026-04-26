import { useUserSearch } from "../hooks/useUserSearch";
import { UserList } from "./UserList";

export const UserSearch = () => {
  // ロジック（知能）を呼び出す
  const { query, setQuery, filteredUsers, loading } = useUserSearch();

  // 見た目（体）に流し込む
  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h1>ユーザー検索（Step 1）</h1>
      <UserList
        users={filteredUsers}
        query={query}
        onQueryChange={setQuery}
        loading={loading}
      />
    </div>
  );
};