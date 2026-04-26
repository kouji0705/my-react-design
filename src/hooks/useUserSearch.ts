import { useState, useEffect } from "react";

// APIから返ってくるデータの型定義
type User = {
  id: number;
  name: string;
  email: string;
};

export const useUserSearch = () => {
  const [users, setUsers] = useState<User[]>([]); // 全データ
  const [query, setQuery] = useState("");         // 検索窓の入力値
  const [loading, setLoading] = useState(true);   // ローディング状態

  // コンポーネントのマウント時に1回だけ実行
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  // データの導出（Derived State）
  // usersが変わるか、queryが変わるたびに自動で再計算される
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase())
  );

  return {
    query,
    setQuery,
    filteredUsers,
    loading,
  };
};