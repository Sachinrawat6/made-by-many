import { useEffect, useState } from 'react';
import axios from 'axios';

const API_TOKEN = 'QXOzKHJ982NgA2AIc8jDqK0lC5CdWEcCwacCIsaJ';
const TABLE_ID = 'misuaa9cvim4h13';
const VIEW_ID = 'vwx3yogyd9jcoqbk';

// Avatar colors for each role
const AVATAR_COLORS = [
  'bg-amber-100',
  'bg-rose-100',
  'bg-sky-100',
  'bg-violet-100',
  'bg-emerald-100',
  'bg-orange-100',
];

const ROLE_ICON = {
  'Store Helper': '🧺',
  'Production Flow': '⚙️',
  'Cutting Master': '✂️',
  Tailor: '🧵',
  'Finishing Team': '✨',
  'Operation Team': '📋',
};

function Avatar({ name, color, size = 'lg' }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const sizeClass = size === 'lg' ? 'w-16 h-16 text-xl' : 'w-10 h-10 text-sm';

  return (
    <div
      className={`${sizeClass} ${color} rounded-full flex items-center justify-center font-bold text-gray-700 shadow-sm border-2 border-white ring-2 ring-gray-100`}
    >
      {initials}
    </div>
  );
}

function RoleCard({ role, name, icon, color, index, isLast }) {
  return (
    <div className="flex items-start gap-4 relative">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-8 top-16 w-0.5 h-full bg-gradient-to-b from-gray-200 to-transparent z-0" />
      )}

      {/* Avatar */}
      <div className="relative z-10 flex-shrink-0">
        <Avatar name={name} color={color} size="lg" />
        <span className="absolute -bottom-1 -right-1 text-base">{icon}</span>
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
            {role}
          </p>
          <p className="text-lg font-bold text-gray-800">{name}</p>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex items-start gap-4">
      <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
      <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}

export default function MadeByMany() {
  // Get orderId from URL search params
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('orderId') || params.get('order_id') || params.get('id');

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setError('No order ID found in URL. Please add ?orderId=YOUR_ORDER_ID to the URL.');
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://nocodb.qurvii.com/api/v2/tables/${TABLE_ID}/records`,
          {
            params: {
              offset: 0,
              limit: 1,
              where: `(Id,eq,${orderId})`,
              viewId: VIEW_ID,
            },
            headers: {
              'xc-token': API_TOKEN,
            },
          }
        );

        const records = response.data?.list || response.data?.records || [];
        if (records.length === 0) {
          setError(`No order found with ID: ${orderId}`);
        } else {
          setOrderData(records[0]);
        }
      } catch (err) {
        setError('Failed to load order data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Build team members from fetched data with defaults
  const getTeam = (data) => [
    {
      role: 'Store Helper',
      name: data?.['Store Helper'] || data?.['store_helper'] || data?.['StoreHelper'] || 'Sneha',
      icon: ROLE_ICON['Store Helper'],
      color: AVATAR_COLORS[0],
    },
    {
      role: 'Production Flow',
      name:
        data?.['Production Flow'] ||
        data?.['production_flow'] ||
        data?.['ProductionFlow'] ||
        'Sanjeet',
      icon: ROLE_ICON['Production Flow'],
      color: AVATAR_COLORS[1],
    },
    {
      role: 'Cutting Master',
      name:
        data?.['Cutting Master'] || data?.['cutting_master'] || data?.['CuttingMaster'] || 'Mahesh',
      icon: ROLE_ICON['Cutting Master'],
      color: AVATAR_COLORS[2],
    },
    {
      role: 'Tailor',
      name: data?.['Tailor scan 2'] || data?.['tailor'] || 'Shamshool',
      icon: ROLE_ICON['Tailor'],
      color: AVATAR_COLORS[3],
    },
    {
      role: 'Finishing Team',
      name:
        data?.['Finishing Team'] ||
        data?.['finishing_team'] ||
        data?.['FinishingTeam'] ||
        'Shahjahan',
      icon: ROLE_ICON['Finishing Team'],
      color: AVATAR_COLORS[4],
    },
    {
      role: 'Operation Team',
      name:
        data?.['Operation Team'] || data?.['operation_team'] || data?.['OperationTeam'] || 'Tanish',
      icon: ROLE_ICON['Operation Team'],
      color: AVATAR_COLORS[5],
    },
  ];

  const team = orderData ? getTeam(orderData) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Made by Many</h1>
            {orderId && <p className="text-xs text-gray-400 mt-0.5">Order #{orderId}</p>}
          </div>
          {/* Logo placeholder */}
          <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center">
            <span className="text-white text-xs font-bold">Q</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Subtitle */}
        <p className="text-sm text-gray-500 mb-8 text-center">
          Meet the talented team who brought your order to life ✨
        </p>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
            <p className="text-red-500 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="space-y-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Team list */}
        {!loading && !error && (
          <div className="space-y-0">
            {team.map((member, index) => (
              <RoleCard
                key={member.role}
                {...member}
                index={index}
                isLast={index === team.length - 1}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        {!loading && !error && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold">
              <span>🎉</span>
              <span>Made with love & craft</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
