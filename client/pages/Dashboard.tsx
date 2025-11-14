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
import { toast } from "sonner";
import { apiClient, DashboardStats } from "@/lib/api";
import {
  MessageCircle,
  Users,
  TrendingUp,
  Clock,
  MessageSquare,
  Zap,
  Loader2,
  AlertCircle,
} from "lucide-react";
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

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
      const data = await apiClient.getDashboardStats();
      setStats(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load dashboard";
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
          <CardContent className="pt-6 flex gap-4">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-red-200 font-semibold">
                Failed to load dashboard
              </p>
              <p className="text-red-300 text-sm">
                Unable to connect to the server
              </p>
              <Button
                onClick={fetchStats}
                variant="outline"
                size="sm"
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </Layout>
    );
  }

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

  const channelData = [
    {
      name: "Telegram",
      value: stats.channel_distribution.telegram,
      fill: "#3b82f6",
    },
    {
      name: "WhatsApp",
      value: stats.channel_distribution.whatsapp,
      fill: "#10b981",
    },
  ];

  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
    trend,
  }: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    description: string;
    trend?: number;
  }) => (
    <Card className="border-slate-800 bg-slate-900">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-400">{title}</p>
            <p className="text-3xl font-bold text-white">
              {value.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">{description}</p>
          </div>
          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg">
            {Icon}
          </div>
        </div>
        {trend !== undefined && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500">{trend}% increase</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400 mt-1">
              Welcome back! Here's your data overview
            </p>
          </div>
          <Button
            onClick={fetchStats}
            variant="outline"
            size="sm"
            className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
          >
            Refresh
          </Button>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Messages"
            value={stats.total_messages}
            icon={<MessageCircle className="w-6 h-6 text-blue-400" />}
            description="All time messages"
            trend={12}
          />
          <StatCard
            title="Today's Messages"
            value={stats.messages_today}
            icon={<MessageSquare className="w-6 h-6 text-cyan-400" />}
            description="Messages received today"
          />
          <StatCard
            title="Total Customers"
            value={stats.total_customers}
            icon={<Users className="w-6 h-6 text-green-400" />}
            description="Active customers"
            trend={8}
          />
          <StatCard
            title="Avg Response Time"
            value={`${stats.avg_response_time_seconds.toFixed(1)}s`}
            icon={<Clock className="w-6 h-6 text-yellow-400" />}
            description="Average response time"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sentiment Distribution */}
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white">
                Sentiment Distribution
              </CardTitle>
              <CardDescription>Message sentiment analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
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

          {/* Channel Distribution */}
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white">Messages by Channel</CardTitle>
              <CardDescription>Distribution across channels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {channelData.map((entry, index) => (
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
                {channelData.map((item) => (
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

          {/* Quick Actions */}
          <Card className="border-slate-800 bg-slate-900 flex flex-col">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-3">
              <Button
                onClick={() => navigate("/messages")}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                View Messages
              </Button>
              <Button
                onClick={() => navigate("/customers")}
                variant="outline"
                className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Customers
              </Button>
              <Button
                onClick={() => navigate("/analytics")}
                variant="outline"
                className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <Zap className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
