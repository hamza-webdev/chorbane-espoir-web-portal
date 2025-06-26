
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ReactionCounts {
  likes_count: number;
  dislikes_count: number;
}

interface UserReaction {
  reaction_type: 'like' | 'dislike' | null;
  expires_at: string | null;
}

const getUserIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return 'unknown';
  }
};

export const useReactions = (entityType: 'article' | 'player' | 'staff' | 'match', entityId: string) => {
  const [userIP, setUserIP] = useState<string>('');
  const { toast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  useEffect(() => {
    getUserIP().then(setUserIP);
  }, []);

  // Récupérer les compteurs de réactions
  const { data: reactionCounts } = useQuery({
    queryKey: ['reactionCounts', entityType, entityId],
    queryFn: async (): Promise<ReactionCounts> => {
      const { data, error } = await supabase
        .from('reaction_counts')
        .select('likes_count, dislikes_count')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data || { likes_count: 0, dislikes_count: 0 };
    }
  });

  // Récupérer la réaction de l'utilisateur actuel
  const { data: userReaction } = useQuery({
    queryKey: ['userReaction', entityType, entityId, userIP],
    queryFn: async (): Promise<UserReaction> => {
      if (!userIP) return { reaction_type: null, expires_at: null };
      
      const { data, error } = await supabase
        .from('user_reactions')
        .select('reaction_type, expires_at')
        .eq('user_ip', userIP)
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .gt('expires_at', new Date().toISOString())
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      // Type assertion pour assurer que reaction_type est du bon type
      return data ? {
        reaction_type: data.reaction_type as 'like' | 'dislike',
        expires_at: data.expires_at
      } : { reaction_type: null, expires_at: null };
    },
    enabled: !!userIP
  });

  const reactionMutation = useMutation({
    mutationFn: async (reactionType: 'like' | 'dislike') => {
      if (!userIP) throw new Error('IP address not available');

      const { error } = await supabase
        .from('user_reactions')
        .upsert({
          user_ip: userIP,
          entity_type: entityType,
          entity_id: entityId,
          reaction_type: reactionType,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }, {
          onConflict: 'user_ip,entity_type,entity_id'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reactionCounts', entityType, entityId] });
      queryClient.invalidateQueries({ queryKey: ['userReaction', entityType, entityId, userIP] });
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: t('reactions.error'),
        variant: "destructive",
      });
    }
  });

  const handleReaction = (reactionType: 'like' | 'dislike') => {
    if (userReaction?.reaction_type && userReaction.expires_at) {
      const expiresAt = new Date(userReaction.expires_at);
      const now = new Date();
      if (expiresAt > now) {
        toast({
          title: t('reactions.already_reacted'),
          description: t('reactions.wait_24h'),
          variant: "default",
        });
        return;
      }
    }

    reactionMutation.mutate(reactionType);
  };

  return {
    reactionCounts: reactionCounts || { likes_count: 0, dislikes_count: 0 },
    userReaction: userReaction?.reaction_type || null,
    handleReaction,
    isLoading: reactionMutation.isPending
  };
};
