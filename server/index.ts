import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleLogin,
  verifyToken,
  handleGetDashboardStats,
  handleGetMessages,
  handleGetMessageById,
  handleCreateMessage,
  handleUpdateMessage,
  handleDeleteMessage,
  handleGetCustomers,
  handleGetCustomerById,
  handleCreateCustomer,
  handleUpdateCustomer,
  handleDeleteCustomer,
} from "./routes/mock-api";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth routes
  app.post("/api/auth/login", handleLogin);

  // Protected routes - require token
  app.get("/api/analytics/dashboard", verifyToken, handleGetDashboardStats);

  // Messages routes
  app.get("/api/messages", verifyToken, handleGetMessages);
  app.get("/api/messages/:id", verifyToken, handleGetMessageById);
  app.post("/api/messages", verifyToken, handleCreateMessage);
  app.put("/api/messages/:id", verifyToken, handleUpdateMessage);
  app.delete("/api/messages/:id", verifyToken, handleDeleteMessage);

  // Customers routes
  app.get("/api/customers", verifyToken, handleGetCustomers);
  app.get("/api/customers/:id", verifyToken, handleGetCustomerById);
  app.post("/api/customers", verifyToken, handleCreateCustomer);
  app.put("/api/customers/:id", verifyToken, handleUpdateCustomer);
  app.delete("/api/customers/:id", verifyToken, handleDeleteCustomer);

  return app;
}
