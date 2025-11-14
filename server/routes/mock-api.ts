import { RequestHandler } from "express";

const SECRET_KEY = "your-secret-key-change-this-in-production";

// Mock data
const mockDashboardStats = {
  total_messages: 1500,
  messages_today: 45,
  total_customers: 320,
  new_customers_today: 5,
  sentiment_distribution: {
    positive: 850,
    neutral: 500,
    negative: 150,
  },
  channel_distribution: {
    telegram: 900,
    whatsapp: 600,
  },
  avg_response_time_seconds: 15.5,
};

const mockMessages = [
  {
    id: 1,
    channel: "telegram",
    sender_id: "123456789",
    sender_name: "John Doe",
    message_text: "Salam, məhsul haqqında məlumat istəyirəm",
    sentiment: "positive",
    intent: "product_inquiry",
    ai_response: "Hörmətli müştəri, məhsullarımız haqqında...",
    status: "completed",
    created_at: "2025-11-14T05:00:00Z",
    updated_at: "2025-11-14T05:01:00Z",
  },
  {
    id: 2,
    channel: "whatsapp",
    sender_id: "987654321",
    sender_name: "Jane Smith",
    message_text: "Support haqqında sual",
    sentiment: "neutral",
    intent: "support_request",
    ai_response: null,
    status: "pending",
    created_at: "2025-11-14T06:00:00Z",
    updated_at: "2025-11-14T06:00:00Z",
  },
];

const mockCustomers = [
  {
    id: 1,
    name: "John Doe",
    phone: "+994501234567",
    email: "john@example.com",
    telegram_id: "123456789",
    whatsapp_id: "+994501234567",
    zoho_contact_id: "zoho_123",
    created_at: "2025-11-14T05:00:00Z",
    updated_at: "2025-11-14T05:00:00Z",
  },
  {
    id: 2,
    name: "Jane Smith",
    phone: "+994509876543",
    email: "jane@example.com",
    telegram_id: null,
    whatsapp_id: "+994509876543",
    zoho_contact_id: null,
    created_at: "2025-11-14T06:00:00Z",
    updated_at: "2025-11-14T06:00:00Z",
  },
];

// Middleware to verify token
export const verifyToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ detail: "Not authenticated" });
  }

  try {
    jwt.verify(token, SECRET_KEY);
    next();
  } catch {
    return res.status(401).json({ detail: "Invalid token" });
  }
};

// Login endpoint
export const handleLogin: RequestHandler = (req, res) => {
  const { username, password } = req.body;

  // Mock authentication - accept any non-empty credentials
  if (!username || !password) {
    return res.status(400).json({ detail: "Missing username or password" });
  }

  // Create a mock token
  const token = jwt.sign({ username, role: "user" }, SECRET_KEY, {
    expiresIn: "24h",
  });

  res.json({
    access_token: token,
    token_type: "bearer",
  });
};

// Get dashboard stats
export const handleGetDashboardStats: RequestHandler = (_req, res) => {
  res.json(mockDashboardStats);
};

// Get all messages
export const handleGetMessages: RequestHandler = (_req, res) => {
  res.json(mockMessages);
};

// Get message by ID
export const handleGetMessageById: RequestHandler = (req, res) => {
  const { id } = req.params;
  const message = mockMessages.find((m) => m.id === parseInt(id));

  if (!message) {
    return res.status(404).json({ detail: "Message not found" });
  }

  res.json(message);
};

// Create message
export const handleCreateMessage: RequestHandler = (req, res) => {
  const { channel, sender_id, sender_name, message_text } = req.body;

  const newMessage = {
    id: mockMessages.length + 1,
    channel,
    sender_id,
    sender_name,
    message_text,
    sentiment: null,
    intent: null,
    ai_response: null,
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  mockMessages.push(newMessage);
  res.status(201).json(newMessage);
};

// Update message
export const handleUpdateMessage: RequestHandler = (req, res) => {
  const { id } = req.params;
  const messageIndex = mockMessages.findIndex((m) => m.id === parseInt(id));

  if (messageIndex === -1) {
    return res.status(404).json({ detail: "Message not found" });
  }

  const updated = {
    ...mockMessages[messageIndex],
    ...req.body,
    updated_at: new Date().toISOString(),
  };

  mockMessages[messageIndex] = updated;
  res.json(updated);
};

// Delete message
export const handleDeleteMessage: RequestHandler = (req, res) => {
  const { id } = req.params;
  const index = mockMessages.findIndex((m) => m.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ detail: "Message not found" });
  }

  mockMessages.splice(index, 1);
  res.status(204).send();
};

// Get all customers
export const handleGetCustomers: RequestHandler = (_req, res) => {
  res.json(mockCustomers);
};

// Get customer by ID
export const handleGetCustomerById: RequestHandler = (req, res) => {
  const { id } = req.params;
  const customer = mockCustomers.find((c) => c.id === parseInt(id));

  if (!customer) {
    return res.status(404).json({ detail: "Customer not found" });
  }

  res.json(customer);
};

// Create customer
export const handleCreateCustomer: RequestHandler = (req, res) => {
  const newCustomer = {
    id: mockCustomers.length + 1,
    ...req.body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  mockCustomers.push(newCustomer);
  res.status(201).json(newCustomer);
};

// Update customer
export const handleUpdateCustomer: RequestHandler = (req, res) => {
  const { id } = req.params;
  const customerIndex = mockCustomers.findIndex((c) => c.id === parseInt(id));

  if (customerIndex === -1) {
    return res.status(404).json({ detail: "Customer not found" });
  }

  const updated = {
    ...mockCustomers[customerIndex],
    ...req.body,
    updated_at: new Date().toISOString(),
  };

  mockCustomers[customerIndex] = updated;
  res.json(updated);
};

// Delete customer
export const handleDeleteCustomer: RequestHandler = (req, res) => {
  const { id } = req.params;
  const index = mockCustomers.findIndex((c) => c.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ detail: "Customer not found" });
  }

  mockCustomers.splice(index, 1);
  res.status(204).send();
};
