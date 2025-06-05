
import React from 'react';
import CommentItem from './CommentItem';

interface Comment {
  id: string;
  movie_id: string;
  user_id: string | null;
  user_name: string;
  content: string;
  created_at: string;
  avatar_url?: string | null;
}

interface CommentsListProps {
  comments: Comment[];
  user: any;
  isAdmin: boolean;
  loading: boolean;
  onDeleteComment: (commentId: string, commentUserId: string | null) => void;
}

const CommentsList = ({ comments, user, isAdmin, loading, onDeleteComment }: CommentsListProps) => {
  if (loading) {
    return <div className="text-center p-4">Loading comments...</div>;
  }

  if (comments.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No comments yet. Be the first to share your thoughts!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          user={user}
          isAdmin={isAdmin}
          onDeleteComment={onDeleteComment}
        />
      ))}
    </div>
  );
};

export default CommentsList;
