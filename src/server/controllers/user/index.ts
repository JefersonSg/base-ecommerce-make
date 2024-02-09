import * as create from "./create";
import * as login from "./login";
import * as edit from "./updateUserById";
import * as getUserById from "./getById";
import * as checkUser from "./checkUser";
import * as validationLogin from "./validationLogin";
import * as validationRegister from "./validationRegister";

export const UserController = {
  ...create,
  ...login,
  ...edit,
  ...getUserById,
  ...checkUser,
  ...validationLogin,
  ...validationRegister,
};
