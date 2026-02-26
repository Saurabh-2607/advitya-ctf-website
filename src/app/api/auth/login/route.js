import userSchema from "@/lib/models/User";
import connectDB from "@/lib/db";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimiter";
import { authLogger, errorLogger } from "@/utils/loggers";

const loginLimiter = rateLimit({ windowMs: 60_000, max: 5 });

export async function POST(req) {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "Unknown";

  try {
    const { email, password } = await req.json();
    const key = `${ip}:${email}`;

    if (!loginLimiter(key)) {
      authLogger.warn(
        `Login Rate Limit | IP: ${ip} Email: ${email}`
      );

      return NextResponse.json(
        {
          success: false,
          message: "Too many login attempts, try again later.",
        },
        { status: 429 }
      );
    }

    await connectDB();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and Password required" },
        { status: 400 }
      );
    }

    const user = await userSchema.findOne({ email }).select("+password");

    if (!user) {
      authLogger.warn(
        `Login Failed (User Not Found) | IP: ${ip} Email: ${email}`
      );

      return NextResponse.json(
        { success: false, message: "Invalid Credentials" },
        { status: 400 }
      );
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      authLogger.warn(
        `Login Failed (Wrong Password) | IP: ${ip} UserId: ${user._id} Email: ${email}`
      );

      return NextResponse.json(
        { success: false, message: "Invalid Credentials" },
        { status: 400 }
      );
    }

    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        role: user.role,
        team: user.team || null,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    authLogger.info(
      `Login Success | IP: ${ip} UserId: ${user._id} Name: ${user.name} Role: ${user.role}`
    );

    return NextResponse.json({
      success: true,
      message: "Login Success",
      token,
      user: {
        name: user.name,
        id: user._id,
      },
    });

  } catch (err) {
    errorLogger.error(err.stack || err.message);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}