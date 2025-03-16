import User from "@/models/user";
import Order from "@/models/order";
import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ObjectId } from "mongoose";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized User" }, { status: 401 });
    }

    await connectDB();
    const result = await User.findOne({ email: session?.user.email }).select("-_id orders");

    if (!result) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const orderResults = await Promise.all(
      result.orders?.map((o: ObjectId) => Order.findOne({ _id: o })) ?? []
    );

    const responses = await Promise.all(
      orderResults
        .filter((d) => d && d.orderStatus === "WAIT" || d.orderStatus==="PARTIAL")
        .map(async (d) => {
          const id = d.orderId.toString();
          try {
            const res = await fetch(`http://localhost:3000/api/order/${id}`,{cache:"no-cache"});
            const json = await res.json();
            return json.message;
          } catch (err) {
            console.log(err);
            return null;
          }
        })
    );

    return NextResponse.json({ message: responses });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
