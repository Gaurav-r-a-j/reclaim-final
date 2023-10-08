import { cleanEnv, port, str, num } from "envalid";

export default cleanEnv(process.env, {
  MONGO_CONNECTION_STRING: str(),
  PORT: port(),
  SESSION_SECRET: str(),
  SMTP_HOST: str(),
  SMTP_PORT: num(),
  SMTP_EMAIL: str(),
  SMTP_PWD: str(),
  JWT_SECRET: str(),
});
