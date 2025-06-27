import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Users, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { format, parseISO, subDays, startOfDay } from "date-fns";
import { fr, ar } from "date-fns/locale";

const DonationStats = () => {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === 'ar' ? ar : fr;

  const { data: donations } = useQuery({
    queryKey: ['donations-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('status', 'completed')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Calcul des statistiques globales
  const stats = donations ? {
    totalAmount: donations.reduce((sum, d) => sum + Number(d.amount), 0),
    totalDonors: donations.length,
    averageAmount: donations.length > 0 ? donations.reduce((sum, d) => sum + Number(d.amount), 0) / donations.length : 0,
    anonymousDonors: donations.filter(d => d.is_anonymous).length
  } : null;

  // Données pour le graphique par jour (7 derniers jours)
  const dailyData = donations ? (() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = startOfDay(subDays(new Date(), i));
      return {
        date: format(date, 'dd/MM', { locale: dateLocale }),
        fullDate: date,
        amount: 0,
        count: 0
      };
    }).reverse();

    donations.forEach(donation => {
      const donationDate = startOfDay(parseISO(donation.created_at));
      const dayData = last7Days.find(day => day.fullDate.getTime() === donationDate.getTime());
      if (dayData) {
        dayData.amount += Number(donation.amount);
        dayData.count += 1;
      }
    });

    return last7Days;
  })() : [];

  // Données pour le graphique par méthode de paiement
  const paymentMethodData = donations ? (() => {
    const methods = {};
    donations.forEach(donation => {
      const method = donation.payment_method || 'Autre';
      methods[method] = (methods[method] || 0) + Number(donation.amount);
    });
    
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
    return Object.entries(methods).map(([method, amount], index) => ({
      method,
      amount,
      color: colors[index % colors.length]
    }));
  })() : [];

  const chartConfig = {
    amount: {
      label: t('donations.amount'),
      color: '#10b981',
    },
    count: {
      label: t('donations.total_donors'),
      color: '#3b82f6',
    },
  };

  if (!donations) return <div>Chargement...</div>;

  return (
    <div className="space-y-8">
      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('donations.total_collected')}</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats?.totalAmount.toFixed(2)} DT
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('donations.total_donors')}</p>
                <p className="text-2xl font-bold text-blue-600">{stats?.totalDonors}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('donations.average_donation')}</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats?.averageAmount.toFixed(2)} DT
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dons anonymes</p>
                <p className="text-2xl font-bold text-orange-600">{stats?.anonymousDonors}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Graphique par jour */}
        <Card>
          <CardHeader>
            <CardTitle>Dons par jour (7 derniers jours)</CardTitle>
            <CardDescription>Évolution des dons quotidiens</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="amount" fill="#10b981" name="Montant (DT)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Graphique par méthode de paiement */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par méthode de paiement</CardTitle>
            <CardDescription>Montants collectés par méthode</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="amount"
                    label={({ method, amount }) => `${method}: ${Number(amount).toFixed(2)} DT`}
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const value = Number(payload[0].value);
                        return (
                          <div className="bg-white p-2 border rounded shadow">
                            <p>{`${payload[0].payload.method}: ${value.toFixed(2)} DT`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tendance mensuelle */}
      <Card>
        <CardHeader>
          <CardTitle>Tendance des dons</CardTitle>
          <CardDescription>Évolution du nombre de dons par jour</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Nombre de dons"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationStats;
