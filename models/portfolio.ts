import mongoose,{Schema} from "mongoose";


const portfolioSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    investedPrice:{
        type:Number,
        default:0
    },
    holding:{
        type:Number,
        default:0
    }
},{
    timestamps:true
});

const Portfolio=mongoose.models.Portfolio || mongoose.model("Portfolio",portfolioSchema);

export default Portfolio;