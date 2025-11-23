import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { username, priceId, origin } = await req.json()

    // 1. Check if user exists or create them
    const { data: users, error: userError } = await supabaseClient
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    let user = users
    if (!user) {
        // Create user if not exists
        const { data: newUser, error: createError } = await supabaseClient
            .from('users')
            .insert([{ username }])
            .select()
            .single()
        
        if (createError) throw createError
        user = newUser
    }

    // 2. Create or retrieve Stripe Customer
    let customerId = user.stripe_customer_id
    if (!customerId) {
        const customer = await stripe.customers.create({
            metadata: {
                supabase_user_id: user.id,
                username: username
            }
        })
        customerId = customer.id
        
        // Update user with stripe_customer_id
        await supabaseClient
            .from('users')
            .update({ stripe_customer_id: customerId })
            .eq('id', user.id)
    }

    // 3. Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}?canceled=true`,
      client_reference_id: user.id,
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
