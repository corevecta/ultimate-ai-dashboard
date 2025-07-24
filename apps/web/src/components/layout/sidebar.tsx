'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navigationItems, isNavItemActive } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const pathname = usePathname();
  const [openItems, setOpenItems] = React.useState<string[]>([]);

  const toggleItem = (href: string) => {
    setOpenItems(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className={cn(
        "flex h-full flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        collapsed ? "w-16" : "w-64"
      )}>
        <div className="flex h-16 items-center border-b px-4">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="text-2xl">🚀</span>
              <span className="text-lg">AI Pipeline</span>
            </Link>
          )}
        </div>
        
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 py-4">
            {navigationItems.map((item) => {
              const isActive = isNavItemActive(item.href, pathname);
              const Icon = item.icon;
              const hasChildren = item.children && item.children.length > 0;
              const isOpen = openItems.includes(item.href);
              
              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Link href={item.href}>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          size="icon"
                          className={cn(
                            "w-full",
                            isActive && "bg-secondary"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="flex items-center gap-2">
                      {item.title}
                      {item.badge && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </TooltipContent>
                  </Tooltip>
                );
              }
              
              if (hasChildren) {
                return (
                  <Collapsible
                    key={item.href}
                    open={isOpen}
                    onOpenChange={() => toggleItem(item.href)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-2",
                          isActive && "bg-secondary"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="flex-1 text-left">{item.title}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-1 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronDown className={cn(
                          "h-4 w-4 transition-transform",
                          isOpen && "rotate-180"
                        )} />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-6 space-y-1">
                      {item.children?.map((child) => {
                        const childActive = isNavItemActive(child.href, pathname);
                        const ChildIcon = child.icon;
                        
                        return (
                          <Link key={child.href} href={child.href}>
                            <Button
                              variant={childActive ? "secondary" : "ghost"}
                              size="sm"
                              className={cn(
                                "w-full justify-start gap-2",
                                childActive && "bg-secondary"
                              )}
                            >
                              <ChildIcon className="h-4 w-4" />
                              <span className="text-sm">{child.title}</span>
                            </Button>
                          </Link>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                );
              }
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-2",
                      isActive && "bg-secondary"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="flex-1 text-left">{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>
        </ScrollArea>
        
        <div className="border-t p-4">
          {!collapsed && (
            <div className="text-xs text-muted-foreground">
              <p>Ultimate AI Dashboard</p>
              <p className="mt-1">v1.0.0</p>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};