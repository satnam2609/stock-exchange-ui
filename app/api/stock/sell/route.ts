import { connectDB } from "@/lib/db";
import User from "@/models/user";
import Order from "@/models/order";
import Portfolio from "@/models/portfolio";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 403 }
      );
    }

    const { price, shares } = await request.json();

    await connectDB();

    const user = await User.findOne({ email: session?.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const portfolio = await Portfolio.findOne({ user: user._id });
    if (!portfolio) {
      return NextResponse.json(
        { message: "Portfolio not found" },
        { status: 404 }
      );
    }

    if (portfolio.holding < shares) {
      return NextResponse.json(
        { message: "Insufficient holdings" },
        { status: 403 }
      );
    }

    const request_response = await fetch(
      "http://localhost:3500/request_order",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          session: session?.user.id,
          message: {
            Insert: {
              price: Number(price),
              shares: Number(shares),
              order_type: "ASK",
            },
          },
        }),
      }
    );

    const response = await request_response.json();

    if (response.res["Ok"]) {
      const inserted_res = response.res["Ok"]["Inserted"];

      const order = await Order.create({
        orderId: inserted_res[0],
        price,
        shares,
        orderType: "ASK",
      });

      await User.findOneAndUpdate(
        {
          _id: user._id,
        },
        {
          $push: {
            orders: order._id,
          },
        },
        {
          new: true,
        }
      );

      await Portfolio.findOneAndUpdate(
        { _id: portfolio._id },
        {
          $inc: {
            investedPrice: portfolio.holding===shares?0:-price*shares,
            holding: -shares,
          },
        },
        {
          new: true,
        }
      );

      return NextResponse.json({ message: inserted_res[0] }, { status: 201 });
    }
    throw new Error(response.res["Error"]);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
