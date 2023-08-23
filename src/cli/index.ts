import { Command } from "commander";
import initCommand from "./init";
import promptCommand from "./prompt";
import vectorSearchCommand from "./vector-search";
const program = new Command();

program.addCommand(initCommand);
program.addCommand(promptCommand);
program.addCommand(vectorSearchCommand);

export default program;
