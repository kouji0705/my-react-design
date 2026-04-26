import { type UserModel } from "../../domain/models/User";

/**
 * Presentation Layer - Pure Component
 * 
 * 1つのユーザーを表示する純粋なコンポーネント
 */

interface UserListItemProps {
  user: UserModel;
}

export const UserListItem = ({ user }: UserListItemProps) => {
  return (
    <li
      style={{
        padding: "16px",
        borderBottom: "1px solid #f0f0f0",
        transition: "background-color 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#f9f9f9";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "4px" }}>
        {user.displayName}
      </div>
      {user.email && (
        <div style={{ fontSize: "14px", color: "#666" }}>
          {user.email}
        </div>
      )}
    </li>
  );
};
