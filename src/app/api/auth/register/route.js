import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PendingUser from "@/lib/models/PendingUser";
import User from "@/lib/models/User";
import { sendOtpEmail } from "@/lib/ses";
import { rateLimit } from "@/lib/rateLimiter";
import { authLogger, errorLogger } from "@/utils/loggers";

const registerLimiter = rateLimit({
  windowMs: 60_000,
  max: 5,
});

const isVitEmail = (email) => email.toLowerCase().endsWith("@vitbhopal.ac.in");

const isStrongPassword = (pwd) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(pwd);

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const CTF_START = new Date(process.env.CTF_START_UTC);

export async function POST(req) {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

  const now = new Date();

  try {
    const { name, email, password } = await req.json();
    const key = `${ip}:${email}`;

    if (!registerLimiter(key)) {
      authLogger.warn(`Registration Rate Limit | IP: ${ip} Email: ${email}`);

      return NextResponse.json(
        {
          success: false,
          message: "Too many requests. Please try again later.",
        },
        { status: 429 },
      );
    }

    if (now >= CTF_START) {
      authLogger.warn(`Registration Blocked (CTF Started) | IP: ${ip} Email: ${email}`);

      return NextResponse.json(
        { success: false, message: "Registration is closed." },
        { status: 403 },
      );
    }

    if (!name || name.length < 2) {
      authLogger.warn(`Registration Invalid Name | IP: ${ip} Email: ${email}`);

      return NextResponse.json(
        { success: false, message: "Invalid name" },
        { status: 400 },
      );
    }

    if (!email || !isVitEmail(email)) {
      authLogger.warn(
        `Registration Invalid Email Domain | IP: ${ip} Email: ${email}`,
      );

      return NextResponse.json(
        { success: false, message: "Only @vitbhopal.ac.in emails allowed" },
        { status: 400 },
      );
    }

    if (!password || !isStrongPassword(password)) {
      authLogger.warn(`Registration Weak Password | IP: ${ip} Email: ${email}`);

      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be 8+ chars with upper, lower, number & symbol",
        },
        { status: 400 },
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      authLogger.warn(
        `Registration Already Exists | IP: ${ip} Email: ${email}`,
      );

      return NextResponse.json(
        { success: false, message: "User already registered" },
        { status: 409 },
      );
    }

    const existingPending = await PendingUser.findOne({ email });

    if (existingPending) {
      const now = new Date();

      if (
        existingPending.updatedAt &&
        now - existingPending.updatedAt < 60 * 1000
      ) {
        authLogger.warn(`OTP Spam Attempt | IP: ${ip} Email: ${email}`);

        return NextResponse.json(
          {
            success: false,
            message: "Please wait before requesting another OTP",
          },
          { status: 429 },
        );
      }
    }

    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await PendingUser.findOneAndUpdate(
      { email },
      {
        name,
        email,
        password,
        otp,
        otpExpiresAt,
        updatedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    await sendOtpEmail(email, otp);

    authLogger.info(`OTP Sent | IP: ${ip} Email: ${email} Name: ${name}`);

    return NextResponse.json(
      { success: true, message: "OTP sent to email" },
      { status: 200 },
    );
  } catch (err) {
    errorLogger.error(err.stack || err.message);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
