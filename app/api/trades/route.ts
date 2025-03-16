import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

const redisClient = new Redis();

export async function GET(){
  try {
    const res=await redisClient.lrange("list_data",0,-1);

    if (res.length>0){
      const list=res.map((o)=>JSON.parse(o));
      return NextResponse.json({message:list})
    }


    return NextResponse.json({message:[]})
  } catch (error) {
    console.log(error)
    return NextResponse.json({message:"Internal server error"})
  }
}

 