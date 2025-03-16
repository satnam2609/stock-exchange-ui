import { connectDB } from "@/lib/db";
import User from "@/models/user";
import Portfolio from "@/models/portfolio";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: session?.user.email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const portfolio = await Portfolio.findOne({ user: user._id });

    return NextResponse.json(
      {
        message: {
          investedPrice: portfolio.investedPrice,
          holding: portfolio.holding,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Internal sever error" },
      { status: 500 }
    );
  }
}
