
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface MediaPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'photo' | 'article';
  data: {
    id: string;
    title: string;
    image_url?: string;
    featured_image?: string;
    content?: string;
    excerpt?: string;
    author?: string;
    created_at?: string;
    caption?: string;
  } | null;
}

const MediaPreviewModal = ({ open, onOpenChange, type, data }: MediaPreviewModalProps) => {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold pr-8">
            {data.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image */}
          {(data.image_url || data.featured_image) && (
            <div className="w-full">
              <img
                src={data.image_url || data.featured_image}
                alt={data.title}
                className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {data.created_at && (
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{format(new Date(data.created_at), 'dd MMMM yyyy', { locale: fr })}</span>
              </div>
            )}
            {data.author && (
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>Par {data.author}</span>
              </div>
            )}
          </div>

          {/* Content */}
          {type === 'article' && (
            <div className="prose max-w-none">
              {data.excerpt && (
                <div className="text-lg text-gray-700 mb-4 font-medium">
                  {data.excerpt}
                </div>
              )}
              {data.content && (
                <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {data.content}
                </div>
              )}
            </div>
          )}

          {/* Photo caption */}
          {type === 'photo' && data.caption && (
            <div className="text-gray-700 text-center p-4 bg-gray-50 rounded-lg">
              {data.caption}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaPreviewModal;
