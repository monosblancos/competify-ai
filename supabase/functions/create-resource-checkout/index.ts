import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-RESOURCE-CHECKOUT] ${step}${detailsStr}`);
};

interface CheckoutRequest {
  productId: string;
  couponCode?: string;
  provider: 'stripe' | 'mercadopago';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { productId, couponCode, provider }: CheckoutRequest = await req.json();
    logStep("Request data", { productId, couponCode, provider });

    // Get product details
    const { data: product, error: productError } = await supabaseClient
      .from('resource_products')
      .select('*')
      .eq('id', productId)
      .eq('published', true)
      .single();

    if (productError || !product) {
      throw new Error("Producto no encontrado o no disponible");
    }
    logStep("Product found", { slug: product.slug, price: product.price_cents });

    // Handle free products
    if (product.is_free) {
      // Grant access immediately
      await supabaseService
        .from('resource_access')
        .upsert({
          user_id: user.id,
          product_id: product.id,
          granted_at: new Date().toISOString()
        });
      
      logStep("Free product access granted");
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Acceso otorgado al recurso gratuito",
        redirect_url: `/mi-biblioteca`
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Calculate price with coupon
    let finalPrice = product.price_cents;
    let discountCents = 0;
    let validCoupon = null;

    if (couponCode) {
      const { data: coupon } = await supabaseClient
        .from('resource_coupons')
        .select('*')
        .eq('code', couponCode)
        .eq('active', true)
        .single();

      if (coupon && (!coupon.expires_at || new Date(coupon.expires_at) > new Date())) {
        if (!coupon.max_uses || coupon.used_count < coupon.max_uses) {
          discountCents = Math.round(product.price_cents * (coupon.discount_pct / 100));
          finalPrice = product.price_cents - discountCents;
          validCoupon = coupon;
          logStep("Coupon applied", { discount: discountCents, finalPrice });
        }
      }
    }

    if (provider === 'stripe') {
      // Initialize Stripe
      const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
        apiVersion: "2023-10-16",
      });

      // Check/create Stripe customer
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      let customerId;
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        logStep("Existing Stripe customer found", { customerId });
      } else {
        const customer = await stripe.customers.create({ email: user.email });
        customerId = customer.id;
        logStep("New Stripe customer created", { customerId });
      }

      // Create order record
      const { data: order } = await supabaseService
        .from('resource_orders')
        .insert({
          user_id: user.id,
          provider: 'stripe',
          amount_cents: finalPrice,
          currency: 'MXN',
          status: 'created',
          coupon_code: validCoupon?.code,
          discount_cents: discountCents
        })
        .select()
        .single();

      // Create order items
      await supabaseService
        .from('resource_order_items')
        .insert({
          order_id: order.id,
          product_id: product.id,
          quantity: 1,
          price_cents: finalPrice
        });

      logStep("Order created", { orderId: order.id });

      // Create Stripe Checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [
          {
            price_data: {
              currency: "mxn",
              product_data: { 
                name: product.title,
                description: product.subtitle || product.description,
                images: product.cover_url ? [product.cover_url] : []
              },
              unit_amount: finalPrice,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.get("origin")}/recursos/gracias?order=${order.id}`,
        cancel_url: `${req.headers.get("origin")}/recursos/${product.slug}`,
        metadata: {
          order_id: order.id,
          product_id: product.id,
          user_id: user.id
        }
      });

      // Update order with session ID
      await supabaseService
        .from('resource_orders')
        .update({ provider_session_id: session.id })
        .eq('id', order.id);

      // Update coupon usage if applicable
      if (validCoupon) {
        await supabaseService
          .from('resource_coupons')
          .update({ used_count: validCoupon.used_count + 1 })
          .eq('code', validCoupon.code);
      }

      logStep("Stripe session created", { sessionId: session.id });

      return new Response(JSON.stringify({ 
        checkout_url: session.url,
        order_id: order.id
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    throw new Error("Provider no soportado");

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});