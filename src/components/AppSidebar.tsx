import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Bookmark, 
  User, 
  Settings,
  LogOut,
  Zap
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const navigation = [
  { 
    title: 'Dashboard', 
    url: '/dashboard', 
    icon: Home,
    description: 'Panoramica generale'
  },
  { 
    title: 'Ricerca Bandi', 
    url: '/search', 
    icon: Search,
    description: 'Trova nuovi finanziamenti'
  },
  { 
    title: 'Bandi Salvati', 
    url: '/saved-grants', 
    icon: Bookmark,
    description: 'I tuoi bandi preferiti'
  },
];

const AppSidebar = () => {
  const { open } = useSidebar();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUserInitials = () => {
    if (user?.user_metadata?.name) {
      return user.user_metadata.name
        .split(' ')
        .map((name: string) => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.slice(0, 2).toUpperCase() || 'U';
  };

  return (
    <Sidebar className={`${!open ? 'w-16' : 'w-64'} transition-all duration-300`}>
      {/* Header */}
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {!open && (
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-sidebar-foreground truncate">
                GrantFinder
              </h1>
              <p className="text-xs text-sidebar-foreground/60">
                Pro Analytics
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className={!open ? 'sr-only' : ''}>
            Navigazione
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        }`
                      }
                    >
                      <item.icon className={`w-5 h-5 flex-shrink-0 ${
                        isActive(item.url) ? 'text-primary-foreground' : 'text-sidebar-foreground/70'
                      }`} />
                      {!open && (
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium truncate">
                            {item.title}
                          </div>
                          <div className={`text-xs truncate ${
                            isActive(item.url) 
                              ? 'text-primary-foreground/80' 
                              : 'text-sidebar-foreground/50'
                          }`}>
                            {item.description}
                          </div>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="space-y-3">
          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            {!open && (
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.user_metadata?.name || 'Utente'}
                </div>
                <div className="text-xs text-sidebar-foreground/60 truncate">
                  {user?.email}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className={`${
                !open ? 'w-full justify-center' : 'flex-1'
              } text-sidebar-foreground hover:bg-sidebar-accent`}
            >
              <Settings className="w-4 h-4" />
              {!open && <span className="ml-2">Impostazioni</span>}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className={`${
                !open ? 'w-full justify-center' : 'flex-1'
              } text-sidebar-foreground hover:bg-sidebar-accent hover:text-destructive`}
            >
              <LogOut className="w-4 h-4" />
              {!open && <span className="ml-2">Esci</span>}
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;