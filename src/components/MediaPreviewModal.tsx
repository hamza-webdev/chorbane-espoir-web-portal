
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
      <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full sm:max-w-[95vw] sm:max-h-[90vh] sm:h-auto overflow-y-auto sm:rounded-lg">
        <div className="flex flex-col h-full">
          <DialogHeader className="p-3 sm:p-6 pb-2 sm:pb-4 border-b flex-shrink-0">
            <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold pr-8 leading-tight">
              {data.title}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <div className="p-3 sm:p-6 space-y-4">
              {/* Image */}
              {(data.image_url || data.featured_image) && (
                <div className="w-full">
                  <img
                    src={data.image_url || data.featured_image}
                    alt={data.title}
                    className="w-full h-auto max-h-[50vh] sm:max-h-[60vh] object-contain rounded-lg bg-gray-100"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap gap-3 sm:gap-4 text-sm text-gray-600">
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
                <div className="prose prose-sm sm:prose max-w-none">
                  {data.excerpt && (
                    <div className="text-base sm:text-lg text-gray-700 mb-4 font-medium leading-relaxed">
                      {data.excerpt}
                    </div>
                  )}
                  {data.content && (
                    <div className="text-gray-800 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                      {data.content}
                    </div>
                  )}
                </div>
              )}

              {/* Photo caption */}
              {type === 'photo' && data.caption && (
                <div className="text-gray-700 text-center p-4 bg-gray-50 rounded-lg text-sm sm:text-base leading-relaxed">
                  {data.caption}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaPreviewModal;
