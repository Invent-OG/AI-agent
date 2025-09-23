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
      
      // Update local payment status if different
      if (orderStatus.order_status === 'PAID' && payment.status !== 'success') {
        await db
          .update(payments)
          .set({ 
            status: 'success',
            updatedAt: new Date(),
          })
          .where(eq(payments.id, payment.id));

        // Update lead status
        await db
          .update(leads)
          .set({ 
            status: 'paid',
            updatedAt: new Date(),
          })
          .where(eq(leads.id, payment.leadId));
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
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}