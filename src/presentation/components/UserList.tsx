import { type UserModel } from "../../domain/models/User";
import { UserListItem } from "./UserListItem";

/**
 * Presentation Layer - Presentational Component
 * 
 * ユーザー一覧を表示する純粋なコンポーネント
 * ビジネスロジックを持たず、表示のみを担当
 */

interface UserListProps {
  users: UserModel[];
  loading: boolean;
  error: string | null;
}

export const UserList = ({ users, loading, error }: UserListProps) => {
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
        <div style={{ fontSize: "18px" }}>読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          color: "#f44336",
          backgroundColor: "#ffebee",
          borderRadius: "8px",
        }}
      >
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>エラー</div>
        <div style={{ marginTop: "8px" }}>{error}</div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          color: "#999",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
        }}
      >
        該当するユーザーがいません
      </div>
    );
  }

  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {users.map((user) => (
        <UserListItem key={user.id} user={user} />
      ))}
    </ul>
  );
};
