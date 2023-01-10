import User from "./User.js";
import Role from "./Role.js";
import Tenants from "./Tenants.js";
import Attendance from "./Attendance.js";

User.belongsTo(Tenants, { as: "tenant" });
User.belongsTo(Role, { as: "role" });
Attendance.belongsTo(User, { as: "user" });
User.hasMany(Attendance, { as: "attendance" });
export { User, Role, Tenants, Attendance };
