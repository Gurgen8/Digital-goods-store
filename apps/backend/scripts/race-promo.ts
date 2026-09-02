import { randomUUID } from 'crypto';

const API_URL = `${process.env.VITE_API_URL || 'http://localhost:3001'}/api`;

async function main() {
    console.log('🏁 Starting Promo Code Race Condition Tests...');
    const sku = 'doom-2016-steam-key';

    const productsRes = await fetch(`${API_URL}/products`);
    const products = await productsRes.json();
    const product = products.find((p: any) => p.id === sku);

    if (!product) {
        console.error('❌ Product not found!');
        return;
    }

    console.log(`\n🏎️  TEST 1: 10 parallel users applying the same promo code (limit 5)`);
    // 10 users each creating an order and applying 'WELCOME' (max uses 5)
    // Wait, first let's see what promo codes are seeded.
    // I know 'WELCOME' is seeded.

    // Create 10 orders
    const orderPromises = Array.from({ length: 10 }).map(() =>
        fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: product.id })
        }).then(r => r.json())
    );
    const orders = await Promise.all(orderPromises);
    const orderIds = orders.map(o => o.orderId);
    console.log(`Created 10 orders for testing.`);

    // Apply promo to all 10 orders simultaneously
    const applyPromises = orderIds.map(id =>
        fetch(`${API_URL}/orders/${id}/apply-promo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: 'LIMIT3' })
        })
    );

    const applyResults = await Promise.all(applyPromises);
    const applyStatuses = applyResults.map(r => r.status);
    console.log('Apply Promo HTTP Response Statuses:', applyStatuses);

    const successCount = applyStatuses.filter(s => s === 201).length;
    const conflictCount = applyStatuses.filter(s => s === 409).length;

    console.log(`Success (201): ${successCount}`);
    console.log(`Conflict (409): ${conflictCount}`);

    if (successCount <= 3 && (successCount + conflictCount === 10)) {
        console.log('✅ TEST 1 PASSED: Strict limit enforcement under high concurrency.');
    } else {
        console.error('❌ TEST 1 FAILED: Too many successes or other errors.');
    }

    console.log(`\n🏎️  TEST 2: Same user double-clicking "Apply" (5 parallel requests for 1 order)`);
    const singleOrderRes = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id })
    }).then(r => r.json());
    const singleOrderId = singleOrderRes.orderId;

    const doubleClickPromises = Array.from({ length: 5 }).map(() =>
        fetch(`${API_URL}/orders/${singleOrderId}/apply-promo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: 'ONCEONLY' })
        })
    );

    const doubleClickResults = await Promise.all(doubleClickPromises);
    const dcStatuses = doubleClickResults.map(r => r.status);
    console.log('Double-click HTTP Response Statuses:', dcStatuses);

    const dcSuccessCount = dcStatuses.filter(s => s === 201).length;
    const dcConflictCount = dcStatuses.filter(s => s === 409).length;

    if (dcSuccessCount === 1 && dcConflictCount === 4) {
        console.log('✅ TEST 2 PASSED: Double-click correctly rejected. Only 1 success.');
    } else {
        console.error('❌ TEST 2 FAILED: Multiple successes for the same order.');
    }
}

main().catch(console.error);
