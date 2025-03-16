import { connectDB } from "@/lib/db";
import User from "@/models/user";
import Order from "@/models/order";
import Portfolio from "@/models/portfolio";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const { id, status, tradePrice, shares } = await request.json();

    const session = await getServerSession(authOptions);

    await connectDB();

    const user = await User.findOne({ email: session?.user.email });

    if (!user) {
      throw new Error(
        JSON.stringify({ message: "User not found", status: 404 })
      );
    }

    const order = await Order.findOne({ orderId: id });
    console.log(order);
    if (!order) {
      throw new Error(
        JSON.stringify({ message: "Order not found", status: 404 })
      );
    }

    await Order.findOneAndUpdate(
      { _id: order._id },
      {
        $inc: {
          quantityFilled: shares,
        },
        orderStatus: status,
      },
      {
        new: true,
      }
    );

    // now after that the order has to be updated
    // if the order side was BID then update the portfolio

    if (order.orderType === "BID") {
      await User.findOneAndUpdate(
        { _id: user._id },
        {
          $inc: {
            balance: order.price - tradePrice,
          },
        },
        {
          new: true,
        }
      );

      await Portfolio.findOneAndUpdate(
        { user: user._id },
        {
          $inc: {
            investedPrice: tradePrice * shares,
            holding: shares,
          },
        },
        {
          new: true,
        }
      );
    }
    // else update the user's balance
    else {
      await User.findOneAndUpdate(
        { _id: user._id },
        {
          $inc: {
            balance: tradePrice,
          },
        },
        {
          new: true,
        }
      );
    }

    return NextResponse.json({ message: "Ok" }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: error.message ? error.message : "Internal server error" },
      { status: error.status ? error.status : 500 }
    );
  }
}
