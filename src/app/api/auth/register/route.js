import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PendingUser from "@/lib/models/PendingUser";
import User from "@/lib/models/User";
import { sendOtpEmail } from "@/lib/ses";

import { rateLimit } from "@/lib/rateLimiter";

const registerLimiter = rateLimit({
  windowMs: 60_000,
  max: 5,
});


const isVitEmail = (email) =>
  email.toLowerCase().endsWith("@vitbhopal.ac.in");

const isStrongPassword = (pwd) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(pwd);

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const CTF_START = new Date(process.env.CTF_START_UTC);

export async function POST(req) {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";


  const now = new Date();

  if (now >= CTF_START) {
    return NextResponse.json(
      { success: false, message: "Registration is closed." },
      { status: 403 }
    );
  }

  try {
    const { name, email, password } = await req.json();
    const key = `${ip}:${email}`;

    if (!registerLimiter(key)) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many requests. Please try again later.",
        },
        { status: 429 }
      );
    }

    if (!name || name.length < 2) {
      return NextResponse.json(
        { success: false, message: "Invalid name" },
        { status: 400 }
      );
    }

    if (!email || !isVitEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Only @vitbhopal.ac.in emails allowed" },
        { status: 400 }
      );
    }

    if (!password || !isStrongPassword(password)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be 8+ chars with upper, lower, number & symbol",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already registered" },
        { status: 409 }
      );
    }

    const existingPending = await PendingUser.findOne({ email });

    if (existingPending) {
      const now = new Date();

      if (existingPending.updatedAt &&
        now - existingPending.updatedAt < 60 * 1000) {
        return NextResponse.json(
          { success: false, message: "Please wait before requesting another OTP" },
          { status: 429 }
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
      }
    );


    await sendOtpEmail(email, otp);

    console.log("OTP sent to:", email, otp);  // FOR TESTING I AM DOING... REMOVE LATER

    return NextResponse.json(
      { success: true, message: "OTP sent to email" },
      { status: 200 }
    );
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}