import { connectDB } from "@/lib/db";
import User from "@/models/user";
import Order from "@/models/order";
import Portfolio from "@/models/portfolio";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

/**
 *
 * @param request is a HTTP request body that contains the price and shares the user is willing to propose order for.
 * This API does some authentications and authorization stuff then calls the port server for sending the order
 * Port server in return of this call retuns the response given by the matching enigne.
 * Then some updation are done.
 * @returns HTTP response that has the order id that has been assigned by the matching engine
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    const { price, shares } = await request.json();

    await connectDB();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 403 }
      );
    }

    const user = await User.findOne({ email: session?.user.email }).populate(
      "orders"
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.balance < price * shares) {
      return NextResponse.json(
        { message: "Insufficient balance" },
        { status: 400 }
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
              order_type: "BID",
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
        orderType: "BID",
      });

      await User.findOneAndUpdate(
        { _id: user._id },
        {
          $push: {
            orders: order._id,
          },
          $inc: {
            balance: -price * shares,
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
