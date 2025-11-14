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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { apiClient, Message } from "@/lib/api";
import { Loader2, Trash2, MessageCircle, TrendingUp } from "lucide-react";

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();

  useEffect(() => {
    const token = apiClient.getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    fetchMessages();
  }, [navigate]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getMessages();
      setMessages(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load messages";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const channelMatch =
      channelFilter === "all" || msg.channel === channelFilter;
    const statusMatch = statusFilter === "all" || msg.status === statusFilter;
    return channelMatch && statusMatch;
  });

  const handleDelete = async (id: number) => {
    try {
      await apiClient.deleteMessage(id);
      setMessages(messages.filter((m) => m.id !== id));
      toast.success("Message deleted successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete message";
      toast.error(errorMessage);
    }
  };

  const getSentimentColor = (sentiment: string | null) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "negative":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "neutral":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "processing":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "failed":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
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

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Messages</h1>
          <p className="text-slate-400 mt-1">
            {filteredMessages.length} message
            {filteredMessages.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="pt-4">
              <label className="text-sm text-slate-400 block mb-2">
                Channel
              </label>
              <Select value={channelFilter} onValueChange={setChannelFilter}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="telegram">Telegram</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="pt-4">
              <label className="text-sm text-slate-400 block mb-2">
                Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="pt-4 flex items-end">
              <Button
                onClick={fetchMessages}
                variant="outline"
                className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Messages Table */}
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-white">Messages List</CardTitle>
            <CardDescription>
              Incoming messages from Telegram and WhatsApp channels
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredMessages.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">
                  No messages found with current filters
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">
                        From
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">
                        Channel
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">
                        Message
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">
                        Sentiment
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMessages.map((message) => (
                      <tr
                        key={message.id}
                        className="border-b border-slate-800 hover:bg-slate-800/50"
                      >
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-white font-medium">
                              {message.sender_name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {message.sender_id}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="border-slate-700">
                            {message.channel === "telegram"
                              ? "��� Telegram"
                              : "💬 WhatsApp"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-slate-300 truncate max-w-xs">
                            {message.message_text}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant="outline"
                            className={`${getSentimentColor(message.sentiment)}`}
                          >
                            {message.sentiment || "Unknown"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(message.status)}`}
                          >
                            {message.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {new Date(message.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDelete(message.id)}
                            className="text-slate-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
