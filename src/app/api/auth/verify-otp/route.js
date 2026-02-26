import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PendingUser from "@/lib/models/PendingUser";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";
import { rateLimit } from "@/lib/rateLimiter";
import { authLogger, errorLogger } from "@/utils/loggers";

const verifyLimiter = rateLimit({
  windowMs: 60_000,
  max: 10,
});

const CTF_START = new Date(process.env.CTF_START_UTC);

export async function POST(req) {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

  const now = new Date();

  try {
    const body = await req.json();
    const { email, otp } = body;

    const key = `${ip}:${email}`;

    if (!verifyLimiter(key)) {
      authLogger.warn(`OTP Rate Limit | IP: ${ip} Email: ${email}`);
      return NextResponse.json(
        {
          success: false,
          message: "Too many OTP attempts. Please try again later.",
        },
        { status: 429 },
      );
    }

    if (now >= CTF_START) {
      authLogger.warn(
        `OTP Verify Blocked (CTF Started) | IP: ${ip} Email: ${email}`,
      );
      return NextResponse.json(
        { success: false, message: "Registration is closed." },
        { status: 403 },
      );
    }

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP are required" },
        { status: 400 },
      );
    }
    const inputOtp = otp.toString().trim();

    if (!/^\d{6}$/.test(inputOtp)) {
      authLogger.warn(`OTP Invalid Format | IP: ${ip} Email: ${email}`);
      return NextResponse.json(
        { success: false, message: "Invalid OTP format" },
        { status: 400 },
      );
    }

    await connectDB();

    const pendingUser = await PendingUser.findOne({ email });

    if (!pendingUser) {
      authLogger.warn(
        `OTP Verify Failed (No Entry Found) | IP: ${ip} Email: ${email}`,
      );
      return NextResponse.json(
        { success: false, message: "Register Again.. " },
        { status: 404 },
      );
    }

    if (pendingUser.otpExpiresAt < new Date()) {
      await PendingUser.deleteOne({ email });
      authLogger.warn(`OTP Expired | IP: ${ip} Email: ${email}`);
      return NextResponse.json(
        { success: false, message: "OTP expired, Register Again" },
        { status: 410 },
      );
    }

    if (pendingUser.attempts >= 5) {
      await PendingUser.deleteOne({ email });
      authLogger.warn(`OTP Attempts Exceeded | IP: ${ip} Email: ${email}`);
      return NextResponse.json(
        {
          success: false,
          message: "Too many invalid attempts. Register again.",
        },
        { status: 429 },
      );
    }

    if (pendingUser.otp !== inputOtp) {
      pendingUser.attempts += 1;
      await pendingUser.save();

      authLogger.warn(
        `OTP Incorrect | IP: ${ip} Email: ${email} Attempts: ${pendingUser.attempts}`,
      );

      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 401 },
      );
    }

    const user = await User.create({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
      role: "user",
    });

    await PendingUser.deleteOne({ email });

    const token = jwt.sign(
      { userId: user._id, name: user.name, role: user.role, team: null },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    authLogger.info(
      `OTP Verified | Registration Success | IP: ${ip} UserId: ${user._id} Email: ${email}`,
    );

    return NextResponse.json({
      success: true,
      message: "Registration Successful",
      token: token,
      user: {
        name: user.name,
        id: user._id,
      },
    });
  } catch (err) {
    errorLogger.error(err.stack || err.message);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
