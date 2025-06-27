
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

interface StaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff?: any;
}

const StaffDialog = ({ open, onOpenChange, staff }: StaffDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    photo: '',
    bio: '',
    joined_date: '',
    active: true
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name || '',
        role: staff.role || '',
        email: staff.email || '',
        phone: staff.phone || '',
        photo: staff.photo || '',
        bio: staff.bio || '',
        joined_date: staff.joined_date || '',
        active: staff.active ?? true
      });
    } else {
      setFormData({
        name: '',
        role: '',
        email: '',
        phone: '',
        photo: '',
        bio: '',
        joined_date: '',
        active: true
      });
    }
  }, [staff]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        name: data.name,
        role: data.role,
        email: data.email || null,
        phone: data.phone || null,
        photo: data.photo || null,
        bio: data.bio || null,
        joined_date: data.joined_date || null,
        active: data.active
      };

      if (staff) {
        const { error } = await supabase
          .from('staff')
          .update(payload)
          .eq('id', staff.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('staff')
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-admin'] });
      toast({
        title: staff ? "Membre modifié" : "Membre ajouté",
        description: staff ? "Le membre du staff a été modifié avec succès." : "Le membre du staff a été ajouté avec succès.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le membre du staff.",
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
          <DialogTitle>{staff ? 'Modifier le membre du staff' : 'Nouveau membre du staff'}</DialogTitle>
          <DialogDescription>
            {staff ? 'Modifiez les informations du membre' : 'Ajoutez un nouveau membre au staff'}
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
            <Label htmlFor="role">Rôle *</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="president">President</SelectItem>
                <SelectItem value="entraineur">Entraîneur</SelectItem>
                <SelectItem value="administration">Administration</SelectItem>                
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
            label="Photo du membre"
            folder="staff"
          />

          <div>
            <Label htmlFor="bio">Biographie</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              placeholder="Biographie du membre du staff"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
            />
            <Label htmlFor="active">Membre actif</Label>
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

export default StaffDialog;
