import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PendingUser from "@/lib/models/PendingUser";
import User from "@/lib/models/User";
import { sendOtpEmail } from "@/lib/ses";

/* ---------------- HELPERS ---------------- */

const isVitEmail = (email) =>
  email.toLowerCase().endsWith("@vitbhopal.ac.in");

const isStrongPassword = (pwd) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(pwd);

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/* ---------------- POST /register ---------------- */

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    /* ---------- VALIDATION ---------- */

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

    /* ---------- CHECK IF USER EXISTS ---------- */

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already registered" },
        { status: 409 }
      );
    }

    /* ---------- OTP SETUP ---------- */

    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    /* ---------- REMOVE OLD PENDING ---------- */

    await PendingUser.deleteOne({ email });

    const pendingUser = new PendingUser({
      name,
      email,
      password,
      otp,
      otpExpiresAt,
    });

    await pendingUser.save();

    /* ---------- SEND EMAIL ---------- */

    await sendOtpEmail(email, otp);

    console.log("OTP sent to:", email);

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