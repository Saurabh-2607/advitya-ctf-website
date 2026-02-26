import { createLogger } from "./baseLogger";

const errorLogger = createLogger("error.log", "error");

export default errorLogger;