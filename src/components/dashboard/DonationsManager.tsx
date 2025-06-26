
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Heart, Users, Building, GraduationCap, Car, CreditCard, DollarSign } from "lucide-react";

const DonationsManager = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    donorName: "",
    donorEmail: "",
    donorPhone: "",
    isAnonymous: false,
    paymentMethod: ""
  });

  const suggestedAmounts = [25, 50, 100, 200, 500];

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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSuggestedAmount = (amount: number) => {
    setFormData(prev => ({
      ...prev,
      amount: amount.toString()
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.paymentMethod) {
      toast({
        title: t("common.error"),
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    if (!formData.isAnonymous && (!formData.donorName || !formData.donorEmail)) {
      toast({
        title: t("common.error"),
        description: "Veuillez remplir vos informations de contact",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: t("donations.thank_you"),
        description: t("donations.success_message"),
      });

      // Reset form
      setFormData({
        amount: "",
        donorName: "",
        donorEmail: "",
        donorPhone: "",
        isAnonymous: false,
        paymentMethod: ""
      });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("donations.error_message"),
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t("donations.title")}
        </h1>
        <p className="text-gray-600 text-lg">
          {t("donations.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impact and Fund Usage */}
        <div className="space-y-6">
          {/* Impact Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                {t("donations.impact_title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {t("donations.impact_description")}
              </p>
            </CardContent>
          </Card>

          {/* Fund Usage */}
          <Card>
            <CardHeader>
              <CardTitle>{t("donations.fund_usage")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fundUsageItems.map((item, index) => {
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
        </div>

        {/* Donation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              {t("donations.donation_form")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Suggested Amounts */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  {t("donations.suggested_amounts")}
                </Label>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {suggestedAmounts.map((amount) => (
                    <Button
                      key={amount}
                      type="button"
                      variant={formData.amount === amount.toString() ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSuggestedAmount(amount)}
                      className="text-xs"
                    >
                      {amount} {t("donations.currency")}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <Label htmlFor="amount">{t("donations.amount")} *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder={t("donations.amount_placeholder")}
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  required
                />
              </div>

              {/* Anonymous Donation Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onCheckedChange={(checked) => handleInputChange("isAnonymous", checked)}
                />
                <Label htmlFor="anonymous" className="text-sm">
                  {t("donations.anonymous")}
                </Label>
              </div>

              {/* Donor Information (if not anonymous) */}
              {!formData.isAnonymous && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label htmlFor="donorName">{t("donations.donor_name")} *</Label>
                    <Input
                      id="donorName"
                      placeholder={t("donations.donor_name_placeholder")}
                      value={formData.donorName}
                      onChange={(e) => handleInputChange("donorName", e.target.value)}
                      required={!formData.isAnonymous}
                    />
                  </div>
                  <div>
                    <Label htmlFor="donorEmail">{t("donations.donor_email")} *</Label>
                    <Input
                      id="donorEmail"
                      type="email"
                      placeholder={t("donations.donor_email_placeholder")}
                      value={formData.donorEmail}
                      onChange={(e) => handleInputChange("donorEmail", e.target.value)}
                      required={!formData.isAnonymous}
                    />
                  </div>
                  <div>
                    <Label htmlFor="donorPhone">{t("donations.donor_phone")}</Label>
                    <Input
                      id="donorPhone"
                      placeholder={t("donations.donor_phone_placeholder")}
                      value={formData.donorPhone}
                      onChange={(e) => handleInputChange("donorPhone", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div>
                <Label htmlFor="paymentMethod">{t("donations.payment_method")} *</Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange("paymentMethod", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une méthode de paiement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smt">{t("donations.smt_gateway")}</SelectItem>
                    <SelectItem value="paypal">{t("donations.paypal")}</SelectItem>
                    <SelectItem value="card">{t("donations.card")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isProcessing}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {isProcessing ? t("donations.processing") : t("donations.donate_now")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DonationsManager;
