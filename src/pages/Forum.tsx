import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Pin, Shield, User, Info } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useForumCategories } from '@/hooks/useForumCategories';
import { useForumTopics, DatabaseForumTopic } from '@/hooks/useForumTopics';
import { useForumReplies } from '@/hooks/useForumReplies';
import ForumCategoryComponent from '@/components/forum/ForumCategory';
import OnlineUsers from '@/components/forum/OnlineUsers';
import RecentPosts from '@/components/forum/RecentPosts';

// Forum categories and topics data
const onlineUsers = [
  { id: 1, name: 'Administrador', userType: 'admin' as const, avatar_url: 'https://i.pravatar.cc/150?u=admin', lastActive: new Date().toISOString() },
  { id: 2, name: 'João Costa', userType: 'moderator' as const, avatar_url: 'https://i.pravatar.cc/150?u=joao', lastActive: new Date().toISOString() },
  { id: 3, name: 'Maria Silva', userType: 'user' as const, avatar_url: 'https://i.pravatar.cc/150?u=maria', lastActive: new Date().toISOString() },
  { id: 4, name: 'Carlos Oliveira', userType: 'user' as const, avatar_url: 'https://i.pravatar.cc/150?u=carlos', lastActive: new Date().toISOString() },
  { id: 5, name: 'Ana Souza', userType: 'user' as const, avatar_url: 'https://i.pravatar.cc/150?u=ana', lastActive: new Date().toISOString() },
  { id: 6, name: 'Lucas Mendes', userType: 'moderator' as const, avatar_url: 'https://i.pravatar.cc/150?u=lucas', lastActive: new Date().toISOString() },
  { id: 7, name: 'Fernanda Lima', userType: 'user' as const, avatar_url: 'https://i.pravatar.cc/150?u=fernanda', lastActive: new Date().toISOString() },
  { id: 8, name: 'Paulo Ramos', userType: 'user' as const, avatar_url: 'https://i.pravatar.cc/150?u=paulo', lastActive: new Date().toISOString() },
];

const recentPosts = [
  {
    id: 1, 
    content: 'Acho que o trabalho dele em "Ilha do Medo" é subestimado. A forma como ele constrói tensão é incrível!', 
    author: 'Lucas Mendes', 
    avatar_url: 'https://i.pravatar.cc/150?u=lucas',
    topic: 'Martin Scorsese - Retrospectiva',
    timestamp: '2024-05-22T09:15:00'
  },
  {
    id: 2,
    content: 'Wagner Moura realmente mostrou versatilidade ao interpretar personagens tão diferentes como Capitão Nascimento e Pablo Escobar.',
    author: 'Ana Souza',
    avatar_url: 'https://i.pravatar.cc/150?u=ana',
    topic: 'Wagner Moura - De Tropa de Elite a Hollywood',
    timestamp: '2024-05-22T08:30:00'
  },
  {
    id: 3,
    content: 'Kleber Mendonça Filho e Juliano Dornelles merecem mais reconhecimento internacional. "Bacurau" é uma obra-prima.',
    author: 'Maria Silva',
    avatar_url: 'https://i.pravatar.cc/150?u=maria',
    topic: 'Diretores brasileiros contemporâneos',
    timestamp: '2024-05-21T22:45:00'
  },
  {
    id: 4,
    content: 'O uso de som em "Oppenheimer" é uma aula de como construir tensão sem depender de efeitos visuais.',
    author: 'Paulo Ramos',
    avatar_url: 'https://i.pravatar.cc/150?u=paulo',
    topic: 'Christopher Nolan - Técnicas de filmagem',
    timestamp: '2024-05-21T18:20:00'
  },
  {
    id: 5,
    content: 'Os filmes de terror psicológico brasileiros estão ganhando força, mas ainda precisamos de mais investimento no gênero.',
    author: 'Carlos Oliveira',
    avatar_url: 'https://i.pravatar.cc/150?u=carlos',
    topic: 'O renascimento do Terror psicológico',
    timestamp: '2024-05-21T14:05:00'
  }
];

const Forum = () => {
  const { profile, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<DatabaseForumTopic | null>(null);
  const [newReply, setNewReply] = useState('');
  
  const { categories, loading: categoriesLoading } = useForumCategories();
  const { topics, loading: topicsLoading } = useForumTopics();
  const { replies, loading: repliesLoading, addReply } = useForumReplies(selectedTopic?.id || '');
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  // Transform database categories and topics to match the existing interface
  const transformedCategories = categories.map(category => {
    const categoryTopics = topics
      .filter(topic => topic.category_id === category.id)
      .map(topic => ({
        id: parseInt(topic.id, 16) || Math.random(), // Convert UUID to number for compatibility
        title: topic.title,
        author: topic.profiles?.name || 'Usuário Anônimo',
        authorType: (topic.profiles?.user_type || 'user') as 'user' | 'moderator' | 'admin',
        replies: topic.reply_count || 0,
        lastActivity: topic.last_activity || topic.updated_at,
        isPinned: topic.is_pinned || false,
        isRules: topic.title.toLowerCase().includes('regras'),
        avatar_url: topic.profiles?.avatar_url || undefined,
        category: category.name
      }));

    return {
      id: category.id,
      name: category.name,
      description: category.description || '',
      topics: categoryTopics
    };
  });
  
  // Filter topics based on search query
  const filteredCategories = searchQuery
    ? transformedCategories.map(category => ({
        ...category,
        topics: category.topics.filter(topic => 
          topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.author.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.topics.length > 0)
    : transformedCategories;
    
  const handleTopicClick = (topic: any) => {
    // Find the corresponding database topic
    const dbTopic = topics.find(t => t.title === topic.title);
    if (dbTopic) {
      setSelectedTopic(dbTopic);
    }
  };

  const handleBack = () => {
    setSelectedTopic(null);
    setNewReply('');
  };
  
  const handleReplySubmit = async () => {
    if (!newReply.trim()) return;
    
    const success = await addReply(newReply);
    if (success) {
      setNewReply('');
    }
  };
  
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
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };
  
  if (selectedTopic) {
    const authorName = selectedTopic.profiles?.name || 'Usuário Anônimo';
    const authorType = (selectedTopic.profiles?.user_type || 'user') as 'user' | 'moderator' | 'admin';
    const isRulesPost = selectedTopic.title.toLowerCase().includes('regras');
    
    return (
      <motion.div 
        className="container mx-auto px-4 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Button variant="ghost" onClick={handleBack} className="mb-4 flex items-center gap-2">
          <span>← Voltar para tópicos</span>
        </Button>
        
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-wrap gap-2 justify-between items-start">
              <div className="flex-grow">
                <CardTitle className="text-2xl flex items-center gap-2">
                  {selectedTopic.is_pinned && <Pin size={16} className="text-primary" />}
                  {selectedTopic.title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Avatar className={selectedTopic.profiles?.avatar_url ? '' : getAvatarColor(authorName, authorType)}>
                    {selectedTopic.profiles?.avatar_url ? (
                      <AvatarImage src={selectedTopic.profiles.avatar_url} alt={authorName} />
                    ) : null}
                    <AvatarFallback>{getInitials(authorName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      {authorType === 'admin' ? (
                        <Badge variant="default" className="flex items-center gap-1">
                          <Shield size={12} />
                          Admin
                        </Badge>
                      ) : authorType === 'moderator' ? (
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
                      <span className="ml-2 text-sm">{authorName}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Criado em {formatDate(selectedTopic.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {isRulesPost ? (
              <div className="space-y-4">
                <Alert className="bg-primary/5 border-primary/20">
                  <Info className="h-4 w-4 text-primary" />
                  <AlertTitle>Regras do Fórum de Discussão</AlertTitle>
                  <AlertDescription>
                    Por favor, respeite estas regras para manter nossa comunidade agradável e produtiva.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-4 mt-4">
                  <h3 className="font-medium">1. Respeito Mútuo</h3>
                  <p className="text-muted-foreground">
                    Todos os membros devem tratar uns aos outros com respeito. Não serão tolerados insultos, 
                    provocações ou qualquer forma de discriminação.
                  </p>
                  
                  <h3 className="font-medium">2. Conteúdo Relevante</h3>
                  <p className="text-muted-foreground">
                    Mantenha as discussões relacionadas ao mundo do cinema. Posts fora do assunto podem ser removidos.
                  </p>
                  
                  <h3 className="font-medium">3. Sem Spoilers</h3>
                  <p className="text-muted-foreground">
                    Ao discutir filmes recentes, use a tag [SPOILER] no título e evite colocar spoilers no título do tópico.
                  </p>
                  
                  <h3 className="font-medium">4. Proibido Conteúdo Ilegal</h3>
                  <p className="text-muted-foreground">
                    Links para conteúdo pirata ou qualquer material que viole direitos autorais são proibidos.
                  </p>
                  
                  <h3 className="font-medium">5. Moderação</h3>
                  <p className="text-muted-foreground">
                    Os moderadores têm a palavra final sobre o que é apropriado. Decisões podem ser discutidas 
                    em privado, mas devem ser respeitadas.
                  </p>
                </div>
                
                <p className="italic text-muted-foreground text-center mt-6">
                  Estas regras podem ser atualizadas periodicamente. Última atualização: {formatDate(selectedTopic.updated_at)}
                </p>
              </div>
            ) : (
              <>
                <div className="whitespace-pre-line text-muted-foreground">
                  {selectedTopic.content || 'Conteúdo do tópico...'}
                </div>
                
                <div className="mt-6 border-t pt-4">
                  <p className="text-sm mb-4">Respostas ({replies.length})</p>
                  
                  {repliesLoading ? (
                    <p className="text-muted-foreground">Carregando respostas...</p>
                  ) : replies.length === 0 ? (
                    <p className="text-muted-foreground">Nenhuma resposta ainda.</p>
                  ) : (
                    <div className="space-y-4">
                      {replies.map((reply) => (
                        <Card key={reply.id} className="bg-muted/30">
                          <CardContent className="pt-4">
                            <div className="flex items-start gap-3">
                              <Avatar className={reply.profiles?.avatar_url ? '' : getAvatarColor(reply.profiles?.name || 'Anônimo', (reply.profiles?.user_type || 'user') as any)}>
                                {reply.profiles?.avatar_url ? (
                                  <AvatarImage src={reply.profiles.avatar_url} alt={reply.profiles?.name || 'Anônimo'} />
                                ) : null}
                                <AvatarFallback>{getInitials(reply.profiles?.name || 'Anônimo')}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-medium">{reply.profiles?.name || 'Usuário Anônimo'}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(reply.created_at)}
                                  </span>
                                </div>
                                <p className="text-sm whitespace-pre-line">{reply.content}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  {user && !selectedTopic.is_locked && (
                    <div className="mt-6">
                      <p className="text-sm mb-2">Responder:</p>
                      <textarea
                        className="w-full border rounded-md p-2 min-h-[100px]"
                        placeholder="Digite sua resposta..."
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                      />
                      <div className="mt-2 flex justify-end">
                        <Button onClick={handleReplySubmit} disabled={!newReply.trim()}>
                          Enviar Resposta
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {!user && (
                    <div className="mt-6 p-4 bg-muted rounded-md">
                      <p className="text-sm text-muted-foreground text-center">
                        Faça login para participar da discussão
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  if (categoriesLoading || topicsLoading) {
    return (
      <motion.div 
        className="container mx-auto px-4 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-center">
          <div className="inline-flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
            Carregando fórum...
          </div>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className="container mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-3/4">
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
              <Button disabled={!user}>
                {user ? 'Novo Tópico' : 'Faça Login'}
              </Button>
            </div>
          </div>
          
          <div className="mb-6">
            <Alert className="bg-primary/5">
              <Info className="h-4 w-4 text-primary" />
              <AlertTitle>Bem-vindo ao Fórum</AlertTitle>
              <AlertDescription>
                Por favor, leia as regras do fórum antes de participar. {!user && "Faça login para participar das discussões."}
              </AlertDescription>
            </Alert>
          </div>
          
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <ForumCategoryComponent
                key={category.id}
                title={category.name}
                description={category.description}
                topics={category.topics}
                formatDate={formatDate}
                onTopicClick={handleTopicClick}
              />
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
        
        <div className="w-full md:w-1/4 space-y-6">
          <OnlineUsers users={onlineUsers} />
          <RecentPosts posts={recentPosts} />
        </div>
      </div>
    </motion.div>
  );
};

export default Forum;
