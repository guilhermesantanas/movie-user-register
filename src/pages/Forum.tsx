
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Pin, Shield, User } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Add avatar_url field to the ForumTopic interface
interface ForumTopic {
  id: number;
  title: string;
  author: string;
  authorType: 'user' | 'moderator' | 'admin';
  replies: number;
  lastActivity: string;
  isPinned: boolean;
  avatar_url?: string;
}

const ForumTopics: ForumTopic[] = [
  {
    id: 1,
    title: 'Discussão sobre os novos lançamentos de 2024',
    author: 'Maria Silva',
    authorType: 'user',
    replies: 24,
    lastActivity: '2024-05-15T14:30:00',
    isPinned: true,
    avatar_url: 'https://i.pravatar.cc/150?u=maria'
  },
  {
    id: 2,
    title: 'Oscar 2024 - Previsões e comentários',
    author: 'João Costa',
    authorType: 'moderator',
    replies: 16,
    lastActivity: '2024-05-16T09:45:00',
    isPinned: false,
    avatar_url: 'https://i.pravatar.cc/150?u=joao'
  },
  {
    id: 3,
    title: 'Recomendações de filmes de suspense',
    author: 'Carlos Oliveira',
    authorType: 'admin',
    replies: 32,
    lastActivity: '2024-05-17T18:20:00',
    isPinned: false,
    avatar_url: 'https://i.pravatar.cc/150?u=carlos'
  },
  {
    id: 4,
    title: 'Qual o melhor filme de todos os tempos?',
    author: 'Ana Santos',
    authorType: 'user',
    replies: 47,
    lastActivity: '2024-05-18T11:10:00',
    isPinned: false,
    avatar_url: 'https://i.pravatar.cc/150?u=ana'
  }
];

const Forum = () => {
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  const filteredTopics = searchQuery
    ? ForumTopics.filter(topic => 
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : ForumTopics;
    
  // Ordenar tópicos com pinados primeiro
  const sortedTopics = [...filteredTopics].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
  });
  
  return (
    <motion.div 
      className="container mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MessageSquare className="text-primary" />
            Fórum de Discussões
          </h1>
          <p className="text-muted-foreground mt-1">
            Participe das discussões sobre seus filmes favoritos
          </p>
        </div>
        
        <div className="w-full md:w-auto flex gap-2">
          <Input
            placeholder="Pesquisar tópicos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64"
          />
          <Button>
            Novo Tópico
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4">
        {sortedTopics.length > 0 ? (
          sortedTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} formatDate={formatDate} />
          ))
        ) : (
          <Card className="py-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">Nenhum tópico encontrado</h3>
              <p className="text-muted-foreground mt-2">
                {searchQuery ? 'Tente outra pesquisa' : 'Seja o primeiro a criar um tópico!'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
};

interface TopicCardProps {
  topic: ForumTopic;
  formatDate: (dateString: string) => string;
}

const TopicCard = ({ topic, formatDate }: TopicCardProps) => {
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
    <Card className="transition-all hover:border-primary/20 hover:shadow-md">
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
  );
};

export default Forum;
