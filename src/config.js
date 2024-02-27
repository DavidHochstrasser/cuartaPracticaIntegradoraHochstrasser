import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();
program.option("--mode <mode>").option("--port <port>");
program.parse();

switch (program.opts().mode) {
  case "prod":
    dotenv.config({ path: "./.env.prod" });
    break;

  case "devel":
  default:
    dotenv.config({ path: "./.env.devel" });
}

dotenv.config();

const config = {
  port: process.env.PORT || 8000,
  mongoUrl: process.env.MONGOOSE_URL,
  SECRET_KEY: process.env.SECRET_KEY,
  GITHUB_AUTH: {
    clientId: process.env.GITHUB_AUTH_CLIENT_ID,
    clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET,
    callbackUrl: `http://localhost:${
      program.opts().PORT || process.env.PORT || 3000
    }/api/auth/githubcallback`,
  },

  MODE: program.opts().mode || "devel",
};

export default config;
