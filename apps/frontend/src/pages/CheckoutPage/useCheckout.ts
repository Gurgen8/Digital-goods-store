import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Order } from '@repo/shared';
import { getOrder, payOrder, applyPromoCode } from 'src/api/shopApi';

const errorMap: Record<string, string> = {
  'Invalid promo code': 'Неверный промокод',
  'Promo code limit reached': 'Лимит использования промокода исчерпан',
  'Order not found': 'Заказ не найден',
  'Order cannot be modified': 'Заказ не может быть изменен',
  'Promo code already applied': 'Промокод уже применен',
  'Product not found': 'Товар не найден',
  'Something went wrong': 'Что-то пошло не так',
};

export const translateError = (msg: string) => errorMap[msg] || msg;

export const statusMap: Record<string, string> = {
  created: 'Создан',
  paid: 'Оплачен',
  delivering: 'Доставляется',
  delivered: 'Выполнен',
  out_of_stock: 'Нет в наличии',
  delivery_failed: 'Ошибка доставки',
  payment_failed: 'Ошибка оплаты',
};

export const translateStatus = (status: string) => statusMap[status] || status;

export function useCheckout(orderId: string | undefined) {
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoApplying, setPromoApplying] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    let active = true;
    setError(null);
    setOrder(null);
    getOrder(orderId)
      .then((o) => {
        if (!active) return;
        setOrder(o);
      })
      .catch((e: unknown) => {
        if (!active) return;
        setError(translateError(e instanceof Error ? e.message : 'Something went wrong'));
      });
    return () => {
      active = false;
    };
  }, [orderId]);

  const pay = async (result: 'success' | 'failed') => {
    if (!orderId) return;
    try {
      setBusy(true);
      await payOrder(orderId, { result, currency: '$' });
      navigate(`/orders/${orderId}`);
    } catch (e: unknown) {
      setError(translateError(e instanceof Error ? e.message : 'Something went wrong'));
    } finally {
      setBusy(false);
    }
  };

  const applyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !promoCode.trim()) return;
    try {
      setPromoApplying(true);
      setPromoError(null);
      const res = await applyPromoCode(orderId, promoCode.trim());
      if (res.ok && order) {
        setOrder({ ...order, amount: res.newAmount, promoCodeId: 'applied' });
        setPromoCode('');
      }
    } catch (e: unknown) {
      setPromoError(translateError(e instanceof Error ? e.message : 'Something went wrong'));
    } finally {
      setPromoApplying(false);
    }
  };

  return {
    order,
    error,
    busy,
    promoCode,
    promoError,
    promoApplying,
    setPromoCode,
    setPromoError,
    pay,
    applyPromo,
  };
}
