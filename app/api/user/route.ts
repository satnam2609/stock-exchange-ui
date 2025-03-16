import User from "@/models/user";
import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Portfolio from "@/models/portfolio";

export async function POST(
  request: NextRequest
): Promise<NextResponse> {
  const { name, email } = await request.json();
  await connectDB();
  try {
    const user = await User.create({
      name,
      email,
    });

    await Portfolio.create({
      user:user._id,
      investedPrice:0,
      hoding:0
    });

    
    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (error) {
    console.log("User creation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

