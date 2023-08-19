import { Command } from "commander";
import initCommand from "./init";
import promptCommand from "./prompt";
const program = new Command();

program.addCommand(initCommand);
program.addCommand(promptCommand);

export default program;
