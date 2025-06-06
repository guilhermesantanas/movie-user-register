
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
    return (
      <div className="text-center p-4" role="status" aria-live="polite">
        <div className="inline-flex items-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" aria-hidden="true"></div>
          Loading comments...
        </div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground" role="status">
        No comments yet. Be the first to share your thoughts!
      </div>
    );
  }

  return (
    <section className="space-y-4" aria-label="Movie comments">
      <div className="sr-only" aria-live="polite">
        {comments.length} {comments.length === 1 ? 'comment' : 'comments'} loaded
      </div>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          user={user}
          isAdmin={isAdmin}
          onDeleteComment={onDeleteComment}
        />
      ))}
    </section>
  );
};

export default CommentsList;
