import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[RESOURCE-PAYMENT-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    if (!sig) {
      throw new Error("No signature provided");
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      Deno.env.get("STRIPE_WEBHOOK_SECRET") || ""
    );

    logStep("Event type", { type: event.type });

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id;

      if (!orderId) {
        throw new Error("No order ID in metadata");
      }

      logStep("Processing payment completion", { orderId, sessionId: session.id });

      // Get order details
      const { data: order, error: orderError } = await supabaseService
        .from('resource_orders')
        .select('*, resource_order_items(*)')
        .eq('id', orderId)
        .single();

      if (orderError || !order) {
        throw new Error(`Order not found: ${orderId}`);
      }

      // Update order status
      await supabaseService
        .from('resource_orders')
        .update({
          status: 'paid',
          provider_payment_id: session.payment_intent as string,
        })
        .eq('id', orderId);

      // Grant access to all products in the order
      for (const item of order.resource_order_items) {
        await supabaseService
          .from('resource_access')
          .upsert({
            user_id: order.user_id,
            product_id: item.product_id,
            granted_at: new Date().toISOString()
          });

        // Update product purchase count
        const { data: currentProduct } = await supabaseService
          .from('resource_products')
          .select('total_purchases')
          .eq('id', item.product_id)
          .single();
        
        await supabaseService
          .from('resource_products')
          .update({
            total_purchases: (currentProduct?.total_purchases || 0) + 1
          })
          .eq('id', item.product_id);

        logStep("Access granted", { userId: order.user_id, productId: item.product_id });
      }

      logStep("Payment processed successfully", { orderId });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});