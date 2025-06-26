
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  match?: any;
}

const MatchDialog = ({ open, onOpenChange, match }: MatchDialogProps) => {
  const [formData, setFormData] = useState({
    opponent_team: '',
    match_date: '',
    venue: '',
    is_home: true,
    our_score: '',
    opponent_score: '',
    status: 'a_venir',
    notes: '',
    competition_id: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: competitions } = useQuery({
    queryKey: ['competitions-select'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('competitions')
        .select('id, name')
        .eq('active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    if (match) {
      setFormData({
        opponent_team: match.opponent_team || '',
        match_date: match.match_date ? new Date(match.match_date).toISOString().slice(0, 16) : '',
        venue: match.venue || '',
        is_home: match.is_home ?? true,
        our_score: match.our_score?.toString() || '',
        opponent_score: match.opponent_score?.toString() || '',
        status: match.status || 'a_venir',
        notes: match.notes || '',
        competition_id: match.competition_id || ''
      });
    } else {
      setFormData({
        opponent_team: '',
        match_date: '',
        venue: '',
        is_home: true,
        our_score: '',
        opponent_score: '',
        status: 'a_venir',
        notes: '',
        competition_id: ''
      });
    }
  }, [match]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        opponent_team: data.opponent_team,
        match_date: data.match_date,
        venue: data.venue || null,
        is_home: data.is_home,
        our_score: data.our_score ? parseInt(data.our_score) : null,
        opponent_score: data.opponent_score ? parseInt(data.opponent_score) : null,
        status: data.status,
        notes: data.notes || null,
        competition_id: data.competition_id || null
      };

      if (match) {
        const { error } = await supabase
          .from('matches')
          .update(payload)
          .eq('id', match.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('matches')
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches-admin'] });
      queryClient.invalidateQueries({ queryKey: ['nextMatch'] });
      toast({
        title: match ? "Match modifié" : "Match ajouté",
        description: match ? "Le match a été modifié avec succès." : "Le match a été ajouté avec succès.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le match.",
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
          <DialogTitle>{match ? 'Modifier le match' : 'Nouveau match'}</DialogTitle>
          <DialogDescription>
            {match ? 'Modifiez les informations du match' : 'Planifiez un nouveau match'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="opponent_team">Équipe adverse *</Label>
            <Input
              id="opponent_team"
              value={formData.opponent_team}
              onChange={(e) => setFormData({ ...formData, opponent_team: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="match_date">Date et heure *</Label>
            <Input
              id="match_date"
              type="datetime-local"
              value={formData.match_date}
              onChange={(e) => setFormData({ ...formData, match_date: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="competition_id">Compétition</Label>
            <Select value={formData.competition_id} onValueChange={(value) => setFormData({ ...formData, competition_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une compétition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucune compétition</SelectItem>
                {competitions?.map((competition) => (
                  <SelectItem key={competition.id} value={competition.id}>
                    {competition.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="venue">Lieu</Label>
            <Input
              id="venue"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              placeholder="Nom du stade ou lieu"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_home"
              checked={formData.is_home}
              onCheckedChange={(checked) => setFormData({ ...formData, is_home: checked })}
            />
            <Label htmlFor="is_home">Match à domicile</Label>
          </div>

          <div>
            <Label htmlFor="status">Statut</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a_venir">À venir</SelectItem>
                <SelectItem value="en_cours">En cours</SelectItem>
                <SelectItem value="termine">Terminé</SelectItem>
                <SelectItem value="reporte">Reporté</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="our_score">Notre score</Label>
              <Input
                id="our_score"
                type="number"
                value={formData.our_score}
                onChange={(e) => setFormData({ ...formData, our_score: e.target.value })}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="opponent_score">Score adverse</Label>
              <Input
                id="opponent_score"
                type="number"
                value={formData.opponent_score}
                onChange={(e) => setFormData({ ...formData, opponent_score: e.target.value })}
                min="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Notes sur le match"
            />
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

export default MatchDialog;
