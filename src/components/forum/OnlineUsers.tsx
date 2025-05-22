
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface OnlineUser {
  id: number;
  name: string;
  avatar_url?: string;
  userType: 'user' | 'moderator' | 'admin';
  lastActive: string;
}

interface OnlineUsersProps {
  users: OnlineUser[];
}

const OnlineUsers = ({ users }: OnlineUsersProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };
  
  const getAvatarColor = (userType: string) => {
    if (userType === 'admin') return 'bg-red-500';
    if (userType === 'moderator') return 'bg-purple-500';
    return 'bg-blue-500';
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md">Usuários Online</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-60 pr-4">
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center space-x-3">
                <Avatar className={user.avatar_url ? '' : getAvatarColor(user.userType)}>
                  {user.avatar_url ? (
                    <AvatarImage src={user.avatar_url} alt={user.name} />
                  ) : (
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.userType === 'admin' ? (
                      <Badge variant="default" className="text-[10px] h-4 mt-1">Admin</Badge>
                    ) : user.userType === 'moderator' ? (
                      <Badge variant="secondary" className="text-[10px] h-4 mt-1">Moderador</Badge>
                    ) : null}
                  </p>
                </div>
                <div className="ml-auto">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default OnlineUsers;
