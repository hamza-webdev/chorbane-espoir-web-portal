
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
import PhotoUpload from "@/components/ui/photo-upload";

interface PlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player?: any;
}

const PlayerDialog = ({ open, onOpenChange, player }: PlayerDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    jersey_number: '',
    position: '',
    age: '',
    height: '',
    weight: '',
    photo: '',
    bio: '',
    joined_date: '',
    active: true
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name || '',
        jersey_number: player.jersey_number?.toString() || '',
        position: player.position || '',
        age: player.age?.toString() || '',
        height: player.height?.toString() || '',
        weight: player.weight?.toString() || '',
        photo: player.photo || '',
        bio: player.bio || '',
        joined_date: player.joined_date || '',
        active: player.active ?? true
      });
    } else {
      setFormData({
        name: '',
        jersey_number: '',
        position: '',
        age: '',
        height: '',
        weight: '',
        photo: '',
        bio: '',
        joined_date: '',
        active: true
      });
    }
  }, [player]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        name: data.name,
        jersey_number: data.jersey_number ? parseInt(data.jersey_number) : null,
        position: data.position,
        age: data.age ? parseInt(data.age) : null,
        height: data.height ? parseInt(data.height) : null,
        weight: data.weight ? parseInt(data.weight) : null,
        photo: data.photo || null,
        bio: data.bio || null,
        joined_date: data.joined_date || null,
        active: data.active
      };

      if (player) {
        const { error } = await supabase
          .from('players')
          .update(payload)
          .eq('id', player.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('players')
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players-admin'] });
      toast({
        title: player ? "Joueur modifié" : "Joueur ajouté",
        description: player ? "Le joueur a été modifié avec succès." : "Le joueur a été ajouté avec succès.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le joueur.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handlePhotoChange = (photoUrl: string) => {
    setFormData({ ...formData, photo: photoUrl });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{player ? 'Modifier le joueur' : 'Nouveau joueur'}</DialogTitle>
          <DialogDescription>
            {player ? 'Modifiez les informations du joueur' : 'Ajoutez un nouveau joueur à l\'équipe'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="jersey_number">Numéro de maillot</Label>
              <Input
                id="jersey_number"
                type="number"
                value={formData.jersey_number}
                onChange={(e) => setFormData({ ...formData, jersey_number: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="position">Position *</Label>
            <Select value={formData.position} onValueChange={(value) => setFormData({ ...formData, position: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gardien">Gardien</SelectItem>
                <SelectItem value="defenseur">Défenseur</SelectItem>
                <SelectItem value="milieu">Milieu</SelectItem>
                <SelectItem value="attaquant">Attaquant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="age">Âge</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="height">Taille (cm)</Label>
              <Input
                id="height"
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="weight">Poids (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="joined_date">Date d'arrivée</Label>
            <Input
              id="joined_date"
              type="date"
              value={formData.joined_date}
              onChange={(e) => setFormData({ ...formData, joined_date: e.target.value })}
            />
          </div>

          <PhotoUpload
            currentPhoto={formData.photo}
            onPhotoChange={handlePhotoChange}
            label="Photo du joueur"
            folder="players"
          />

          <div>
            <Label htmlFor="bio">Biographie</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              placeholder="Biographie du joueur"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
            />
            <Label htmlFor="active">Joueur actif</Label>
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

export default PlayerDialog;
