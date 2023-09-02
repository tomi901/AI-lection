import { Command } from "commander";
import initCommand from "./init";
import promptCommand from "./prompt";
import vectorSearchCommand from "./vector-search";
import chatCommand from "./chat";

const program = new Command();

program.addCommand(initCommand);
program.addCommand(promptCommand);
program.addCommand(chatCommand);
program.addCommand(vectorSearchCommand);

export default program;
