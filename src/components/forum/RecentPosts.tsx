
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RecentPost {
  id: number;
  content: string;
  author: string;
  avatar_url?: string;
  topic: string;
  timestamp: string;
}

interface RecentPostsProps {
  posts: RecentPost[];
}

const RecentPosts = ({ posts }: RecentPostsProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md">Posts Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-60 pr-4">
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="p-3">
                <div className="flex items-start space-x-3 mb-2">
                  <Avatar>
                    {post.avatar_url ? (
                      <AvatarImage src={post.avatar_url} alt={post.author} />
                    ) : (
                      <AvatarFallback>{getInitials(post.author)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{post.author}</p>
                    <p className="text-xs text-muted-foreground">Em: {post.topic}</p>
                  </div>
                  <p className="text-xs text-muted-foreground ml-auto">
                    {new Date(post.timestamp).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <p className="text-sm line-clamp-2">{post.content}</p>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentPosts;
