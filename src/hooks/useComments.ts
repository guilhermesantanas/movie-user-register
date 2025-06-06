
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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

export const useComments = (movieId: string) => {
  const { toast: uiToast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  // Memoize user status check to prevent unnecessary re-renders
  const checkUserStatus = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (!profileError && profileData) {
          setUser(session.user);
          setUserName(profileData.name || session.user.email || 'User');
          setUserAvatar(profileData.avatar_url || null);
          setIsAdmin(profileData.user_type === 'admin');
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        setUserName('');
        setUserAvatar(null);
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      toast.error('Error loading user information');
    }
  }, []);

  // Setup user information from Supabase
  useEffect(() => {
    checkUserStatus().finally(() => setLoading(false));
  }, [checkUserStatus]);

  // Memoize comment fetching function
  const fetchComments = useCallback(async () => {
    if (!movieId) return;
    
    try {
      setLoading(true);
      
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
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      uiToast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [movieId, uiToast]);

  // Fetch comments
  useEffect(() => {
    fetchComments();
    
    // Set up realtime subscription for comments
    const commentsSubscription = supabase
      .channel(`movie_comments_${movieId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'movie_comments',
          filter: `movie_id=eq.${movieId}`
        }, 
        (payload) => {
          console.log('Comment change detected:', payload);
          fetchComments();
        }
      )
      .subscribe();
      
    return () => {
      commentsSubscription.unsubscribe();
    };
  }, [fetchComments]);

  const addComment = useCallback(async (content: string) => {
    if (!user) {
      toast("Please log in to add a comment");
      return false;
    }

    if (!content.trim()) {
      toast("Please enter some text for your comment");
      return false;
    }

    try {
      const { error } = await supabase
        .from('movie_comments')
        .insert([{
          movie_id: movieId,
          user_id: user.id,
          user_name: userName,
          content: content.trim()
        }]);
        
      if (error) throw error;
      
      toast("Your comment has been posted");
      return true;
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast("Failed to post comment: " + (error.message || "Unknown error"));
      return false;
    }
  }, [user, movieId, userName]);

  const deleteComment = useCallback(async (commentId: string, commentUserId: string | null) => {
    if (!user) return false;
    
    // Check if user is the comment author or an admin
    const canDelete = isAdmin || user.id === commentUserId;
    
    if (!canDelete) {
      toast("You can only delete your own comments");
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('movie_comments')
        .delete()
        .eq('id', commentId);
        
      if (error) throw error;
      
      toast("Comment has been removed");
      
      // Update the local state optimistically
      setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
      return true;
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      toast("Failed to delete comment: " + (error.message || "Unknown error"));
      // Refresh comments to ensure consistency
      fetchComments();
      return false;
    }
  }, [user, isAdmin, fetchComments]);

  // Memoize return value to prevent unnecessary re-renders
  return useMemo(() => ({
    comments,
    user,
    loading,
    isAdmin,
    userName,
    userAvatar,
    addComment,
    deleteComment
  }), [comments, user, loading, isAdmin, userName, userAvatar, addComment, deleteComment]);
};
