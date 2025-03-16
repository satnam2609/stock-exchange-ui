import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email:{
    type:String,
    required:[true,"Email is required"],
    unique:true
  },
  balance:{
    type:Number,
    default:0
  },
  orders:[
    { type: Schema.Types.ObjectId, ref: 'Order' }
  ],
},{
    timestamps:true
});

const User=mongoose.models.User || mongoose.model("User",userSchema);

export default User;