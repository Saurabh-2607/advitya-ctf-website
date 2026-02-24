// import { NextResponse } from "next/server";
// import connectDB from "@/lib/db";
// import Challenge from "@/lib/models/Challenge";
// import User from "@/lib/models/User";
// import jwt from "jsonwebtoken";
// import path from "path";
// import fs from "fs/promises";
// import { spawn } from "child_process";

// function dockerBuild(imageName, buildDir) {
//   return new Promise((resolve, reject) => {
//     const docker = spawn("docker", ["build", "-t", imageName, buildDir], {
//       stdio: ["ignore", "pipe", "pipe"],
//       env: {
//         ...process.env,
//         DOCKER_BUILDKIT: "1",
//       },
//     });

//     let stderr = "";

//     docker.stderr.on("data", (data) => {
//       stderr += data.toString();
//     });

//     docker.on("close", (code) => {
//       if (code !== 0) {
//         reject(new Error(stderr || "Docker build failed"));
//       } else {
//         resolve();
//       }
//     });
//   });
// }

// export async function POST(req) {
//   try {
//     /* ---------- AUTH ---------- */
//     const authHeader = req.headers.get("authorization");
//     if (!authHeader?.startsWith("Bearer ")) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 },
//       );
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const { challengeId } = await req.json();
//     if (!challengeId) {
//       return NextResponse.json(
//         { success: false, message: "challengeId missing" },
//         { status: 400 },
//       );
//     }

//     await connectDB();

//     const admin = await User.findById(decoded.userId).select("+password");
//     if (!admin || decoded.role !== "sudo" || admin.role !== "sudo") {
//       return NextResponse.json(
//         { success: false, message: "Forbidden" },
//         { status: 403 },
//       );
//     }

//     const challenge = await Challenge.findById(challengeId);
//     if (!challenge) {
//       return NextResponse.json(
//         { success: false, message: "Challenge not found" },
//         { status: 404 },
//       );
//     }

//     if (challenge.type !== "instance") {
//       return NextResponse.json(
//         { success: false, message: "Not an instance challenge" },
//         { status: 400 },
//       );
//     }

//     if (challenge.instance.buildStatus === "building") {
//       return NextResponse.json(
//         { success: false, message: "Build already running" },
//         { status: 409 },
//       );
//     }

//     /* ---------- FILE SYSTEM ---------- */
//     const challDir = path.join(
//       process.cwd(),
//       "uploads",
//       challenge._id.toString(),
//     );

//     const dockerfilePath = path.join(challDir, "Dockerfile");

//     try {
//       await fs.access(challDir);
//       await fs.access(dockerfilePath);
//     } catch {
//       challenge.instance.buildStatus = "failed";
//       challenge.instance.buildError = "Dockerfile missing";
//       await challenge.save();

//       return NextResponse.json(
//         { success: false, message: "Dockerfile missing" },
//         { status: 400 },
//       );
//     }

//     /* ---------- MARK BUILDING ---------- */
//     challenge.instance.buildStatus = "building";
//     challenge.instance.buildError = null;
//     await challenge.save();

//     /* ---------- DOCKER BUILD ---------- */
//     const imageName = `chall_${challenge._id}`;

//     try {
//       await dockerBuild(imageName, challDir);
//     } catch (err) {
//       challenge.instance.buildStatus = "failed";
//       challenge.instance.buildError = err.message;
//       await challenge.save();

//       return NextResponse.json(
//         {
//           success: false,
//           message: err.message,
//         },
//         { status: 400 },
//       );
//     }

//     /* ---------- SUCCESS ---------- */
//     challenge.instance.image = imageName;
//     challenge.instance.buildStatus = "built";
//     challenge.instance.buildError = null;
//     await challenge.save();

//     return NextResponse.json({
//       success: true,
//       message: "Docker image built successfully",
//     });
//   } catch (err) {
//     console.error("INSTANCE_BUILD_FATAL:", err);
//     return NextResponse.json(
//       { success: false, message: "Internal build error" },
//       { status: 500 },
//     );
//   }
// }

export async function POST(req) {
   return NextResponse.json({
      success: false,
      message: "Under Construction...",
    });
}