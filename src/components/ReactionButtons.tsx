
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useReactions } from '@/hooks/useReactions';
import { cn } from '@/lib/utils';

interface ReactionButtonsProps {
  entityType: 'article' | 'player' | 'staff' | 'match';
  entityId: string;
  size?: 'sm' | 'default';
}

const ReactionButtons = ({ entityType, entityId, size = 'sm' }: ReactionButtonsProps) => {
  const { reactionCounts, userReaction, handleReaction, isLoading } = useReactions(entityType, entityId);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size={size}
        onClick={() => handleReaction('like')}
        disabled={isLoading}
        className={cn(
          "flex items-center gap-1",
          userReaction === 'like' && "bg-green-100 border-green-300 text-green-700"
        )}
      >
        <ThumbsUp size={size === 'sm' ? 14 : 16} />
        <span className="text-xs">{reactionCounts.likes_count}</span>
      </Button>
      
      <Button
        variant="outline"
        size={size}
        onClick={() => handleReaction('dislike')}
        disabled={isLoading}
        className={cn(
          "flex items-center gap-1",
          userReaction === 'dislike' && "bg-red-100 border-red-300 text-red-700"
        )}
      >
        <ThumbsDown size={size === 'sm' ? 14 : 16} />
        <span className="text-xs">{reactionCounts.dislikes_count}</span>
      </Button>
    </div>
  );
};

export default ReactionButtons;
