import { type User, UserListSchema } from "../../domain/models/User";

/**
 * Infrastructure Layer - API Client
 * 
 * 外部サービスとの通信を担当
 * Anti-Corruption Layer として機能し、外部APIの変更の影響を局所化
 */

export interface UserApiClient {
  fetchUsers(): Promise<User[]>;
}

/**
 * JSONPlaceholder API Client の実装
 */
export class JsonPlaceholderUserApiClient implements UserApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = "https://jsonplaceholder.typicode.com") {
    this.baseUrl = baseUrl;
  }

  /**
   * ユーザー一覧を取得
   */
  async fetchUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${this.baseUrl}/users`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();

      // バリデーション: 外部データを検証して型安全なデータに変換
      const result = UserListSchema.safeParse(rawData);

      if (!result.success) {
        console.error("Validation error:", result.error.format());
        return [];
      }

      return result.data;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      return [];
    }
  }
}

/**
 * デフォルトのAPIクライアントインスタンス
 */
export const userApiClient = new JsonPlaceholderUserApiClient();
