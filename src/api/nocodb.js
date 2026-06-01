import axios from 'axios';

const API_BASE = 'https://nocodb.qurvii.com/api/v2';
const TABLE_ID = 'misuaa9cvim4h13';
const VIEW_ID = 'vwx3yogyd9jcoqbk';
const API_TOKEN = 'QXOzKHJ982NgA2AIc8jDqK0lC5CdWEcCwacCIsaJ';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'xc-token': API_TOKEN, 'Content-Type': 'application/json' },
  timeout: 10_000,
});

export async function fetchOrderById(orderId) {
  const { data } = await client.get(`/tables/${TABLE_ID}/records`, {
    params: {
      offset: 0,
      limit: 50,
      where: `(order_id,eq,${orderId})`,
      viewId: VIEW_ID,
    },
  });

  const list = data?.list ?? data?.records ?? [];
  console.log('NocoDB raw records:', list);

  // Build location → employee map (latest scan wins if duplicate location)
  // Location & employee names contain Hindi after " / " — strip to English only
  const locationMap = {};
  for (const rec of list) {
    const locRaw = rec.locations?.name?.trim();
    const empRaw = rec.employees?.user_name?.trim();
    if (locRaw && empRaw) {
      // Keep only the part before " / " (English portion)
      const locName = locRaw.split('/')[0].trim().toLowerCase();
      const empName = empRaw.split('/')[0].trim();
      if (locName && empName) {
        locationMap[locName] = empName;
      }
    }
  }

  const orderMeta = list[0]?.orders_2 ?? null;

  return { locationMap, orderMeta, rawRecords: list };
}
