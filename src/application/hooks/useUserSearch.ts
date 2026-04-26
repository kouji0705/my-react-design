import { useState, useEffect } from "react";
import { type UserModel } from "../../domain/models/User";
import { type UserRepository } from "../../infrastructure/api/UserRepository";

/**
 * Application Layer - Custom Hook
 * 
 * アプリケーションのロジックとステート管理を担当
 * ViewとDomain/Infrastructureの間を仲介
 */

export interface UseUserSearchResult {
  users: UserModel[];
  query: string;
  setQuery: (query: string) => void;
  loading: boolean;
  error: string | null;
}

export const useUserSearch = (
  repository: UserRepository
): UseUserSearchResult => {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初回ロード: すべてのユーザーを取得
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const allUsers = await repository.getAll();
        setUsers(allUsers);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [repository]);

  // 検索クエリでフィルタリング
  const filteredUsers = users.filter(user => user.matchesQuery(query));

  return {
    users: filteredUsers,
    query,
    setQuery,
    loading,
    error,
  };
};
