
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Shield } from "lucide-react";

interface CommentFormProps {
  user: any;
  isAdmin: boolean;
  onAddComment: (content: string) => Promise<boolean>;
}

const CommentForm = ({ user, isAdmin, onAddComment }: CommentFormProps) => {
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddComment = async () => {
    setSubmitting(true);
    const success = await onAddComment(newComment);
    if (success) {
      setNewComment('');
    }
    setSubmitting(false);
  };

  if (!user) {
    return (
      <div className="mb-6 p-4 border rounded-md bg-muted">
        <p className="text-center">Please log in to add comments</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <Textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Share your thoughts about this movie..."
        className="mb-2 resize-none"
        rows={3}
      />
      <div className="flex items-center gap-2">
        <Button 
          onClick={handleAddComment}
          disabled={submitting || !newComment.trim()}
        >
          Post Comment
        </Button>
        
        {isAdmin && (
          <div className="flex items-center text-[#FEF7CD] text-sm ml-2">
            <Shield size={14} className="mr-1" />
            <span>Admin</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentForm;
