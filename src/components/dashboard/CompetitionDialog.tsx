
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CompetitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  competition?: any;
}

const CompetitionDialog = ({ open, onOpenChange, competition }: CompetitionDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    season: '',
    description: '',
    start_date: '',
    end_date: '',
    active: true
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (competition) {
      setFormData({
        name: competition.name || '',
        type: competition.type || '',
        season: competition.season || '',
        description: competition.description || '',
        start_date: competition.start_date || '',
        end_date: competition.end_date || '',
        active: competition.active ?? true
      });
    } else {
      setFormData({
        name: '',
        type: '',
        season: '',
        description: '',
        start_date: '',
        end_date: '',
        active: true
      });
    }
  }, [competition]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        name: data.name,
        type: data.type,
        season: data.season || null,
        description: data.description || null,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        active: data.active
      };

      if (competition) {
        const { error } = await supabase
          .from('competitions')
          .update(payload)
          .eq('id', competition.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('competitions')
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitions-admin'] });
      queryClient.invalidateQueries({ queryKey: ['competitions-select'] });
      toast({
        title: competition ? "Compétition modifiée" : "Compétition ajoutée",
        description: competition ? "La compétition a été modifiée avec succès." : "La compétition a été ajoutée avec succès.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la compétition.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{competition ? 'Modifier la compétition' : 'Nouvelle compétition'}</DialogTitle>
          <DialogDescription>
            {competition ? 'Modifiez les informations de la compétition' : 'Créez une nouvelle compétition'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="championnat">Championnat</SelectItem>
                <SelectItem value="coupe">Coupe</SelectItem>
                <SelectItem value="amical">Match amical</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="season">Saison</Label>
            <Input
              id="season"
              value={formData.season}
              onChange={(e) => setFormData({ ...formData, season: e.target.value })}
              placeholder="Ex: 2024-2025"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Date de début</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="end_date">Date de fin</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Description de la compétition"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
            />
            <Label htmlFor="active">Compétition active</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={saveMutation.isPending} className="bg-green-600 hover:bg-green-700">
              {saveMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompetitionDialog;
