import mongoose from "mongoose";
import "dotenv/config";

const collectionName = "base-ecommerce";

async function main() {
  // await mongoose.connect(process.env.MONGO_ATLAS ?? '');
  await mongoose.connect(process.env.MONGO_LOCAL ?? "");

  console.log("Conectou ao Mongoose");
}

main().catch((err) => console.log(err));

export default mongoose;
