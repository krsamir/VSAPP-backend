import Tenants from "./app/Database/Models/Tenants.js";
import Role from "./app/Database/Models/Role.js";
import User from "./app/Database/Models/User.js";
import bcryptjs from "bcryptjs";
import { ROLES } from "./Constants.js";
import moment from "moment";
const Task = {};
const log = console.log;

Task.addTenantTable = () => {
  Tenants.sync()
    .then(() => {
      log(`Tenant Table Created.`);
    })
    .catch((e) => {
      log(e);
    });
};

Task.addRoleTable = () => {
  Role.sync()
    .then(() => {
      log(`Role Table Created.`);
      Role.bulkCreate([
        { role: ROLES.SUPER_ADMIN.NAME },
        { role: ROLES.ADMIN.NAME },
        { role: ROLES.USER.NAME },
      ])
        .then(() => {
          console.log("Roles Table Populated !!");
        })
        .catch((e) => console.log(e));
    })
    .catch((e) => {
      log(e);
    });
};

Task.addUserTable = () => {
  var salt = bcryptjs.genSaltSync(10);
  var hashedPassword = bcryptjs.hashSync("admin", salt);
  User.sync()
    .then(() => {
      log(`User Table Created.`);
      User.create({
        username: "superadmin",
        name: "superadmin",
        password: hashedPassword,
        mobile: "7079583248",
        lastLogin: moment(),
        isActive: true,
        loginCount: 0,
        role: 1,
      })
        .then(() => console.log("Data Created."))
        .catch((e) => console.log(e));
    })
    .catch((e) => {
      log(e);
    });
};

export default Task;