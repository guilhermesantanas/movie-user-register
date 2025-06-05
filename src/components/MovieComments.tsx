
import React from 'react';
import { MessageSquare } from "lucide-react";
import { useComments } from "@/hooks/useComments";
import CommentForm from './CommentForm';
import CommentsList from './CommentsList';

interface MovieCommentsProps {
  movieId: string;
}

const MovieComments = ({ movieId }: MovieCommentsProps) => {
  const {
    comments,
    user,
    loading,
    isAdmin,
    addComment,
    deleteComment
  } = useComments(movieId);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <MessageSquare className="mr-2 h-5 w-5" />
        Comments ({comments.length})
      </h3>
      
      <CommentForm 
        user={user}
        isAdmin={isAdmin}
        onAddComment={addComment}
      />
      
      <CommentsList
        comments={comments}
        user={user}
        isAdmin={isAdmin}
        loading={loading}
        onDeleteComment={deleteComment}
      />
    </div>
  );
};

export default MovieComments;
