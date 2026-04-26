import { z } from "zod";

/**
 * Domain Layer - User Model
 * 
 * ビジネスロジックとドメインモデルを定義
 * UIやデータ取得の詳細には依存しない純粋なビジネスロジック
 */

// スキーマ定義：APIから返されるデータの構造と検証ルール
export const UserSchema = z.object({
  id: z.number(),
  name: z.string().default("名前なし"),
  email: z.string().email().optional(),
  username: z.string().optional(),
});

export const UserListSchema = z.array(UserSchema);

// 型の抽出
export type User = z.infer<typeof UserSchema>;

/**
 * User クラス - ドメインモデル
 * データとビジネスロジックをカプセル化
 */
export class UserModel {
  private readonly _id: number;
  private readonly _name: string;
  private readonly _email?: string;
  private readonly _username?: string;

  constructor(user: User) {
    this._id = user.id;
    this._name = user.name;
    this._email = user.email;
    this._username = user.username;
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string | undefined {
    return this._email;
  }

  get username(): string | undefined {
    return this._username;
  }

  /**
   * ビジネスロジック: 表示用の名前を取得
   */
  get displayName(): string {
    return this._name || this._username || "Unknown User";
  }

  /**
   * ビジネスロジック: 検索クエリに一致するか判定
   */
  matchesQuery(query: string): boolean {
    if (!query) return true;
    
    const lowerQuery = query.toLowerCase();
    const searchableText = [
      this._name,
      this._email,
      this._username,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(lowerQuery);
  }

  /**
   * ビジネスロジック: ユーザー情報の概要を取得
   */
  getSummary(): string {
    const parts = [this.displayName];
    if (this._email) parts.push(`(${this._email})`);
    return parts.join(" ");
  }
}

/**
 * ファクトリー関数: 生のデータからドメインモデルを生成
 */
export const createUserModel = (user: User): UserModel => {
  return new UserModel(user);
};

/**
 * 初期状態（Null Object パターン）
 */
export const EMPTY_USER: User = {
  id: 0,
  name: "読み込み中...",
};
