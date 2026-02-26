import connectDB from "@/lib/db";
import Notification from "@/lib/models/Notification";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired Session. Login Again...",
        },
        { status: 403 }
      );
    }

    await connectDB();

    const user = await User.findById(decoded.userId)
      .select("team role")
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const conditions = [
      { scope: "global" },
      { scope: "user", targetUser: user._id },
    ];

    if (user.team) {
      conditions.push({
        scope: "team",
        targetTeam: user.team,
      });
    }

    const notifications = await Notification.find({
      $or: conditions,
    })
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();

    return NextResponse.json(
      {
        success: true,
        notifications,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Notifications API error:", err);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}