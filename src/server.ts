/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("Connected to DB!!!");

    server = app.listen(envVars.PORT, () => {
      console.log(`Server Running On Port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
  await seedSuperAdmin();
})();

/*
  This listener handles any unhandled Promise rejections in the application.

  If a Promise is rejected and no .catch() handles it,
  Node.js triggers the "unhandledRejection" event.

  Why we use this:
  - To prevent unexpected server crashes
  - To log the error message
  - To gracefully shut down the server
  - To exit the process safely with error code (1)

  server.close() stops accepting new requests
  and allows ongoing requests to finish before exiting.

  This helps keep the application stable and avoids running
  the server in a corrupted or inconsistent state.
*/
process.on("unhandledRejection", (err) => {
  console.log("Unhandle Rejection Detected ... Server Shuting Down ", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

/*
  This listener handles uncaught synchronous errors in the application.

  If an error occurs and is NOT wrapped in try-catch,
  Node.js triggers the "uncaughtException" event.

  Why we use this:
  - To catch unexpected runtime errors
  - To log the error details
  - To gracefully shut down the server
  - To exit the process safely with error code (1)

  server.close() stops accepting new incoming requests
  and allows ongoing requests to complete before exiting.

  After an uncaught exception, the application may be in an
  unstable or corrupted state, so it is safer to shut down
  and restart the server.
*/
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception Detection ... Server Shuting Down ", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

/*
  This listener handles the SIGTERM signal sent to the application.

  SIGTERM is usually sent by:
  - Hosting providers (Heroku, Render, etc.)
  - Docker containers
  - Process managers (PM2)
  - System shutdown or restart

  Why we use this:
  - To detect when the system wants to terminate the app
  - To gracefully shut down the server
  - To stop accepting new requests
  - To allow ongoing requests to finish before exiting

  server.close() ensures a clean shutdown,
  preventing data loss or interrupted requests.

  This helps maintain stability and proper resource cleanup
  before the application fully exits.
*/
process.on("SIGTERM", () => {
  console.log("Signal Termination Detected ... Server Shuting Down");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

/*
  This listener handles the SIGINT signal.

  SIGINT is triggered when:
  - We press Ctrl + C in the terminal
  - The process is manually stopped

  Why we use this:
  - To detect manual interruption of the application
  - To gracefully shut down the server
  - To stop accepting new incoming requests
  - To allow running requests to complete before exit

  server.close() ensures a clean shutdown
  instead of forcefully terminating the server.

  This helps prevent data loss and keeps the
  application shutdown process safe and controlled.
*/
process.on("SIGINT", () => {
  console.log("Signal Interrupt Detected ... Server Shuting Down");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
