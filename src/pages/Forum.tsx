
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
import { ForumTopic, ForumCategory, OnlineUser, RecentPost } from '@/types/forum';
import ForumCategoryComponent from '@/components/forum/ForumCategory';
import OnlineUsers from '@/components/forum/OnlineUsers';
import RecentPosts from '@/components/forum/RecentPosts';

// Forum categories and topics data
const forumCategories: ForumCategory[] = [
  {
    id: 'rules',
    name: 'Regras e Anúncios',
    description: 'Informações importantes sobre o funcionamento do fórum',
    topics: [
      {
        id: 0,
        title: 'Regras do Fórum - Leia antes de postar',
        author: 'Administrador',
        authorType: 'admin',
        replies: 0,
        lastActivity: '2024-05-01T10:00:00',
        isPinned: true,
        isRules: true,
        avatar_url: 'https://i.pravatar.cc/150?u=admin',
        category: 'rules'
      },
      {
        id: 5,
        title: 'Atualizações da plataforma - Maio 2024',
        author: 'Administrador',
        authorType: 'admin',
        replies: 3,
        lastActivity: '2024-05-20T16:45:00',
        isPinned: true,
        avatar_url: 'https://i.pravatar.cc/150?u=admin',
        category: 'rules'
      }
    ]
  },
  {
    id: 'directors',
    name: 'Diretores',
    description: 'Discussões sobre diretores de cinema e seus trabalhos',
    topics: [
      {
        id: 6,
        title: 'Martin Scorsese - Retrospectiva',
        author: 'Lucas Mendes',
        authorType: 'moderator',
        replies: 42,
        lastActivity: '2024-05-21T14:30:00',
        isPinned: true,
        avatar_url: 'https://i.pravatar.cc/150?u=lucas',
        category: 'directors'
      },
      {
        id: 7,
        title: 'Diretores brasileiros contemporâneos',
        author: 'Ana Souza',
        authorType: 'user',
        replies: 18,
        lastActivity: '2024-05-19T09:45:00',
        isPinned: false,
        avatar_url: 'https://i.pravatar.cc/150?u=ana',
        category: 'directors'
      },
      {
        id: 8,
        title: 'Christopher Nolan - Técnicas de filmagem',
        author: 'Paulo Ramos',
        authorType: 'user',
        replies: 24,
        lastActivity: '2024-05-18T11:20:00',
        isPinned: false,
        avatar_url: 'https://i.pravatar.cc/150?u=paulo',
        category: 'directors'
      }
    ]
  },
  {
    id: 'actors',
    name: 'Atores e Atrizes',
    description: 'Discussões sobre atuações e carreiras de artistas',
    topics: [
      {
        id: 9,
        title: 'Melhores atuações de 2023',
        author: 'Fernanda Lima',
        authorType: 'moderator',
        replies: 31,
        lastActivity: '2024-05-20T16:15:00',
        isPinned: true,
        avatar_url: 'https://i.pravatar.cc/150?u=fernanda',
        category: 'actors'
      },
      {
        id: 10,
        title: 'Wagner Moura - De Tropa de Elite a Hollywood',
        author: 'Carlos Oliveira',
        authorType: 'user',
        replies: 27,
        lastActivity: '2024-05-17T08:30:00',
        isPinned: false,
        avatar_url: 'https://i.pravatar.cc/150?u=carlos',
        category: 'actors'
      }
    ]
  },
  {
    id: 'genres',
    name: 'Gêneros Cinematográficos',
    description: 'Debates sobre diferentes gêneros de filmes',
    topics: [
      {
        id: 11,
        title: 'O renascimento do Terror psicológico',
        author: 'Maria Silva',
        authorType: 'user',
        replies: 36,
        lastActivity: '2024-05-22T10:10:00',
        isPinned: true,
        avatar_url: 'https://i.pravatar.cc/150?u=maria',
        category: 'genres'
      },
      {
        id: 12,
        title: 'Cinema Noir brasileiro',
        author: 'João Costa',
        authorType: 'moderator',
        replies: 14,
        lastActivity: '2024-05-15T13:45:00',
        isPinned: false,
        avatar_url: 'https://i.pravatar.cc/150?u=joao',
        category: 'genres'
      },
      {
        id: 13,
        title: 'A evolução da comédia no cinema nacional',
        author: 'Camila Santos',
        authorType: 'user',
        replies: 22,
        lastActivity: '2024-05-16T17:30:00',
        isPinned: false,
        avatar_url: 'https://i.pravatar.cc/150?u=camila',
        category: 'genres'
      }
    ]
  }
];

// Online users data
const onlineUsers: OnlineUser[] = [
  { id: 1, name: 'Administrador', userType: 'admin', avatar_url: 'https://i.pravatar.cc/150?u=admin', lastActive: new Date().toISOString() },
  { id: 2, name: 'João Costa', userType: 'moderator', avatar_url: 'https://i.pravatar.cc/150?u=joao', lastActive: new Date().toISOString() },
  { id: 3, name: 'Maria Silva', userType: 'user', avatar_url: 'https://i.pravatar.cc/150?u=maria', lastActive: new Date().toISOString() },
  { id: 4, name: 'Carlos Oliveira', userType: 'user', avatar_url: 'https://i.pravatar.cc/150?u=carlos', lastActive: new Date().toISOString() },
  { id: 5, name: 'Ana Souza', userType: 'user', avatar_url: 'https://i.pravatar.cc/150?u=ana', lastActive: new Date().toISOString() },
  { id: 6, name: 'Lucas Mendes', userType: 'moderator', avatar_url: 'https://i.pravatar.cc/150?u=lucas', lastActive: new Date().toISOString() },
  { id: 7, name: 'Fernanda Lima', userType: 'user', avatar_url: 'https://i.pravatar.cc/150?u=fernanda', lastActive: new Date().toISOString() },
  { id: 8, name: 'Paulo Ramos', userType: 'user', avatar_url: 'https://i.pravatar.cc/150?u=paulo', lastActive: new Date().toISOString() },
];

// Recent posts data
const recentPosts: RecentPost[] = [
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
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  // Filter topics based on search query
  const filteredCategories = searchQuery
    ? forumCategories.map(category => ({
        ...category,
        topics: category.topics.filter(topic => 
          topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.author.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.topics.length > 0)
    : forumCategories;
    
  const handleTopicClick = (topic: ForumTopic) => {
    setSelectedTopic(topic);
  };

  const handleBack = () => {
    setSelectedTopic(null);
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
    
    // Simple hash function to determine color
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
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
