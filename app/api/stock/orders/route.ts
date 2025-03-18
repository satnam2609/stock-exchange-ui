import { connectDB } from "@/lib/db";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongoose from "mongoose";

console.log(mongoose.modelNames());

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 401 }
      );
    }

    await connectDB();

    // Import models AFTER the DB is connected
    const User = (await import("@/models/user")).default;
    const Order = (await import("@/models/order")).default;

    const { side, statuses, dateRange } = await request.json();

    const user = await User.findOne({ email: session?.user.email })
      .sort([["createdAt", "desc"]])
      .populate("orders")
      .select("_id orders");

    if (!user?._id) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let filteredOrders = user.orders;

    if (side !== "") {
      filteredOrders = filteredOrders.filter(
        (ord: any) => ord.orderType === side
      );
    }

    if (statuses.length>0) {
      
    }

    return NextResponse.json({ message: filteredOrders }, { status: 200 });
  } catch (error) {
    console.log("Error with search filter:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
