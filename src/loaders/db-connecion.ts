
import mongoose  from "mongoose";
import config from "../config/config";


// Connect with DB
mongoose
  .connect(config.db_url)
  .then((conn:any) => {
    console.log('Successfully Connected');
  })
  .catch((err:any) => {
    console.log('Error while connecting to DB');
    console.log(err);
  });

// DB Connection
const dbConnecion = mongoose.connection;

// Handle error after connecting
dbConnecion.on("error", (err:any) => {
  console.log('Error while connecting to DB');
  console.log(err);
});

dbConnecion.on("disconnected", () => {
  console.log('DB is disconnected');
});


// Export DB Connection
export default  dbConnecion;




