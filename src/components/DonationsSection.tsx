
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Target, TrendingUp } from "lucide-react";
import { useState } from "react";
import DonationForm from "./DonationForm";
import { format } from "date-fns";
import { fr, ar } from "date-fns/locale";

const DonationsSection = () => {
  const { t, i18n } = useTranslation();
  const [showDonationForm, setShowDonationForm] = useState(false);
  const dateLocale = i18n.language === 'ar' ? ar : fr;

  const { data: donations } = useQuery({
    queryKey: ['donations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: stats } = useQuery({
    queryKey: ['donation-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('amount, currency')
        .eq('status', 'completed');
      
      if (error) throw error;
      
      const totalAmount = data.reduce((sum, donation) => sum + Number(donation.amount), 0);
      const donorsCount = data.length;
      
      return {
        totalAmount,
        donorsCount,
        averageAmount: donorsCount > 0 ? totalAmount / donorsCount : 0
      };
    }
  });

  return (
    <section id="donations" className="py-16 bg-gradient-to-br from-red-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-red-500 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">{t('donations.title')}</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('donations.description')}
          </p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-2">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.totalAmount.toFixed(2)} DT
                </div>
                <p className="text-sm text-gray-600">{t('donations.total_collected')}</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.donorsCount}
                </div>
                <p className="text-sm text-gray-600">{t('donations.total_donors')}</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.averageAmount.toFixed(2)} DT
                </div>
                <p className="text-sm text-gray-600">{t('donations.average_donation')}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mb-12">
          <Button 
            size="lg" 
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-lg"
            onClick={() => setShowDonationForm(true)}
          >
            <Heart className="mr-2 h-5 w-5" />
            {t('donations.make_donation')}
          </Button>
        </div>

        {/* Recent Donations */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {t('donations.recent_donations')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations?.map((donation) => (
              <Card key={donation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">
                      {donation.is_anonymous ? t('donations.anonymous') : donation.donor_name}
                    </span>
                    <Badge variant="outline" className="text-green-600">
                      {donation.amount} {donation.currency}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {format(new Date(donation.created_at), 'dd MMM yyyy', { locale: dateLocale })}
                  </CardDescription>
                </CardHeader>
                {donation.message && (
                  <CardContent>
                    <p className="text-gray-600 italic">"{donation.message}"</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Donation Form Modal */}
        {showDonationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{t('donations.make_donation')}</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowDonationForm(false)}
                >
                  ×
                </Button>
              </div>
              <DonationForm onSuccess={() => setShowDonationForm(false)} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DonationsSection;
