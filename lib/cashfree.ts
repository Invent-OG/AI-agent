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
  order_note?: string;
  order_tags?: Record<string, string>;
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

interface PaymentSessionRequest {
  order_id: string;
  payment_session_id: string;
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
    try {
      const headers = this.getHeaders();

      console.log("Creating Cashfree order with data:", {
        ...orderData,
        baseUrl: this.baseUrl,
        headers: { ...headers, "x-client-secret": "[REDACTED]" }
      });

      const response = await fetch(`${this.baseUrl}/orders`, {
        method: "POST",
        headers,
        body: JSON.stringify(orderData),
      });

      const responseText = await response.text();
      
      if (!response.ok) {
        console.error("Cashfree API Error:", {
          status: response.status,
          statusText: response.statusText,
          error: responseText,
          url: `${this.baseUrl}/orders`,
          requestData: orderData
        });
        throw new Error(`Cashfree API Error: ${response.status} - ${responseText}`);
      }

      const responseData = JSON.parse(responseText);
      console.log("Cashfree order created successfully:", responseData);
      
      return responseData;
    } catch (error) {
      console.error("Cashfree order creation failed:", error);
      throw error;
    }
  }

  async getOrder(orderId: string): Promise<any> {
    try {
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
    } catch (error) {
      console.error("Failed to fetch order:", error);
      throw error;
    }
  }

  async getPaymentLink(orderId: string): Promise<string> {
    return `${this.baseUrl}/orders/${orderId}/pay`;
  }

  async createPaymentSession(data: PaymentSessionRequest): Promise<any> {
    try {
      const headers = this.getHeaders();

      const response = await fetch(`${this.baseUrl}/orders/sessions`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to create payment session: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error("Payment session creation failed:", error);
      throw error;
    }
  }

  verifyWebhookSignature(
    rawBody: string,
    signature: string,
    timestamp: string
  ): boolean {
    try {
      // According to Cashfree docs, signature is calculated as:
      // base64(hmac_sha256(rawBody + timestamp, secret_key))
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

  // Verify payment signature for additional security
  verifyPaymentSignature(
    orderId: string,
    orderAmount: string,
    referenceId: string,
    paymentStatus: string,
    paymentMode: string,
    signature: string
  ): boolean {
    try {
      const signatureData = `${orderId}${orderAmount}${referenceId}${paymentStatus}${paymentMode}`;
      const expectedSignature = crypto
        .createHmac("sha256", this.config.secretKey)
        .update(signatureData)
        .digest("base64");

      return expectedSignature === signature;
    } catch (error) {
      console.error("Payment signature verification error:", error);
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
    console.warn(
      "Cashfree credentials not configured. Using mock mode for development."
    );
    // Return a mock client for development
    return new CashfreeClient({
      appId: "mock_app_id",
      secretKey: "mock_secret_key",
      environment: "sandbox",
    });
  }

  return new CashfreeClient(config);
}

export { CashfreeClient };
export type { CreateOrderRequest, CashfreeOrderResponse, PaymentSessionRequest };