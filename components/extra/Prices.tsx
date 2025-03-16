"use client";

const PriceComponent=({alias,price}:{alias:string,price:number})=>{
    return <div className="flex items-center gap-1">
        <p className="text-lg font-medium ">{alias}</p>
        <p className="text-lg font-bold text-[#3ddda0]">{price}</p>
    </div>
}
export default function Prices({open,close,high,low,volume}:{open:number,close:number,high:number,low:number,volume:number}){
    return <div className="flex items-center justify-start gap-2">
        <p className="text-sm text-[#979696]">Price</p>

        <div className="flex items-center justify-between gap-5">
           <PriceComponent alias="Open" price={open}/>
           <PriceComponent alias="High" price={high}/>
           <PriceComponent alias="Low" price={low}/>
           <PriceComponent alias="Close" price={close}/>
           <PriceComponent alias="Volume" price={volume/1000}/>
        </div>
    </div>
}