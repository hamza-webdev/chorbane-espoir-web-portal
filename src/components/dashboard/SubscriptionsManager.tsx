
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Check, Star, Crown, Heart } from "lucide-react";

const SubscriptionsManager = () => {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const { toast } = useToast();

  const subscriptionPlans = [
    {
      id: "supporter",
      name: "Supporteur",
      price: "25€",
      period: "/mois",
      description: "Soutenez notre équipe",
      icon: Heart,
      color: "bg-green-500",
      features: [
        "Newsletter mensuelle",
        "Accès aux matchs à domicile",
        "Réduction 10% sur la boutique",
        "Certificat de supporteur"
      ]
    },
    {
      id: "premium",
      name: "Premium",
      price: "50€",
      period: "/mois",
      description: "Pour les vrais passionnés",
      icon: Star,
      color: "bg-blue-500",
      features: [
        "Tous les avantages Supporteur",
        "Accès VIP aux matchs",
        "Rencontre avec les joueurs",
        "Réduction 20% sur la boutique",
        "Invitation aux événements exclusifs"
      ]
    },
    {
      id: "vip",
      name: "VIP",
      price: "100€",
      period: "/mois",
      description: "L'expérience ultime",
      icon: Crown,
      color: "bg-yellow-500",
      features: [
        "Tous les avantages Premium",
        "Places VIP pour tous les matchs",
        "Accès au vestiaire après match",
        "Dîner avec l'équipe technique",
        "Maillot dédicacé personnalisé",
        "Participation aux décisions du club"
      ]
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlan) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un plan d'abonnement",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.email) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    // Simulate subscription process
    toast({
      title: "Abonnement en cours de traitement",
      description: "Nous vous contacterons bientôt pour finaliser votre abonnement",
    });

    // Reset form
    setFormData({ name: "", email: "", phone: "", message: "" });
    setSelectedPlan("");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Abonnements Supporteurs</h2>
          <p className="text-gray-600">Choisissez votre formule d'abonnement et soutenez notre club</p>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => {
          const Icon = plan.icon;
          const isSelected = selectedPlan === plan.id;
          
          return (
            <Card 
              key={plan.id} 
              className={`cursor-pointer transition-all duration-200 ${
                isSelected ? 'ring-2 ring-green-500 shadow-lg' : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <CardHeader className="text-center">
                <div className={`w-16 h-16 rounded-full ${plan.color} flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="flex items-center justify-center mt-4">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 ml-1">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                {isSelected && (
                  <Badge className="w-full mt-4 bg-green-500 hover:bg-green-600">
                    Plan sélectionné
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Subscription Form */}
      <Card>
        <CardHeader>
          <CardTitle>Formulaire d'inscription</CardTitle>
          <CardDescription>
            Remplissez ce formulaire pour souscrire à votre abonnement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Votre nom complet"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Votre numéro de téléphone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan">Plan sélectionné</Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisissez votre plan" />
                </SelectTrigger>
                <SelectContent>
                  {subscriptionPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} - {plan.price}{plan.period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message (optionnel)</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Un message pour nous..."
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Souscrire à l'abonnement
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionsManager;
