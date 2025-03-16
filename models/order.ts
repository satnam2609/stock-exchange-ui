import mongoose, { model, models, Schema } from "mongoose";

const orderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: [true, "Order id is required"],
    },
    price: {
      type: Number,
      default: 0.0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    quantityFilled:{
      type:Number,
      default:0,
    },
    orderType: {
      type: String,
      default: "BID",
      enum: ["BID", "ASK"],
    },
    orderStatus: {
      type: String,
      enum: ["WAIT", "PARTIAL", "FULL", "CANCEL","EXPIRED"],
      default: "WAIT",
    },
  },
  {
    timestamps: true,
  }
);

const Order = models.Order || model("Order", orderSchema);

export default Order;
