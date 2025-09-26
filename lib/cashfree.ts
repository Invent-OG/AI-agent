import crypto from "crypto";

interface CashfreeConfig {
  appId: string;
  secretKey: string;
  environment: "sandbox" | "production";
}

interface CreateOrderRequest {
  order_id: string;
  order_amount: number;
  order_currency: string;
  customer_details: {
    customer_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
  };
  order_meta?: {
    return_url?: string;
    notify_url?: string;
  };
}

interface CashfreeOrderResponse {
  cf_order_id: string;
  order_id: string;
  entity: string;
  order_currency: string;
  order_amount: number;
  order_status: string;
  payment_session_id: string;
  order_expiry_time: string;
  order_note?: string;
  created_at: string;
  order_tags?: any;
}

class CashfreeClient {
  private config: CashfreeConfig;
  private baseUrl: string;

  constructor(config: CashfreeConfig) {
    this.config = config;
    this.baseUrl =
      config.environment === "production"
        ? "https://api.cashfree.com/pg"
        : "https://sandbox.cashfree.com/pg";
  }

  private getHeaders() {
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-api-version": "2023-08-01",
      "x-client-id": this.config.appId,
      "x-client-secret": this.config.secretKey,
    };
  }

  async createOrder(orderData: CreateOrderRequest): Promise<CashfreeOrderResponse> {
    const headers = this.getHeaders();

    const response = await fetch(`${this.baseUrl}/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Cashfree API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        url: `${this.baseUrl}/orders`,
        headers: headers,
        body: orderData
      });
      throw new Error(`Cashfree API Error: ${response.status} - ${errorData}`);
    }

    return response.json();
  }

  async getOrder(orderId: string): Promise<any> {
    const headers = this.getHeaders();

    const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to get order: ${response.status} - ${errorData}`);
    }

    return response.json();
  }

  async getPaymentLink(orderId: string): Promise<string> {
    return `${this.baseUrl}/orders/${orderId}/pay`;
  }

  verifyWebhookSignature(
    rawBody: string,
    signature: string,
    timestamp: string
  ): boolean {
    try {
      const signatureData = rawBody + timestamp;
      const expectedSignature = crypto
        .createHmac("sha256", this.config.secretKey)
        .update(signatureData)
        .digest("base64");

      return expectedSignature === signature;
    } catch (error) {
      console.error("Signature verification error:", error);
      return false;
    }
  }
}

// Initialize Cashfree client
export function getCashfreeClient(): CashfreeClient {
  const config: CashfreeConfig = {
    appId: process.env.CASHFREE_APP_ID!,
    secretKey: process.env.CASHFREE_SECRET_KEY!,
    environment:
      (process.env.CASHFREE_ENVIRONMENT as "sandbox" | "production") ||
      "sandbox",
  };

  if (!config.appId || !config.secretKey) {
    throw new Error(
      "Cashfree credentials not configured. Please set CASHFREE_APP_ID and CASHFREE_SECRET_KEY environment variables."
    );
  }

  return new CashfreeClient(config);
}

export { CashfreeClient };
export type { CreateOrderRequest, CashfreeOrderResponse };