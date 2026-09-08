import { randomUUID } from 'crypto';

const API_URL = `${process.env.VITE_API_URL || 'http://localhost:3001'}/api`;

async function main() {
    console.log('🏁 Starting Payment Race Condition Test...');
    
    // 1. Берем любой товар
    const productsRes = await fetch(`${API_URL}/products`);
    const products = await productsRes.json();
    const product = products[0]; // Берем первый попавшийся

    if (!product) {
        console.error('❌ Product not found!');
        return;
    }
    
    console.log(`Выбран товар: ${product.title} (ID: ${product.id})`);
    console.log(`ВНИМАНИЕ: Для чистоты эксперимента убедитесь, что на складе осталась всего 1 штука этого товара! (Или меньше, чем количество запросов).`);

    // 2. Создаем 5 РАЗНЫХ заказов от "разных" людей на один и тот же товар
    console.log('\nСоздаем 5 независимых заказов...');
    const orderIds = [];
    for (let i = 0; i < 5; i++) {
        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: product.id })
        });
        const data = await res.json();
        if (data.orderId) {
            orderIds.push(data.orderId);
            console.log(`Заказ ${i + 1} создан: ${data.orderId}`);
        }
    }

    if (orderIds.length === 0) {
        console.error('Не удалось создать заказы');
        return;
    }

    console.log(`\n🏎️  ТЕСТ: Пытаемся оплатить все ${orderIds.length} заказов АБСОЛЮТНО ОДНОВРЕМЕННО`);
    
    const payPromises = orderIds.map((id, index) => {
        return fetch(`${API_URL}/orders/${id}/pay`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ result: 'success', currency: 'RUB' })
        }).then(async res => {
            const status = res.status;
            let body;
            try { body = await res.json(); } catch(e) { body = await res.text(); }
            
            if (status === 200 || status === 201) {
                console.log(`✅ Поток ${index + 1}: УСПЕШНАЯ ПОКУПКА (Заказ ${id})`);
            } else if (status === 409) {
                console.log(`🚫 Поток ${index + 1}: ОТКАЗ - 409 Conflict ("Товар только что раскупили")`);
            } else {
                console.log(`⚠️ Поток ${index + 1}: Неожиданный статус ${status}`, body);
            }
            return { id, status, body };
        });
    });

    const results = await Promise.all(payPromises);
    
    const successes = results.filter(r => r.status === 200 || r.status === 201);
    const conflicts = results.filter(r => r.status === 409);

    console.log('\n📊 ИТОГИ ГОНКИ:');
    console.log(`Успешных оплат (выдан товар): ${successes.length}`);
    console.log(`Отбитых оплат (не хватило товара): ${conflicts.length}`);
    
    if (successes.length === 1 && conflicts.length > 0) {
        console.log('\n🏆 ТЕСТ ПРОЙДЕН ИДЕАЛЬНО! Только один человек смог забрать последнюю копию, остальные получили моментальный отказ.');
    } else if (successes.length > 1) {
        console.log('\nℹ️ Несколько покупок прошло успешно. Вероятно, на складе было больше 1 единицы товара.');
    }
}

main().catch(console.error);
