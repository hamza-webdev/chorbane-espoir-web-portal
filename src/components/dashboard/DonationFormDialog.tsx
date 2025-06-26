
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DonationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const DonationFormDialog = ({ open, onOpenChange, onSuccess }: DonationFormDialogProps) => {
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
    paymentMethod: "",
    status: "completed"
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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

    if (!formData.isAnonymous && !formData.donorName) {
      toast({
        title: t("common.error"),
        description: "Veuillez remplir le nom du donateur",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      console.log('Creating donation:', formData);
      
      const { data, error } = await supabase
        .from('donations')
        .insert({
          donor_name: formData.isAnonymous ? 'Donateur anonyme' : formData.donorName,
          donor_email: formData.isAnonymous ? null : formData.donorEmail,
          donor_phone: formData.isAnonymous ? null : formData.donorPhone,
          amount: parseFloat(formData.amount),
          payment_method: formData.paymentMethod,
          is_anonymous: formData.isAnonymous,
          message: formData.message || null,
          status: formData.status
        })
        .select();

      if (error) {
        console.error('Donation error:', error);
        throw error;
      }

      console.log('Donation created:', data);

      toast({
        title: "Donation ajoutée",
        description: "La donation a été enregistrée avec succès",
      });

      // Reset form
      setFormData({
        amount: "",
        donorName: "",
        donorEmail: "",
        donorPhone: "",
        message: "",
        isAnonymous: false,
        paymentMethod: "",
        status: "completed"
      });

      onOpenChange(false);
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error('Donation error:', error);
      toast({
        title: t("common.error"),
        description: "Erreur lors de l'enregistrement de la donation",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter une donation</DialogTitle>
          <DialogDescription>
            Enregistrer une nouvelle donation reçue
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div>
            <Label htmlFor="amount">Montant (DT) *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="100.00"
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
              Donation anonyme
            </Label>
          </div>

          {/* Donor Information (if not anonymous) */}
          {!formData.isAnonymous && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="donorName">Nom du donateur *</Label>
                <Input
                  id="donorName"
                  placeholder="Nom complet"
                  value={formData.donorName}
                  onChange={(e) => handleInputChange("donorName", e.target.value)}
                  required={!formData.isAnonymous}
                />
              </div>
              <div>
                <Label htmlFor="donorEmail">Email</Label>
                <Input
                  id="donorEmail"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.donorEmail}
                  onChange={(e) => handleInputChange("donorEmail", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="donorPhone">Téléphone</Label>
                <Input
                  id="donorPhone"
                  placeholder="+216 XX XXX XXX"
                  value={formData.donorPhone}
                  onChange={(e) => handleInputChange("donorPhone", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <Label htmlFor="message">Message (optionnel)</Label>
            <Textarea
              id="message"
              placeholder="Message du donateur..."
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              rows={3}
            />
          </div>

          {/* Payment Method */}
          <div>
            <Label htmlFor="paymentMethod">Méthode de paiement *</Label>
            <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange("paymentMethod", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une méthode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Espèces</SelectItem>
                <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                <SelectItem value="check">Chèque</SelectItem>
                <SelectItem value="card">Carte bancaire</SelectItem>
                <SelectItem value="mobile_payment">Paiement mobile</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Statut</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Confirmé</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DonationFormDialog;
