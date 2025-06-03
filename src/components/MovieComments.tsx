
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, MessageSquare, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { toast } from 'sonner';

interface Comment {
  id: string;
  movie_id: string;
  user_id: string | null;
  user_name: string;
  content: string;
  created_at: string;
  avatar_url?: string | null;
}

interface MovieCommentsProps {
  movieId: string;
}

const MovieComments = ({ movieId }: MovieCommentsProps) => {
  const { toast: uiToast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  // Setup user information from Supabase
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          setUser(session.user);
          setUserName(profileData?.name || session.user.email || 'User');
          setUserAvatar(profileData?.avatar_url || null);
          setIsAdmin(profileData?.user_type === 'admin');
        }
      } catch (error) {
        toast.error('Error loading user information');
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        // First, fetch all comments for the movie
        const { data: commentsData, error: commentsError } = await supabase
          .from('movie_comments')
          .select('*')
          .eq('movie_id', movieId)
          .order('created_at', { ascending: false });
          
        if (commentsError) throw commentsError;
        
        // Then, for each comment with a user_id, fetch the profile to get the avatar_url
        const commentsWithAvatars = await Promise.all(
          (commentsData || []).map(async (comment) => {
            if (comment.user_id) {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('avatar_url')
                .eq('id', comment.user_id)
                .maybeSingle();
                
              return {
                ...comment,
                avatar_url: profileData?.avatar_url || null
              };
            }
            return comment;
          })
        );
        
        setComments(commentsWithAvatars || []);
      } catch (error) {
        uiToast({
          title: "Error",
          description: "Failed to load comments",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
    
    // Set up realtime subscription for comments
    const commentsSubscription = supabase
      .channel('movie_comments_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'movie_comments',
          filter: `movie_id=eq.${movieId}`
        }, 
        () => {
          fetchComments();
        }
      )
      .subscribe();
      
    return () => {
      commentsSubscription.unsubscribe();
    };
  }, [movieId, uiToast]);

  const handleAddComment = async () => {
    if (!user) {
      toast("Please log in to add a comment");
      return;
    }

    if (!newComment.trim()) {
      toast("Please enter some text for your comment");
      return;
    }

    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('movie_comments')
        .insert([{
          movie_id: movieId,
          user_id: user.id,
          user_name: userName,
          content: newComment.trim()
        }]);
        
      if (error) throw error;
      
      toast("Your comment has been posted");
      setNewComment('');
    } catch (error: any) {
      toast("Failed to post comment: " + (error.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string, commentUserId: string | null) => {
    if (!user) return;
    
    // Check if user is the comment author or an admin
    const canDelete = isAdmin || user.id === commentUserId;
    
    if (!canDelete) {
      toast("You can only delete your own comments");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('movie_comments')
        .delete()
        .eq('id', commentId);
        
      if (error) throw error;
      
      toast("Comment has been removed");
      
      // Update the local state
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error: any) {
      toast("Failed to delete comment: " + (error.message || "Unknown error"));
    }
  };

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
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <MessageSquare className="mr-2 h-5 w-5" />
        Comments ({comments.length})
      </h3>
      
      {user && (
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
      )}
      
      {!user && (
        <div className="mb-6 p-4 border rounded-md bg-muted">
          <p className="text-center">Please log in to add comments</p>
        </div>
      )}
      
      {loading ? (
        <div className="text-center p-4">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center p-4 text-muted-foreground">
          No comments yet. Be the first to share your thoughts!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div 
              key={comment.id} 
              className="p-4 border rounded-md bg-card"
            >
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
                    onClick={() => handleDeleteComment(comment.id, comment.user_id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
              
              <p className="mt-3 text-sm whitespace-pre-line">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieComments;
