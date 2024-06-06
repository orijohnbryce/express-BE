import { AppException, UnknownError } from "../models/exceptions";
import { promises as fs } from "fs";
import { appConfig } from "./config";
import { Request } from "express";

export async function logIt(msg: string, req?: Request) {
  const now = new Date();
  const timeString = now.toISOString().replace(/T/, " ").replace(/\..+/, ""); // Format: YYYY-MM-DD HH:MM:SS

  let logMessage = timeString;
  if (req) {
    logMessage += `: ${req.url}`;
    logMessage += `: ${req.ip}`;
  }
  logMessage += `: ${msg}`;

  try {
    await fs.appendFile(appConfig.logFile, logMessage, { flag: "a" });
    // console.log("logged");
  } catch (writeError) {
    console.error("Failed to write error to log file:", writeError);
    throw new UnknownError("Server Error");
  }
}

export async function logError(err: AppException, req?: Request) {
  const logMessage = `${err.status}: ${err.message}\n`;
  logIt(logMessage, req);
}
