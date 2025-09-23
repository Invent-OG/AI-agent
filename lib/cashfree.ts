import crypto from "crypto";

interface CashfreeConfig {
  appId: string;
  secretKey: string;
  environment: "sandbox" | "production";
}

interface CreateOrderRequest {
  orderId: string;
  orderAmount: number;
  orderCurrency: string;
  customerDetails: {
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  };
  orderMeta?: {
    returnUrl?: string;
    notifyUrl?: string;
  };
}

interface CashfreeOrderResponse {
  cfOrderId: string;
  orderId: string;
  entity: string;
  orderCurrency: string;
  orderAmount: number;
  orderStatus: string;
  paymentSessionId: string;
  orderExpiryTime: string;
  orderNote?: string;
  createdAt: string;
  orderTags?: any;
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

  private generateSignature(postData: string): string {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signatureData = postData + "/pg/orders" + timestamp;

    return crypto
      .createHmac("sha256", this.config.secretKey)
      .update(signatureData)
      .digest("base64");
  }

  private getHeaders(postData: string) {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = this.generateSignature(postData);

    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-api-version": "2023-08-01",
      "x-client-id": this.config.appId,
      "x-client-secret": this.config.secretKey,
      "x-request-id": crypto.randomUUID(),
    };
  }

  async createOrder(
    orderData: CreateOrderRequest
  ): Promise<CashfreeOrderResponse> {
    const postData = JSON.stringify(orderData);
    const headers = this.getHeaders(postData);

    const response = await fetch(`${this.baseUrl}/orders`, {
      method: "POST",
      headers,
      body: postData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Cashfree API Error:", errorData);
      throw new Error(`Cashfree API Error: ${response.status} - ${errorData}`);
    }

    return response.json();
  }

  async getOrder(orderId: string): Promise<any> {
    const headers = this.getHeaders("");

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
    const order = await this.getOrder(orderId);
    return `${this.baseUrl}/orders/${orderId}/pay`;
  }

  verifyWebhookSignature(
    rawBody: string,
    signature: string,
    timestamp: string
  ): boolean {
    const signatureData = rawBody + timestamp;
    const expectedSignature = crypto
      .createHmac("sha256", this.config.secretKey)
      .update(signatureData)
      .digest("base64");

    return expectedSignature === signature;
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
