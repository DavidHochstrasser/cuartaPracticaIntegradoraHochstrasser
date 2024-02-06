import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();
program.option("--mode <mode>").option("--port <port>");
program.parse();

dotenv.config();

const config = {
  port: process.env.PORT,
  mongoUrl: process.env.MONGOOSE_URL,
};

export default config;
