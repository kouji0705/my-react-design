import { useState, useEffect } from "react";
import { fetchUsers } from "../infrastructure/UserFetcher";
import type { User } from "../domain/models/User"

export const useUserSearch = () => {
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