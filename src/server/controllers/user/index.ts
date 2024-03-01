import * as create from "./create";
import * as login from "./login";
import * as edit from "./updateUserById";
import * as getUserById from "./getById";
import * as checkUser from "./checkUser";
import * as validationLogin from "./validationLogin";
import * as validationRegister from "./validationRegister";
import * as getByToken from './getByToken'
import * as getAll from './getAll'
import * as createAddress from './address/createAddress'
import * as updateAddress from './address/updateAddressById'
import * as getAddressById from './address/getById'
import * as validationAddress from './address/validationAddress'

export const UserController = {
  ...create,
  ...login,
  ...edit,
  ...getUserById,
  ...getByToken,
  ...getAll,
  ...checkUser,
  ...validationLogin,
  ...validationRegister,
  ...createAddress,
  ...updateAddress,
  ...getAddressById,
  ...validationAddress
};
