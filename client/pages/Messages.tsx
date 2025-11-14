import { useEffect } from "react";
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
import { MessageCircle } from "lucide-react";
import { apiClient } from "@/lib/api";

export default function Messages() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = apiClient.getToken();
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Messages</h1>
          <p className="text-slate-400 mt-1">
            Manage incoming messages from Telegram and WhatsApp
          </p>
        </div>

        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg">
                <MessageCircle className="w-12 h-12 text-blue-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Messages Page
            </h2>
            <p className="text-slate-400 mb-6">
              This page will display all incoming messages from your channels.
            </p>
            <p className="text-slate-500 text-sm mb-6">
              Features coming soon: message filtering, sentiment analysis, AI
              responses, and bulk operations.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Back to Dashboard
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                Develop This Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
