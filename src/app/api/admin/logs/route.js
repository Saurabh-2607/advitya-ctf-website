import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

export async function GET(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await connectDB();
    const adminUser = await User.findById(decoded.userId);

    if (decoded.role === "sudo" && adminUser?.role === "sudo") {
      const logsDir = path.join(process.cwd(), "logs");

      const logFiles = [
        { file: "auth.log", type: "auth" },
        { file: "flags.log", type: "flags" },
        { file: "error.log", type: "error" },
      ];

      let logs = [];

      for (const { file, type } of logFiles) {
        const filePath = path.join(logsDir, file);

        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, "utf-8");

          const lines = content
            .split("\n")
            .filter(Boolean)
            .slice(-100);

          lines.forEach((line) => {
            logs.push({
              type,
              message: line,
            });
          });
        }
      }

      logs.reverse();

      return new Response(
        JSON.stringify({
          success: true,
          role: decoded.role,
          logs,
          message: "Logs fetched",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          role: decoded.role,
          message: "Forbidden: Not Admin",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (err) {
    console.error("JWT error:", err);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Invalid or expired token",
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
}