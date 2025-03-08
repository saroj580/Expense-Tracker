import mongoose from "mongoose"

async function connectMongoDb(url) {
    return mongoose.connect(url);
}
export default connectMongoDb;