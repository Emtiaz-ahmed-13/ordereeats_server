import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt: {
    jwt_secret: process.env.JWT_SECRET || "emtiaz",
    expires_in: process.env.JWT_EXPIRES_IN || "7d",
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET || "emtiaz",
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN || "30d",
    reset_pass_secret: process.env.JWT_RESET_PASS_TOKEN || "reset_secret",
    reset_pass_token_expires_in: process.env.JWT_RESET_PASS_TOKEN_EXPIRES_IN || "1h",
  },
};
