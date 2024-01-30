import usersModel from "../models/users.model.js";

export default class UserManager {
  constructor() {}

  async getUsers() {
    try {
      const users = await usersModel.find().lean();

      return users;
    } catch (err) {
      return err.message;
    }
  }

  async getUsersPaginated(page, limit) {
    try {
      return await usersModel.paginate(
        { gender: "Female" },
        { offset: page * 50 - 50, limit: limit, lean: true }
      );
    } catch (err) {
      return err.message;
    }
  }
}
