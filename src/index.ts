// File used to start the server or bootstap  the server
import http from "http";
import app from "./loaders/app";
import dbConnecion from "./loaders/db-connecion";


// Igniter function
export default  () => {
  // Server
  const server = http.createServer(app);

  // Port
  console.log(process.env.PORT);
  const port = process.env.PORT || 3001;

  // Listen
  server.listen(port, () => {
    console.log(`Listening on ${port}...`);
  });
  // Majestic Close
  process.on("SIGINT", () => {
    server.close(() => {
      console.log(`App is closing`);
    });
    dbConnecion.close();
  });
};