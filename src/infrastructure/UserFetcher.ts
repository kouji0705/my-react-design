import { type User, UserListSchema } from "../domain/User";

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!res.ok) throw new Error("Network error");

    const rawData = await res.json();

    // 🕵️ safeParse による検問（Goの if err != nil スタイル）
    const result = UserListSchema.safeParse(rawData);

    if (!result.success) {
      // バリデーション失敗。ログを出し、UIには安全な「空データ」を返す
      console.error("バリデーション失敗:", result.error.format());
      return []; 
    }

    // 検証済みのクリーンなデータを返す
    return result.data;
  } catch (error) {
    console.error("通信エラー:", error);
    return [];
  }
};