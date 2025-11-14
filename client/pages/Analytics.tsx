import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { apiClient, DashboardStats } from "@/lib/api";
import { Loader2, BarChart3, Calendar, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Analytics() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState("2025-11-01");
  const [endDate, setEndDate] = useState("2025-11-30");
  const navigate = useNavigate();

  useEffect(() => {
    const token = apiClient.getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getDashboardStats();
      setStats(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load analytics";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </Layout>
    );
  }

  if (!stats) {
    return (
      <Layout>
        <Card className="border-red-900 bg-red-950">
          <CardContent className="pt-6">
            <p className="text-red-200">Failed to load analytics data</p>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  // Mock daily data for the chart
  const dailyData = [
    { date: "Nov 1", messages: 45, customers: 8 },
    { date: "Nov 2", messages: 52, customers: 6 },
    { date: "Nov 3", messages: 48, customers: 7 },
    { date: "Nov 4", messages: 61, customers: 9 },
    { date: "Nov 5", messages: 55, customers: 5 },
    { date: "Nov 6", messages: 67, customers: 10 },
    { date: "Nov 7", messages: 72, customers: 8 },
  ];

  const sentimentData = [
    {
      name: "Positive",
      value: stats.sentiment_distribution.positive,
      fill: "#10b981",
    },
    {
      name: "Neutral",
      value: stats.sentiment_distribution.neutral,
      fill: "#6b7280",
    },
    {
      name: "Negative",
      value: stats.sentiment_distribution.negative,
      fill: "#ef4444",
    },
  ];

  const intentData = [
    { name: "Product Inquiry", value: 450, fill: "#3b82f6" },
    { name: "Support Request", value: 380, fill: "#8b5cf6" },
    { name: "Complaint", value: 190, fill: "#f59e0b" },
    { name: "Other", value: 380, fill: "#6b7280" },
  ];

  const StatCard = ({
    title,
    value,
    change,
    description,
  }: {
    title: string;
    value: string | number;
    change?: string;
    description: string;
  }) => (
    <Card className="border-slate-800 bg-slate-900">
      <CardContent className="pt-6">
        <p className="text-sm text-slate-400 mb-1">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {change && (
          <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {change}
          </p>
        )}
        <p className="text-xs text-slate-500 mt-2">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-slate-400 mt-1">
            Detailed insights about your messages and customers
          </p>
        </div>

        {/* Date Range Filter */}
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Date Range
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-slate-400 text-sm block mb-2">
                  Start Date
                </Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-400 text-sm block mb-2">
                  End Date
                </Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={fetchStats}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Avg Response Time"
            value={`${stats.avg_response_time_seconds.toFixed(1)}s`}
            description="Faster than industry average"
          />
          <StatCard
            title="Total Messages"
            value={stats.total_messages}
            change="+15% from last month"
            description="All time messages"
          />
          <StatCard
            title="Total Customers"
            value={stats.total_customers}
            change="+8% from last month"
            description="Active customers"
          />
          <StatCard
            title="Completion Rate"
            value={`${((stats.sentiment_distribution.positive / stats.total_messages) * 100).toFixed(1)}%`}
            change="+5% improvement"
            description="Successfully resolved"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Trends */}
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white">Daily Trends</CardTitle>
              <CardDescription>
                Messages and new customers per day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => value.toLocaleString()}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="messages"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="customers"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sentiment Distribution */}
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white">
                Sentiment Distribution
              </CardTitle>
              <CardDescription>Message sentiment analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => value.toLocaleString()}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {sentimentData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.fill }}
                      />
                      <span className="text-slate-400">{item.name}</span>
                    </div>
                    <span className="text-white font-semibold">
                      {item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Intent Distribution */}
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white">Message Intents</CardTitle>
              <CardDescription>Distribution of message types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={intentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => value.toLocaleString()}
                  />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Channel Performance */}
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white">Channel Performance</CardTitle>
              <CardDescription>Messages by channel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400">Telegram</span>
                    <span className="text-white font-semibold">
                      {stats.channel_distribution.telegram.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (stats.channel_distribution.telegram /
                            (stats.channel_distribution.telegram +
                              stats.channel_distribution.whatsapp)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400">WhatsApp</span>
                    <span className="text-white font-semibold">
                      {stats.channel_distribution.whatsapp.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (stats.channel_distribution.whatsapp /
                            (stats.channel_distribution.telegram +
                              stats.channel_distribution.whatsapp)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
