import mongoose from 'mongoose';
import config from '../config/config';

// Connect with DB
mongoose
  .connect(config.db_url)
  .then((conn) => {
    console.log('Successfully Connected');
  })
  .catch((err) => {
    console.log('Error while connecting to DB');
    console.log(err);
  });

// DB Connection
const dbConnection = mongoose.connection;

// Handle error after connecting
dbConnection.on('error', (err) => {
  console.log('Error while connecting to DB');
  console.log(err);
});

dbConnection.on('disconnected', () => {
  console.log('DB is disconnected');
});

// Export DB Connection
export default dbConnection;
