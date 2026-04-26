import { User } from "../domain/User";

export const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch("[https://jsonplaceholder.typicode.com/users](https://jsonplaceholder.typicode.com/users)");
  const data = await res.json();
  // APIデータをDomainモデルの配列に変換して返す
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((u: any) => User.fromApi(u));
};