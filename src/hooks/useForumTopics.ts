
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DatabaseForumTopic {
  id: string;
  category_id: string | null;
  title: string;
  content: string | null;
  author_id: string | null;
  is_pinned: boolean | null;
  is_locked: boolean | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    name: string | null;
    avatar_url: string | null;
    user_type: string | null;
  } | null;
  reply_count?: number;
  last_activity?: string;
}

export const useForumTopics = (categoryId?: string) => {
  const [topics, setTopics] = useState<DatabaseForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTopics = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('forum_topics')
        .select(`
          *,
          profiles (
            name,
            avatar_url,
            user_type
          )
        `);

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query.order('is_pinned', { ascending: false })
                                       .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch reply counts and last activity for each topic
      const topicsWithCounts = await Promise.all(
        (data || []).map(async (topic) => {
          const [replyCountResult, lastActivityResult] = await Promise.all([
            supabase.rpc('get_topic_reply_count', { topic_id: topic.id }),
            supabase.rpc('get_topic_last_activity', { topic_id: topic.id })
          ]);

          return {
            ...topic,
            reply_count: replyCountResult.data || 0,
            last_activity: lastActivityResult.data || topic.updated_at
          };
        })
      );

      setTopics(topicsWithCounts);
    } catch (error: any) {
      console.error('Error fetching topics:', error);
      toast({
        title: "Error",
        description: "Failed to load forum topics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [categoryId]);

  return {
    topics,
    loading,
    refetch: fetchTopics
  };
};
