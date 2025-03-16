import { connectDB } from "@/lib/db";
// import User from "@/models/user";
// import Order from "@/models/order";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongoose from "mongoose";

console.log(mongoose.modelNames());

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error(
        JSON.stringify({ message: "Unauthorized user", status: 401 })
      );
    }

    await connectDB();

    // Import models AFTER the DB is connected
    const User = (await import("@/models/user")).default;
    const Order = (await import("@/models/order")).default;

    const user = await User.findOne({ email: session?.user.email }).populate(
      "orders"
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.orders) {
      return NextResponse.json({ message: [], status: 200 });
    }

    const orders = user.orders.filter(
      (ord: any) => ord.orderStatus === "WAIT" || ord.orderStatus === "PARTIAL"
    );

    return NextResponse.json({ message: orders }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Internal serve error" },
      { status: 500 }
    );
  }
}
