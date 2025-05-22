
import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Pin, Shield, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { ForumTopic } from '@/types/forum';

interface ForumCategoryProps {
  title: string;
  description: string;
  topics: ForumTopic[];
  formatDate: (dateString: string) => string;
  onTopicClick: (topic: ForumTopic) => void;
}

const ForumCategory = ({ 
  title, 
  description, 
  topics, 
  formatDate, 
  onTopicClick 
}: ForumCategoryProps) => {
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };
  
  const getAvatarColor = (name: string, type: 'user' | 'moderator' | 'admin') => {
    if (type === 'admin') return 'bg-red-500';
    if (type === 'moderator') return 'bg-purple-500';
    
    const colors = [
      'bg-blue-500', 'bg-green-500', 
      'bg-yellow-500', 'bg-indigo-500',
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
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      
      <div className="grid gap-4">
        {topics.map((topic) => (
          <Card 
            key={topic.id}
            className={`transition-all hover:border-primary/20 hover:shadow-md cursor-pointer ${
              topic.isRules ? 'border-primary/30 bg-primary/5' : 
              topic.authorType === 'admin' ? 'border-red-200 bg-red-50/30' : ''
            }`}
            onClick={() => onTopicClick(topic)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">
                    {topic.title}
                  </CardTitle>
                  
                  {topic.isPinned && (
                    <Badge variant="secondary">
                      <Pin size={12} className="mr-1" />
                      Fixado
                    </Badge>
                  )}
                  
                  {topic.isRules && (
                    <Badge variant="default" className="ml-2">
                      Regras
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Avatar className={topic.avatar_url ? '' : getAvatarColor(topic.author, topic.authorType)}>
                    {topic.avatar_url ? (
                      <AvatarImage src={topic.avatar_url} alt={topic.author} />
                    ) : null}
                    <AvatarFallback>{getInitials(topic.author)}</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center">
                    {topic.authorType === 'admin' ? (
                      <Badge variant="default" className="flex items-center gap-1">
                        <Shield size={12} />
                        Admin
                      </Badge>
                    ) : topic.authorType === 'moderator' ? (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Shield size={12} />
                        Moderador
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <User size={12} />
                        Usuário
                      </Badge>
                    )}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {topic.author}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MessageSquare size={14} />
                    {topic.replies} respostas
                  </span>
                  <span>
                    Atualizado em {formatDate(topic.lastActivity)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ForumCategory;
