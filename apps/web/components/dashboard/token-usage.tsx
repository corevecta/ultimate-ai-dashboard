'use client'

import { motion } from 'framer-motion'
import { 
  Coins, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  BarChart3,
  AlertCircle,
  Calendar
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

interface TokenUsageData {
  daily: {
    date: string;
    tokens: number;
    cost: number;
  }[];
  byAgent: {
    agent: string;
    tokens: number;
    percentage: number;
  }[];
  totals: {
    today: number;
    week: number;
    month: number;
    cost: {
      today: number;
      week: number;
      month: number;
    };
  };
  limits: {
    daily: number;
    monthly: number;
    used: number;
  };
}

const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

export function TokenUsage() {
  const [data, setData] = useState<TokenUsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

  useEffect(() => {
    fetchTokenUsage();
    const interval = setInterval(fetchTokenUsage, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  async function fetchTokenUsage() {
    try {
      // Mock data - in production, fetch from /api/tokens/usage
      const mockData: TokenUsageData = {
        daily: [
          { date: 'Mon', tokens: 245000, cost: 4.90 },
          { date: 'Tue', tokens: 312000, cost: 6.24 },
          { date: 'Wed', tokens: 287000, cost: 5.74 },
          { date: 'Thu', tokens: 198000, cost: 3.96 },
          { date: 'Fri', tokens: 421000, cost: 8.42 },
          { date: 'Sat', tokens: 156000, cost: 3.12 },
          { date: 'Sun', tokens: 284593, cost: 5.69 }
        ],
        byAgent: [
          { agent: 'Code Review', tokens: 450230, percentage: 35 },
          { agent: 'Testing', tokens: 321000, percentage: 25 },
          { agent: 'Documentation', tokens: 234000, percentage: 18 },
          { agent: 'Security', tokens: 156000, percentage: 12 },
          { agent: 'UI/UX', tokens: 89000, percentage: 7 },
          { agent: 'Deployment', tokens: 38670, percentage: 3 }
        ],
        totals: {
          today: 284593,
          week: 1903593,
          month: 7614372,
          cost: {
            today: 5.69,
            week: 38.07,
            month: 152.29
          }
        },
        limits: {
          daily: 500000,
          monthly: 10000000,
          used: 76
        }
      };
      
      setData(mockData);
      setLoading(false);
    } catch (err) {
      // Expected when backend is not running - using mock data
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 animate-pulse">
        <div className="h-8 bg-gray-800 rounded w-1/3 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-800 rounded" />
          <div className="h-64 bg-gray-800 rounded" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const usagePercentage = (data.totals.today / data.limits.daily) * 100;
  const isNearLimit = usagePercentage > 80;

  return (
    <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 bg-opacity-20">
            <Coins className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Token Usage</h2>
            <p className="text-gray-400">Monitor API token consumption and costs</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === 'week' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === 'month' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Daily Limit Warning */}
      {isNearLimit && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-lg bg-yellow-500/20 border border-yellow-500/30 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          <p className="text-sm text-yellow-500">
            You've used {usagePercentage.toFixed(0)}% of your daily token limit
          </p>
        </motion.div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-gray-800/50 border border-white/5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Today</span>
          </div>
          <p className="text-2xl font-bold text-white">{(data.totals.today / 1000).toFixed(0)}k</p>
          <p className="text-xs text-gray-500 mt-1">${data.totals.cost.today.toFixed(2)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-gray-800/50 border border-white/5"
        >
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">This Week</span>
          </div>
          <p className="text-2xl font-bold text-white">{(data.totals.week / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-gray-500 mt-1">${data.totals.cost.week.toFixed(2)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl bg-gray-800/50 border border-white/5"
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Monthly Cost</span>
          </div>
          <p className="text-2xl font-bold text-white">${data.totals.cost.month.toFixed(0)}</p>
          <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            12% vs last month
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl bg-gray-800/50 border border-white/5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Quota Used</span>
          </div>
          <p className="text-2xl font-bold text-white">{data.limits.used}%</p>
          <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${data.limits.used}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Trend */}
        <div className="p-6 rounded-xl bg-gray-800/30">
          <h3 className="text-lg font-semibold text-white mb-4">Daily Usage Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data.daily}>
              <defs>
                <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                formatter={(value: any) => [`${(value / 1000).toFixed(0)}k tokens`, 'Usage']}
              />
              <Area
                type="monotone"
                dataKey="tokens"
                stroke="#8B5CF6"
                fillOpacity={1}
                fill="url(#tokenGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Usage by Agent */}
        <div className="p-6 rounded-xl bg-gray-800/30">
          <h3 className="text-lg font-semibold text-white mb-4">Usage by Agent</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.byAgent}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ agent, percentage }) => `${agent}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="tokens"
              >
                {data.byAgent.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                formatter={(value: any) => `${(value / 1000).toFixed(0)}k tokens`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}