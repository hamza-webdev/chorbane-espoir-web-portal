
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const DonationForm = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    donorName: "",
    donorEmail: "",
    donorPhone: "",
    message: "",
    isAnonymous: false,
    paymentMethod: ""
  });

  const suggestedAmounts = [25, 50, 100, 200, 500];

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
      // Insert donation into database
      const { error } = await supabase
        .from('donations')
        .insert({
          donor_name: formData.isAnonymous ? 'Donateur anonyme' : formData.donorName,
          donor_email: formData.isAnonymous ? null : formData.donorEmail,
          donor_phone: formData.isAnonymous ? null : formData.donorPhone,
          amount: parseFloat(formData.amount),
          payment_method: formData.paymentMethod,
          is_anonymous: formData.isAnonymous,
          message: formData.message || null,
          status: 'completed' // For demo purposes, we'll mark as completed
        });

      if (error) throw error;

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
        message: "",
        isAnonymous: false,
        paymentMethod: ""
      });

      // Refresh the page to show the new donation
      window.location.reload();
    } catch (error) {
      console.error('Donation error:', error);
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
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          {t("donations.donation_form")}
        </CardTitle>
        <CardDescription>
          {t("donations.make_donation", "Soutenez notre club")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Suggested Amounts */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              {t("donations.suggested_amounts")}
            </Label>
            <div className="grid grid-cols-3 gap-2 mb-3">
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

          {/* Message */}
          <div>
            <Label htmlFor="message">{t("donations.message", "Message (optionnel)")}</Label>
            <Textarea
              id="message"
              placeholder={t("donations.message_placeholder", "Laissez un message de soutien...")}
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              rows={3}
            />
          </div>

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
  );
};

export default DonationForm;
