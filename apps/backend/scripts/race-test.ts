import { randomUUID } from 'crypto';

const API_URL = `${process.env.VITE_API_URL || 'http://localhost:3001'}/api`;

async function main() {
    console.log('🏁 Starting Race Condition Tests...');
    const sku = 'doom-2016-steam-key';

    // 1. We need to find the product ID for the SKU first
    const productsRes = await fetch(`${API_URL}/products`);
    const products = await productsRes.json();
    const product = products.find((p: any) => p.id === sku);

    if (!product) {
        console.error('❌ Product not found!');
        return;
    }

    const productId = product.id;
    const idempotencyKey = `race_test_${randomUUID()}`;

    console.log(`\n🏎️  TEST 1: Double-click "Buy" (5 simultaneous order creations)`);
    console.log(`Idempotency Key: ${idempotencyKey}`);

    const createPromises = Array.from({ length: 5 }).map((_, i) =>
        fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'idempotency-key': idempotencyKey
            },
            body: JSON.stringify({ productId })
        }).then(r => r.json())
    );

    const createResults = await Promise.all(createPromises);
    console.log('Results of 5 simultaneous POST /orders:');
    createResults.forEach((res, i) => console.log(`  Thread ${i + 1}:`, res));

    // Verify all threads got the same orderId
    const orderIds = new Set(createResults.map(r => r.orderId));
    if (orderIds.size === 1 && !orderIds.has(undefined)) {
        console.log('✅ TEST 1 PASSED: All 5 requests returned the EXACT SAME orderId. No 500 errors.');
    } else {
        console.error('❌ TEST 1 FAILED: Got different order IDs or errors.', orderIds);
        return;
    }

    const orderId = Array.from(orderIds)[0];

    console.log(`\n🏎️  TEST 2: Simultaneous Webhooks (5 duplicate events & 5 different events)`);
    console.log(`Target Order ID: ${orderId}`);

    const eventId1 = `evt_${randomUUID()}`;

    // 5 exact duplicate webhooks (same event_id)
    const webhookPromisesDuplicate = Array.from({ length: 5 }).map((_, i) =>
        fetch(`${API_URL}/webhook/payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event_id: eventId1,
                order_id: orderId,
                status: 'paid',
                amount: product.priceRub,
                currency: 'RUB',
                created_at: new Date().toISOString()
            })
        })
    );

    // 5 different webhooks (different event_id, same order_id)
    const webhookPromisesDifferent = Array.from({ length: 5 }).map((_, i) =>
        fetch(`${API_URL}/webhook/payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event_id: `evt_${randomUUID()}`,
                order_id: orderId,
                status: 'paid',
                amount: product.priceRub,
                currency: 'RUB',
                created_at: new Date().toISOString()
            })
        })
    );

    // Fire all 10 webhooks exactly at the same time
    const allWebhooks = [...webhookPromisesDuplicate, ...webhookPromisesDifferent];
    console.log(`Firing ${allWebhooks.length} simultaneous webhook requests...`);

    const webhookResults = await Promise.all(allWebhooks);
    const webhookStatuses = webhookResults.map(r => r.status);
    console.log('Webhook HTTP Response Statuses:', webhookStatuses);

    const all200 = webhookStatuses.every(s => s === 200 || s === 201);
    if (all200) {
        console.log('✅ All webhooks accepted gracefully (No 500 errors).');
    } else {
        console.error('❌ Some webhooks failed with non-200 status!', webhookStatuses);
    }

    console.log('\n⏳ Waiting 5 seconds for background delivery processing...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log(`\n🔍 Checking final order state...`);
    const checkRes = await fetch(`${API_URL}/orders/${orderId}`);
    const orderFinal = await checkRes.json();

    console.log('Final Order Status:', orderFinal.status);
    console.log('Final Delivery Code:', orderFinal.deliveryCode);

    if (orderFinal.status === 'delivered' && orderFinal.deliveryCode) {
        console.log('✅ TEST 2 PASSED: Order was successfully delivered.');
    } else {
        console.error('❌ TEST 2 FAILED: Order was not delivered correctly.');
    }
}

main().catch(console.error);
