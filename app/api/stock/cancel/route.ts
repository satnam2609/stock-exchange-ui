import { connectDB } from "@/lib/db";
import User from "@/models/user";
import Order from "@/models/order";
import Portfolio from "@/models/portfolio";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(request: NextRequest) {
  try {
    const { id } = await request.json();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session?.user.email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const request_response = await fetch(
      "http://localhost:3500/request_order",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          session: session.user.id,
          message: {
            Cancel: {
              id,
            },
          },
        }),
      }
    );

    const response = await request_response.json();

    if (response.res["Ok"]) {
      const { id, order_type, price, shares } = response.res["Ok"]["Cancelled"];
      await Order.findOneAndUpdate(
        { orderId: id },
        {
          orderStatus: "CANCEL",
        },
        {
          new: true,
        }
      );

      if (order_type === "BID") {
        await User.findOneAndUpdate(
          { _id: user._id },
          {
            $inc: {
              balance: price * shares,
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
              investedPrice: price * shares,
              holding: shares,
            },
          },
          {
            new: true,
          }
        );
      }

      return NextResponse.json({ message: "Ok" }, { status: 200 });
    }
    console.log(response)
    throw new Error(response.res["Error"]);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
