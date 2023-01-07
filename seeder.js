/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import _yargs from "yargs";
import { hideBin } from "yargs/helpers";
import Task from "./DatabaseScript.js";

const yargs = _yargs(hideBin(process.argv));
yargs.version("1.1.0");

yargs.command({
  command: "1",
  describe: "1. Create Tenant Table",
  handler(argv) {
    Task.addTenantTable();
  },
});

yargs.command({
  command: "2",
  describe: "2. Create Role Table",
  handler(argv) {
    Task.addRoleTable();
  },
});

yargs.command({
  command: "3",
  describe: "3. Create User Table",
  handler(argv) {
    Task.addUserTable();
  },
});

yargs.command({
  command: "4",
  describe: "4. Create Attendance Table",
  handler(argv) {
    Task.addAttendanceTable();
  },
});

yargs.parse();
