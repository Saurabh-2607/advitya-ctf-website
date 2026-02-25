import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Team from "@/lib/models/Team";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

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
    } catch (err) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired session. Login again.",
        },
        { status: 403 }
      );
    }

    await connectDB();

    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const team = await Team.findById(user.team)
      .select("-password -__v")
      .populate({
        path: "members",
        select: "name email solvedChallenges",
        populate: {
          path: "solvedChallenges",
          select: "name",
        },
      })
      .populate("leader", "name email");

    if (!team) {
      return NextResponse.json(
        { success: false, message: "User has no team" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        team,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/user/team error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
