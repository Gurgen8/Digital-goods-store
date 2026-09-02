import { randomUUID } from 'crypto';

async function runRaceTest() {
  const BACKEND_URL = process.env.VITE_API_URL

  console.log('1. Fetching product ID for DOOM...');
  const productsRes = await fetch(`${BACKEND_URL}/api/products`);
  const products = await productsRes.json() as { id: string, title: string }[];
  const product = products.find((p) => p.title.includes('DOOM') || p.id.includes('doom'));

  if (!product) {
    throw new Error('DOOM Product not found');
  }

  const productId = product.id;
  console.log(`Using product ID: ${productId}`);

  console.log('2. Creating a single order...');
  const createRes = await fetch(`${BACKEND_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId }),
  });
  const orderData = await createRes.json();
  const orderId = orderData.orderId;
  console.log(`Order created: ${orderId}`);

  console.log('3. Sending 50 concurrent webhooks...');
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

  console.log('4. Waiting for delivery to finish (3 seconds)...');
  await new Promise(r => setTimeout(r, 3000));

  console.log('5. Checking order status...');
  const getOrderRes = await fetch(`${BACKEND_URL}/api/orders/${orderId}`);
  const order = await getOrderRes.json();

  console.log(`Final order status: ${order.status}`);
  console.log(`Delivery Code: ${order.deliveryCode}`);

  if (order.status === 'delivered' && order.deliveryCode) {
    console.log('✅ Race Test Passed: Delivery successful.');
  } else {
    console.log('❌ Race Test Failed: Delivery not successful.');
  }
}

runRaceTest().catch(console.error);
