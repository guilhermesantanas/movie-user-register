
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DatabaseForumReply {
  id: string;
  topic_id: string | null;
  author_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    name: string | null;
    avatar_url: string | null;
    user_type: string | null;
  } | null;
}

export const useForumReplies = (topicId: string) => {
  const [replies, setReplies] = useState<DatabaseForumReply[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReplies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('forum_replies')
        .select(`
          *,
          profiles:author_id (
            name,
            avatar_url,
            user_type
          )
        `)
        .eq('topic_id', topicId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setReplies(data || []);
    } catch (error: any) {
      console.error('Error fetching replies:', error);
      toast({
        title: "Error",
        description: "Failed to load forum replies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addReply = async (content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to post replies",
          variant: "destructive",
        });
        return false;
      }

      const { error } = await supabase
        .from('forum_replies')
        .insert([
          {
            topic_id: topicId,
            author_id: user.id,
            content: content.trim()
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your reply has been posted",
      });

      await fetchReplies();
      return true;
    } catch (error: any) {
      console.error('Error adding reply:', error);
      toast({
        title: "Error",
        description: "Failed to post reply",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (topicId) {
      fetchReplies();
    }
  }, [topicId]);

  return {
    replies,
    loading,
    addReply,
    refetch: fetchReplies
  };
};
