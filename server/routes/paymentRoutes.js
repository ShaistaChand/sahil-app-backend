import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

// ✅ COMMENT OUT: Payment gateways until bank account is linked
// import Stripe from 'stripe';
// import Razorpay from 'razorpay';

const router = express.Router();

// ✅ COMMENT OUT: Payment gateway initialization
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// @desc    Create subscription payment intent
// @route   POST /api/payments/create-subscription
// @access  Private
router.post('/create-subscription', protect, async (req, res) => {
  try {
    const { country, plan } = req.body;
    const user = await User.findById(req.user._id);

    const pricing = {
      UAE: { amount: 3500, currency: 'aed' }, // AED 35.00
      India: { amount: 24900, currency: 'inr' } // ₹249.00
    };

    const price = pricing[country] || pricing.UAE;

    // ✅ COMMENT OUT: Real payment processing
    /*
    if (country === 'UAE') {
      // Stripe for UAE
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: price.currency,
              product_data: {
                name: 'Sahil App Basic Plan',
                description: 'Monthly subscription for expense tracking'
              },
              unit_amount: price.amount,
              recurring: {
                interval: 'month',
                interval_count: 1
              }
            },
            quantity: 1
          }
        ],
        mode: 'subscription',
        success_url: `${process.env.CLIENT_URL}/dashboard?payment=success`,
        cancel_url: `${process.env.CLIENT_URL}/dashboard?payment=cancelled`,
        customer_email: user.email,
        client_reference_id: user._id.toString(),
        metadata: {
          user_id: user._id.toString(),
          plan: 'basic',
          country: country
        }
      });

      res.json({ success: true, sessionId: session.id, url: session.url });
    } else {
      // Razorpay for India
      const options = {
        amount: price.amount,
        currency: price.currency,
        receipt: `sub_${user._id}_${Date.now()}`,
        notes: {
          user_id: user._id.toString(),
          plan: 'basic',
          country: country
        }
      };

      const order = await razorpay.orders.create(options);
      
      res.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID
      });
    }
    */

    // ✅ ADD: Temporary response for trial period
    res.json({
      success: true,
      message: 'Free trial active! Payment integration coming soon.',
      trial: true,
      country: country,
      plan: plan
    });

  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment processing failed'
    });
  }
});

// @desc    Handle payment success webhook
// @route   POST /api/payments/webhook
// @access  Public (Stripe/Razorpay calls this)
router.post('/webhook', async (req, res) => {
  try {
    // ✅ COMMENT OUT: Real webhook processing
    /*
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Update user subscription
      await User.findByIdAndUpdate(session.metadata.user_id, {
        'subscription.status': 'active',
        'subscription.plan': session.metadata.plan,
        'subscription.currentPeriodEnd': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        'limits.maxGroups': 3,
        'limits.maxMembersPerGroup': 5
      });

      console.log(`Subscription activated for user: ${session.metadata.user_id}`);
    }
    */

    // ✅ ADD: Temporary webhook response
    console.log('Webhook received (trial mode)');
    res.json({ 
      received: true, 
      message: 'Webhook processed in trial mode' 
    });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
});

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify-razorpay
// @access  Private
router.post('/verify-razorpay', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // ✅ COMMENT OUT: Real Razorpay verification
    /*
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment verified - update user subscription
      await User.findByIdAndUpdate(req.user._id, {
        'subscription.status': 'active',
        'subscription.plan': 'basic',
        'subscription.currentPeriodEnd': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        'limits.maxGroups': 3,
        'limits.maxMembersPerGroup': 5
      });

      res.json({ success: true, message: 'Payment verified and subscription activated' });
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
    */

    // ✅ ADD: Temporary verification response
    res.json({
      success: true,
      message: 'Payment verification simulated for trial period',
      trial: true
    });

  } catch (error) {
    console.error('Razorpay verification error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
});

export default router;