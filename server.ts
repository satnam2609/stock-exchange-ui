import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

import Redis from "ioredis";

const redisSubscriber = new Redis();

redisSubscriber.subscribe("ORDER_REPORT");
redisSubscriber.subscribe("MARKET_FEED");
redisSubscriber.subscribe("EXECUTE_FEED");
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  redisSubscriber.on("message", (channel, message) => {
    if (channel === "MARKET_FEED") {
      io.emit("market_feed", message);
    } else if (channel === "EXECUTE_FEED") {
      io.emit("message", message);
    } else {
      const { session, res } = JSON.parse(message);
      if (session) {
        io.to(session).emit("reports", JSON.stringify(res));
      }
    }
  });

  io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on("join", (sessionId) => {
      console.log(`User joined session: ${sessionId}`);
      socket.join(sessionId);
    });
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
