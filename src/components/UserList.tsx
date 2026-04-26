type User = {
  id: number;
  name: string;
};

type Props = {
  users: User[];
  query: string;
  onQueryChange: (val: string) => void;
  loading: boolean;
};

export const UserList = ({ users, query, onQueryChange, loading }: Props) => {
  if (loading) return <p>読み込み中...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <input
        type="text"
        value={query}
        placeholder="名前で検索..."
        onChange={(e) => onQueryChange(e.target.value)}
        style={{ marginBottom: "20px", padding: "8px", width: "300px" }}
      />
      <ul style={{ listStyle: "none", padding: 0 }}>
        {users.map((user) => (
          <li key={user.id} style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
            <strong>{user.name}</strong>
          </li>
        ))}
      </ul>
      {users.length === 0 && <p>該当するユーザーがいません。</p>}
    </div>
  );
};