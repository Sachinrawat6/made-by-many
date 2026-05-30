import { useSearchParams, useParams } from 'react-router-dom';
import { parseOrderId } from '@/utils/helpers';

/**
 * useUrlParams
 *
 * Reads orderId from multiple possible sources in priority order:
 *   1. React Router dynamic segment  (/order/:orderId)
 *   2. Query string                  (?orderId=123 | ?order_id=123 | ?id=123)
 *
 * Returns: { orderId: string | null }
 */
export function useUrlParams() {
  const params = useParams();
  const [searchParams] = useSearchParams();

  const orderId =
    parseOrderId(params.orderId) ||
    parseOrderId(searchParams.get("orderId")) ||
    parseOrderId(searchParams.get("order_id")) ||
    parseOrderId(searchParams.get("id")) ||
    null;

  return { orderId };
}
