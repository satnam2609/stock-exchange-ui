import { connectDB } from "@/lib/db";
import User from "@/models/user";
import Order from "@/models/order";
import Portfolio from "@/models/portfolio";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const { id } = await request.json();
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error(
        JSON.stringify({ message: "Unauthorized User", status: 401 })
      );
    }
    await connectDB();

    const user = await User.findOne({ email: session?.user.email });

    if (!user) {
      throw new Error(
        JSON.stringify({ message: "User not found", status: 404 })
      );
    }

    const order = await Order.findOne({ orderId: id });

    if (!order) {
      throw new Error(
        JSON.stringify({ message: "Order not found", status: 404 })
      );
    }

    if (order.orderType === "BID") {
      await User.findOneAndUpdate(
        { _id: user._id },
        {
          $inc: {
            balance: -order.price * order.shares,
          },
        },
        {
          new: true,
        }
      );
    } else {
      await Portfolio.findOneAndUpdate(
        { user: user._id },
        {
          $inc: {
            investedPrice: -order.price * order.shares,
            holding: -order.shares,
          },
        },
        {
          new: true,
        }
      );
    }

    await Order.findOneAndUpdate(
      { _id: order._id },
      {
        orderStatus: "CANCEL",
      },
      {
        new: true,
      }
    );

    return NextResponse.json({ message: "Cancelled" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message ? error.message : "Internal server error" },
      { status: error.status ? error.status : 500 }
    );
  }
}
