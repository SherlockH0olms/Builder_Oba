const API_BASE_URL = import.meta.env.VITE_API_URL || "";

interface ApiResponse<T> {
  data?: T;
  detail?: string;
  status?: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface Message {
  id: number;
  channel: "telegram" | "whatsapp";
  sender_id: string;
  sender_name: string;
  message_text: string;
  sentiment: "positive" | "neutral" | "negative" | null;
  intent: string | null;
  ai_response: string | null;
  status: "pending" | "processing" | "completed" | "failed";
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  telegram_id: string | null;
  whatsapp_id: string | null;
  zoho_contact_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_messages: number;
  messages_today: number;
  total_customers: number;
  new_customers_today: number;
  sentiment_distribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  channel_distribution: {
    telegram: number;
    whatsapp: number;
  };
  avg_response_time_seconds: number;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem("access_token");
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("access_token", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("access_token");
  }

  getToken() {
    return this.token;
  }

  private getHeaders(contentType = "application/json") {
    const headers: HeadersInit = {
      "Content-Type": contentType,
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        this.clearToken();
        window.location.href = "/login";
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API Error: ${response.statusText}`);
    }

    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${this.baseURL}/api/auth/login`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ username, password }),
    });

    return this.handleResponse<LoginResponse>(response);
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${this.baseURL}/api/analytics/dashboard`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    return this.handleResponse<DashboardStats>(response);
  }

  async getMessages(
    skip = 0,
    limit = 100,
    channel?: string,
    status?: string,
  ): Promise<Message[]> {
    const params = new URLSearchParams({
      skip: String(skip),
      limit: String(limit),
    });

    if (channel) params.append("channel", channel);
    if (status) params.append("status", status);

    const response = await fetch(
      `${this.baseURL}/api/messages?${params.toString()}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      },
    );

    return this.handleResponse<Message[]>(response);
  }

  async getMessageById(messageId: number): Promise<Message> {
    const response = await fetch(`${this.baseURL}/api/messages/${messageId}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    return this.handleResponse<Message>(response);
  }

  async createMessage(
    channel: string,
    senderId: string,
    senderName: string,
    messageText: string,
  ): Promise<Message> {
    const response = await fetch(`${this.baseURL}/api/messages`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({
        channel,
        sender_id: senderId,
        sender_name: senderName,
        message_text: messageText,
      }),
    });

    return this.handleResponse<Message>(response);
  }

  async updateMessage(
    messageId: number,
    data: Partial<Message>,
  ): Promise<Message> {
    const response = await fetch(`${this.baseURL}/api/messages/${messageId}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<Message>(response);
  }

  async deleteMessage(messageId: number): Promise<void> {
    const response = await fetch(`${this.baseURL}/api/messages/${messageId}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    return this.handleResponse<void>(response);
  }

  async getCustomers(skip = 0, limit = 100): Promise<Customer[]> {
    const params = new URLSearchParams({
      skip: String(skip),
      limit: String(limit),
    });

    const response = await fetch(
      `${this.baseURL}/api/customers?${params.toString()}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      },
    );

    return this.handleResponse<Customer[]>(response);
  }

  async getCustomerById(customerId: number): Promise<Customer> {
    const response = await fetch(
      `${this.baseURL}/api/customers/${customerId}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      },
    );

    return this.handleResponse<Customer>(response);
  }

  async createCustomer(data: Partial<Customer>): Promise<Customer> {
    const response = await fetch(`${this.baseURL}/api/customers`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<Customer>(response);
  }

  async updateCustomer(
    customerId: number,
    data: Partial<Customer>,
  ): Promise<Customer> {
    const response = await fetch(
      `${this.baseURL}/api/customers/${customerId}`,
      {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      },
    );

    return this.handleResponse<Customer>(response);
  }

  async deleteCustomer(customerId: number): Promise<void> {
    const response = await fetch(
      `${this.baseURL}/api/customers/${customerId}`,
      {
        method: "DELETE",
        headers: this.getHeaders(),
      },
    );

    return this.handleResponse<void>(response);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
