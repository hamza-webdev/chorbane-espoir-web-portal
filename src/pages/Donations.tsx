import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Users, Building, GraduationCap, Car, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { fr, ar } from "date-fns/locale";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DonationForm from "@/components/DonationForm";

const Donations = () => {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === 'ar' ? ar : fr;

  const { data: donations, isLoading, error } = useQuery({
    queryKey: ['donations'],
    queryFn: async () => {
      console.log('Fetching donations...');
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('status', 'completed')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching donations:', error);
        throw error;
      }
      
      console.log('Donations fetched:', data);
      return data;
    }
  });

  const fundUsageItems = [
    {
      icon: Users,
      title: t("donations.equipment"),
      description: t("donations.equipment_desc"),
      color: "text-blue-600"
    },
    {
      icon: Building,
      title: t("donations.infrastructure"),
      description: t("donations.infrastructure_desc"),
      color: "text-green-600"
    },
    {
      icon: GraduationCap,
      title: t("donations.training"),
      description: t("donations.training_desc"),
      color: "text-purple-600"
    },
    {
      icon: Car,
      title: t("donations.transport"),
      description: t("donations.transport_desc"),
      color: "text-orange-600"
    }
  ];

  const totalAmount = donations?.reduce((sum, donation) => {
    const amount = typeof donation.amount === 'string' 
      ? parseFloat(donation.amount) 
      : Number(donation.amount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0) || 0;

  console.log('Total amount calculated:', totalAmount);
  console.log('Donations data:', donations);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft size={16} className="mr-2" />
              {t("common.back", "Retour")}
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("donations.title")}
            </h1>
            <p className="text-gray-600 text-lg">
              {t("donations.subtitle")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Donation Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Impact Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  {t("donations.impact_title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {t("donations.impact_description")}
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {totalAmount.toFixed(2)} {t("donations.currency")}
                  </div>
                  <p className="text-sm text-green-700">
                    {t("donations.total_raised", "Total collecté")}
                  </p>
                  {donations && (
                    <p className="text-xs text-green-600 mt-1">
                      {donations.length} donation(s) reçue(s)
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Fund Usage */}
            <Card>
              <CardHeader>
                <CardTitle>{t("donations.fund_usage")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      icon: Users,
                      title: t("donations.equipment"),
                      description: t("donations.equipment_desc"),
                      color: "text-blue-600"
                    },
                    {
                      icon: Building,
                      title: t("donations.infrastructure"),
                      description: t("donations.infrastructure_desc"),
                      color: "text-green-600"
                    },
                    {
                      icon: GraduationCap,
                      title: t("donations.training"),
                      description: t("donations.training_desc"),
                      color: "text-purple-600"
                    },
                    {
                      icon: Car,
                      title: t("donations.transport"),
                      description: t("donations.transport_desc"),
                      color: "text-orange-600"
                    }
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Icon className={`h-5 w-5 mt-1 ${item.color}`} />
                        <div>
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Donations */}
            <Card>
              <CardHeader>
                <CardTitle>{t("donations.recent_donations", "Dons récents")}</CardTitle>
                <CardDescription>
                  {t("donations.recent_donations_desc", "Merci à tous nos généreux donateurs")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">
                    <p className="text-gray-600">{t("common.loading")}</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-4">
                    <p className="text-red-600">Erreur lors du chargement des donations</p>
                    <p className="text-sm text-gray-500">{error.message}</p>
                  </div>
                ) : donations && donations.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {donations.map((donation) => {
                      const amount = typeof donation.amount === 'string' 
                        ? parseFloat(donation.amount) 
                        : Number(donation.amount);
                      
                      return (
                        <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">
                              {donation.is_anonymous ? t("donations.anonymous_donor", "Donateur anonyme") : donation.donor_name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {format(new Date(donation.created_at), 'dd MMM yyyy', { locale: dateLocale })}
                            </p>
                            {donation.message && (
                              <p className="text-sm text-gray-700 italic mt-1">"{donation.message}"</p>
                            )}
                          </div>
                          <Badge variant="outline" className="text-green-600 border-green-200">
                            {isNaN(amount) ? '0.00' : amount.toFixed(2)} {donation.currency}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">{t("donations.no_donations", "Aucun don pour le moment")}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Les donations seront affichées ici une fois effectuées
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Donation Form */}
          <div className="lg:col-span-1">
            <DonationForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Donations;
