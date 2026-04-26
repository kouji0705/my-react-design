import { type User, createUserModel, type UserModel } from "../../domain/models/User";
import { type UserApiClient } from "./UserApiClient";

/**
 * Infrastructure Layer - Repository Pattern
 * 
 * データの取得と変換を担当
 * APIクライアントを使用してデータを取得し、ドメインモデルに変換
 */

export interface UserRepository {
  getAll(): Promise<UserModel[]>;
  search(query: string): Promise<UserModel[]>;
}

export class UserRepositoryImpl implements UserRepository {
  private readonly apiClient: UserApiClient;

  constructor(apiClient: UserApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * すべてのユーザーを取得
   */
  async getAll(): Promise<UserModel[]> {
    const users = await this.apiClient.fetchUsers();
    return this.convertToModels(users);
  }

  /**
   * 検索クエリに一致するユーザーを取得
   */
  async search(query: string): Promise<UserModel[]> {
    const allUsers = await this.getAll();
    
    if (!query) {
      return allUsers;
    }

    return allUsers.filter(user => user.matchesQuery(query));
  }

  /**
   * 生のデータをドメインモデルに変換
   */
  private convertToModels(users: User[]): UserModel[] {
    return users.map(createUserModel);
  }
}
