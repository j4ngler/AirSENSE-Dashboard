const HttpStatus = require("http-status-codes");
const bcrypt = require("bcryptjs");
const User = require("../models/database/user.model.js");
const knex = require("../config/knex.js");
const {
  returnOK,
  returnFalse,
  returnNotFound,
} = require("../utils/returnResponse.js");

var userCtrl = {};

userCtrl.registerUser = async function (req, res) {
  try {
    const { userName, fullName, email, phoneNumber, password, address } = req.body;
    
    // Check if user exists
    const existingUser = await knex("users")
      .where({ email: email, delete_flag: 0 })
      .first();
    
    if (existingUser) {
      return returnFalse(res, {
        success: false,
        message: "Email đã tồn tại",
      });
    }

    // Hash password
    const salt = bcrypt.genSaltSync(12);
    const hashPass = await bcrypt.hash(password, salt);

    // Insert user
    const [userId] = await knex("users").insert({
      username: userName,
      fullname: fullName,
      email: email,
      phone_number: phoneNumber,
      password: hashPass,
      address: address,
      permission_id: 11, // NEW_REGISTER
      delete_flag: 0,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return returnOK(res, {
      success: true,
      message: "Đăng ký thành công",
      user_id: userId,
    });
  } catch (error) {
    console.error("Register error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi đăng ký",
    });
  }
};

userCtrl.getUsers = async function (req, res) {
  try {
    const users = await knex("users")
      .where({ delete_flag: 0 })
      .select("user_id", "username", "fullname", "email", "phone_number", "address", "permission_id");
    
    return returnOK(res, users);
  } catch (error) {
    console.error("Get users error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi lấy danh sách người dùng",
    });
  }
};

userCtrl.getUserById = async function (req, res) {
  try {
    const { id } = req.params;
    const user = await knex("users")
      .where({ user_id: id, delete_flag: 0 })
      .first();
    
    if (!user) {
      return returnNotFound(res, {
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    delete user.password;
    return returnOK(res, user);
  } catch (error) {
    console.error("Get user error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi lấy thông tin người dùng",
    });
  }
};

userCtrl.updateUser = async function (req, res) {
  try {
    const { id } = req.params;
    const { fullname, phone, email, address } = req.body;
    
    await knex("users")
      .where({ user_id: id })
      .update({
        fullname,
        phone_number: phone,
        email,
        address,
        updated_at: new Date(),
      });

    return returnOK(res, {
      success: true,
      message: "Cập nhật thành công",
    });
  } catch (error) {
    console.error("Update user error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi cập nhật",
    });
  }
};

userCtrl.deleteUser = async function (req, res) {
  try {
    const { id } = req.params;
    
    await knex("users")
      .where({ user_id: id })
      .update({
        delete_flag: 1,
        updated_at: new Date(),
      });

    return returnOK(res, {
      success: true,
      message: "Xóa thành công",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi xóa",
    });
  }
};

userCtrl.changePassword = async function (req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.currentUser.user_id;

    const user = await knex("users")
      .where({ user_id: userId, delete_flag: 0 })
      .first();

    if (!user) {
      return returnNotFound(res, {
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return returnFalse(res, {
        success: false,
        message: "Mật khẩu cũ không đúng",
      });
    }

    const salt = bcrypt.genSaltSync(12);
    const hashPass = await bcrypt.hash(newPassword, salt);

    await knex("users")
      .where({ user_id: userId })
      .update({
        password: hashPass,
        updated_at: new Date(),
      });

    return returnOK(res, {
      success: true,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi đổi mật khẩu",
    });
  }
};

module.exports = userCtrl;

