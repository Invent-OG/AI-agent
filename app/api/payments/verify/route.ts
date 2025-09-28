import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { payments, leads } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getCashfreeClient } from '@/lib/cashfree';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    console.log("Verifying payment for order:", orderId);

    // Find payment by order ID
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.cashfreeOrderId, orderId));

    if (!payment) {
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Get lead information
    const [lead] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, payment.leadId));

    // Try to get latest status from Cashfree
    try {
      const cashfree = getCashfreeClient();
      const orderStatus = await cashfree.getOrder(orderId);
      
      console.log("Cashfree order status:", orderStatus);
      
      // Update local payment status if different
      let shouldUpdate = false;
      let newStatus = payment.status;
      let newLeadStatus = lead?.status;

      switch (orderStatus.order_status?.toUpperCase()) {
        case 'PAID':
        case 'ACTIVE':
          if (payment.status !== 'success') {
            newStatus = 'success';
            newLeadStatus = 'paid';
            shouldUpdate = true;
          }
          break;
        case 'FAILED':
        case 'CANCELLED':
        case 'EXPIRED':
          if (payment.status !== 'failed') {
            newStatus = 'failed';
            shouldUpdate = true;
          }
          break;
      }

      if (shouldUpdate) {
        console.log("Updating payment status:", { from: payment.status, to: newStatus });
        
        await db
          .update(payments)
          .set({ 
            status: newStatus as any,
            updatedAt: new Date(),
          })
          .where(eq(payments.id, payment.id));

        if (newLeadStatus && lead) {
          await db
            .update(leads)
            .set({ 
              status: newLeadStatus as any,
              updatedAt: new Date(),
            })
            .where(eq(leads.id, payment.leadId));
        }

        // Return updated status
        return NextResponse.json({
          success: true,
          payment: {
            ...payment,
            status: newStatus,
            leadName: lead?.name,
            leadEmail: lead?.email,
          },
          updated: true,
        });
      }
    } catch (cashfreeError) {
      console.error('Error fetching order status from Cashfree:', cashfreeError);
      // Continue with local status
    }

    return NextResponse.json({
      success: true,
      payment: {
        ...payment,
        leadName: lead?.name,
        leadEmail: lead?.email,
      },
      updated: false,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}