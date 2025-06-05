
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  movie_id: string;
  user_id: string | null;
  user_name: string;
  content: string;
  created_at: string;
  avatar_url?: string | null;
}

interface CommentItemProps {
  comment: Comment;
  user: any;
  isAdmin: boolean;
  onDeleteComment: (commentId: string, commentUserId: string | null) => void;
}

const CommentItem = ({ comment, user, isAdmin, onDeleteComment }: CommentItemProps) => {
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };
  
  // Get a consistent color based on the username
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 
      'bg-yellow-500', 'bg-purple-500', 'bg-indigo-500',
      'bg-pink-500', 'bg-teal-500'
    ];
    
    // Simple hash function to determine color
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="p-4 border rounded-md bg-card">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <Avatar className={comment.avatar_url ? '' : getAvatarColor(comment.user_name)}>
            {comment.avatar_url ? (
              <AvatarImage src={comment.avatar_url} alt={comment.user_name} />
            ) : null}
            <AvatarFallback>{getInitials(comment.user_name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <p className="font-medium">{comment.user_name}</p>
              {comment.user_id === user?.id && isAdmin && (
                <span className="text-[#FEF7CD] text-xs flex items-center">
                  <Shield size={12} className="mr-1" />
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        
        {user && (isAdmin || user.id === comment.user_id) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteComment(comment.id, comment.user_id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 size={16} />
          </Button>
        )}
      </div>
      
      <p className="mt-3 text-sm whitespace-pre-line">{comment.content}</p>
    </div>
  );
};

export default CommentItem;
