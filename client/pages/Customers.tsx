import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { apiClient, Customer } from "@/lib/api";
import {
  Loader2,
  Trash2,
  Edit2,
  Users,
  Plus,
  MessageCircle,
  Phone,
  Mail,
} from "lucide-react";

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = apiClient.getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    fetchCustomers();
  }, [navigate]);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getCustomers();
      setCustomers(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load customers";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      try {
        await apiClient.deleteCustomer(id);
        setCustomers(customers.filter((c) => c.id !== id));
        toast.success("Customer deleted successfully");
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to delete customer";
        toast.error(errorMessage);
      }
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Customers</h1>
            <p className="text-slate-400 mt-1">
              {customers.length} customer{customers.length !== 1 ? "s" : ""} in total
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={fetchCustomers}
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Customers Grid */}
        {customers.length === 0 ? (
          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="pt-12 pb-12 text-center">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No customers found</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-slate-800 bg-slate-900">
                <CardContent className="pt-6">
                  <p className="text-sm text-slate-400 mb-1">Total Customers</p>
                  <p className="text-2xl font-bold text-white">{customers.length}</p>
                </CardContent>
              </Card>
              <Card className="border-slate-800 bg-slate-900">
                <CardContent className="pt-6">
                  <p className="text-sm text-slate-400 mb-1">With Email</p>
                  <p className="text-2xl font-bold text-white">
                    {customers.filter((c) => c.email).length}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-slate-800 bg-slate-900">
                <CardContent className="pt-6">
                  <p className="text-sm text-slate-400 mb-1">With Telegram</p>
                  <p className="text-2xl font-bold text-white">
                    {customers.filter((c) => c.telegram_id).length}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-slate-800 bg-slate-900">
                <CardContent className="pt-6">
                  <p className="text-sm text-slate-400 mb-1">With WhatsApp</p>
                  <p className="text-2xl font-bold text-white">
                    {customers.filter((c) => c.whatsapp_id).length}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Customers Table */}
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white">Customers List</CardTitle>
                <CardDescription>Manage all your customers and their information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-400 font-semibold">Name</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-semibold">Phone</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-semibold">Email</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-semibold">Channels</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-semibold">Joined</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((customer) => (
                        <tr key={customer.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                                {customer.name.charAt(0)}
                              </div>
                              <p className="text-white font-medium">{customer.name}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2 text-slate-300">
                              <Phone className="w-3 h-3 text-slate-500" />
                              {customer.phone || "—"}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2 text-slate-300">
                              <Mail className="w-3 h-3 text-slate-500" />
                              {customer.email ? (
                                <a
                                  href={`mailto:${customer.email}`}
                                  className="text-blue-400 hover:text-blue-300"
                                >
                                  {customer.email}
                                </a>
                              ) : (
                                "—"
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              {customer.telegram_id && (
                                <Badge variant="outline" className="border-blue-500/50 bg-blue-500/10 text-blue-300">
                                  <MessageCircle className="w-3 h-3 mr-1" />
                                  TG
                                </Badge>
                              )}
                              {customer.whatsapp_id && (
                                <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-300">
                                  <MessageCircle className="w-3 h-3 mr-1" />
                                  WA
                                </Badge>
                              )}
                              {!customer.telegram_id && !customer.whatsapp_id && (
                                <span className="text-slate-500 text-xs">None</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-400 text-xs">
                            {new Date(customer.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button className="text-slate-400 hover:text-blue-400 transition-colors">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(customer.id)}
                                className="text-slate-400 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
