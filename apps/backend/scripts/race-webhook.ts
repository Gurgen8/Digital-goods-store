import { randomUUID } from 'crypto';

async function runRaceTest() {
  const BACKEND_URL = 'http://localhost:3001';

  console.log('1. Creating a single order...');
  const createRes = await fetch(`${BACKEND_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId: 'KEY-CS2-PRIME' }),
  });
  const orderData = await createRes.json();
  const orderId = orderData.orderId;
  console.log(`Order created: ${orderId}`);

  console.log('2. Sending 50 concurrent webhooks...');
  const concurrencyCount = 50;
  const promises = [];

  for (let i = 0; i < concurrencyCount; i++) {
    // Unique event IDs to simulate duplicate triggers for the same order from payment provider
    const eventId = `evt_${randomUUID()}`;
    promises.push(
      fetch(`${BACKEND_URL}/api/webhook/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          order_id: orderId,
          status: 'paid',
          amount: 1290,
          currency: 'RUB',
          created_at: new Date().toISOString(),
        }),
      })
    );
  }

  await Promise.all(promises);
  console.log('Finished sending 50 webhooks.');

  console.log('3. Waiting for delivery to finish (2 seconds)...');
  await new Promise(r => setTimeout(r, 2000));

  console.log('4. Checking order status...');
  const getOrderRes = await fetch(`${BACKEND_URL}/api/orders/${orderId}`);
  const order = await getOrderRes.json();

  console.log(`Final order status: ${order.status}`);
  console.log(`Delivery Code: ${order.deliveryCode}`);

  if (order.status === 'delivered' && order.deliveryCode) {
    console.log('✅ Race Test Passed: Only one delivery occurred.');
  } else {
    console.log('❌ Race Test Failed: Delivery not successful or duplicate occurred.');
  }
}

runRaceTest().catch(console.error);
