
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

// Add avatar_url field to the ForumTopic interface
interface ForumTopic {
  id: number;
  title: string;
  author: string;
  authorType: 'user' | 'moderator' | 'admin';
  replies: number;
  lastActivity: string;
  isPinned: boolean;
  isRules?: boolean;
  avatar_url?: string;
}

const ForumTopics: ForumTopic[] = [
  {
    id: 0,
    title: 'Regras do Fórum - Leia antes de postar',
    author: 'Administrador',
    authorType: 'admin',
    replies: 0,
    lastActivity: '2024-05-01T10:00:00',
    isPinned: true,
    isRules: true,
    avatar_url: 'https://i.pravatar.cc/150?u=admin'
  },
  {
    id: 5,
    title: 'Atualizações da plataforma - Maio 2024',
    author: 'Administrador',
    authorType: 'admin',
    replies: 3,
    lastActivity: '2024-05-20T16:45:00',
    isPinned: true,
    avatar_url: 'https://i.pravatar.cc/150?u=admin'
  },
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
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  
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
    
  // Sort topics: rules first, then admin posts, then pinned, then by date
  const sortedTopics = [...filteredTopics].sort((a, b) => {
    // Rules thread always at the top
    if (a.isRules) return -1;
    if (b.isRules) return 1;
    
    // Admin posts next
    if (a.authorType === 'admin' && b.authorType !== 'admin') return -1;
    if (a.authorType !== 'admin' && b.authorType === 'admin') return 1;
    
    // Then pinned posts
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    // Finally sort by date
    return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
  });
  
  const handleTopicClick = (topic: ForumTopic) => {
    setSelectedTopic(topic);
  };

  const handleBack = () => {
    setSelectedTopic(null);
  };
  
  if (selectedTopic) {
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
                  {selectedTopic.isPinned && <Pin size={16} className="text-primary" />}
                  {selectedTopic.title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Avatar className={selectedTopic.avatar_url ? '' : getAvatarColor(selectedTopic.author, selectedTopic.authorType)}>
                    {selectedTopic.avatar_url ? (
                      <AvatarImage src={selectedTopic.avatar_url} alt={selectedTopic.author} />
                    ) : null}
                    <AvatarFallback>{getInitials(selectedTopic.author)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      {selectedTopic.authorType === 'admin' ? (
                        <Badge variant="default" className="flex items-center gap-1">
                          <Shield size={12} />
                          Admin
                        </Badge>
                      ) : selectedTopic.authorType === 'moderator' ? (
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
                      <span className="ml-2 text-sm">{selectedTopic.author}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Atualizado em {formatDate(selectedTopic.lastActivity)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {selectedTopic.isRules ? (
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
                  Estas regras podem ser atualizadas periodicamente. Última atualização: 01/05/2024
                </p>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground">
                  {selectedTopic.authorType === 'admin' ? (
                    'Este é um tópico oficial da administração. Apenas administradores podem responder.'
                  ) : (
                    'Conteúdo do tópico...'
                  )}
                </p>
                <div className="mt-6 border-t pt-4">
                  <p className="text-sm mb-2">Respostas ({selectedTopic.replies})</p>
                  {selectedTopic.replies === 0 ? (
                    <p className="text-muted-foreground">Nenhuma resposta ainda.</p>
                  ) : (
                    <p className="text-muted-foreground">Carregando respostas...</p>
                  )}
                  
                  {selectedTopic.authorType !== 'admin' && (
                    <div className="mt-6">
                      <p className="text-sm mb-2">Responder:</p>
                      <textarea
                        className="w-full border rounded-md p-2 min-h-[100px]"
                        placeholder="Digite sua resposta..."
                      />
                      <div className="mt-2 flex justify-end">
                        <Button>Enviar Resposta</Button>
                      </div>
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
      
      <div className="mb-6">
        <Alert className="bg-primary/5">
          <Info className="h-4 w-4 text-primary" />
          <AlertTitle>Bem-vindo ao Fórum</AlertTitle>
          <AlertDescription>
            Por favor, leia as regras do fórum antes de participar. Os tópicos dos administradores são somente para informações importantes.
          </AlertDescription>
        </Alert>
      </div>
      
      <div className="grid gap-4">
        {sortedTopics.length > 0 ? (
          sortedTopics.map((topic) => (
            <TopicCard 
              key={topic.id} 
              topic={topic} 
              formatDate={formatDate}
              onClick={() => handleTopicClick(topic)}
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
    </motion.div>
  );
};

interface TopicCardProps {
  topic: ForumTopic;
  formatDate: (dateString: string) => string;
  onClick: () => void;
}

const TopicCard = ({ topic, formatDate, onClick }: TopicCardProps) => {
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
    <Card 
      className={`transition-all hover:border-primary/20 hover:shadow-md cursor-pointer ${
        topic.isRules ? 'border-primary/30 bg-primary/5' : 
        topic.authorType === 'admin' ? 'border-red-200 bg-red-50/30' : ''
      }`}
      onClick={onClick}
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
  );
};

export default Forum;
