import * as create from "./create";
import * as login from "./login";
import * as edit from "./updateUserById";
import * as getUserById from "./getById";
import * as checkUser from "./checkUser";
import * as validationLogin from "./validationLogin";
import * as validationRegister from "./validationRegister";
import * as getByToken from './getByToken'
import * as getAll from './getAll'
import * as createAddress from './address/create'
import * as updateAddress from './address/updateAddressById'
import * as getAdressById from './address/getById'
import * as validarionAdress from './address/validationAdress'

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
  ...getAdressById,
  ...validarionAdress
};
