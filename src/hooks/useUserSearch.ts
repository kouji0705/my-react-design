import { useState, useEffect } from "react";
import { User } from "../domain/User";
import { fetchUsers } from "../infrastructure/UserFetcher";

export const useUserSearch = () => {
  // 初期値として User.empty() を使うことで、初回から「型」を保証する
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers().then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(query.toLowerCase())
  );

  return { query, setQuery, filteredUsers, loading };
};