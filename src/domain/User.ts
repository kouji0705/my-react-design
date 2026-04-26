export type UserType = "ADMIN" | "GENERAL";

export class User {
  // 1. プロパティを明示的に宣言する
  public readonly id: number;
  public readonly name: string;
  public readonly type: UserType;

  constructor(id: number, name: string, type: UserType) {
    // 2. コンストラクタで代入する（これが標準的なJS/TSの動き）
    this.id = id;
    this.name = name;
    this.type = type;
  }

  // --- 以下は以前と同じ ---

  get typeLabel(): string {
    return this.type === "ADMIN" ? "管理者" : "一般ユーザー";
  }

  static empty(): User {
    return new User(0, "読み込み中...", "GENERAL");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromApi(data: any): User {
    return new User(
      data.id ?? 0,
      data.name ?? "名前なし",
      data.type ?? "GENERAL"
    );
  }
}