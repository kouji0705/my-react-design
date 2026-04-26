import { User } from "../domain/User";

export const fetchUsers = async (): Promise<User[]> => {
  // ここが "https://" で始まっているか、余計な文字がないか確認
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((u: any) => User.fromApi(u));
};