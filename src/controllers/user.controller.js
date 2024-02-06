import { UserService } from "../services/user.mongo.dao.js";

const userService = new UserService();

export default class UserController {
  constructor() {}

  async getUsers() {
    try {
      return await userService.getUsers();
    } catch (err) {
      return err.message;
    }
  }

  async getUsersPaginated(page, limit) {
    try {
      return await userService.getUsersPaginated(page, limit);
    } catch (err) {
      return err.message;
    }
  }
}
