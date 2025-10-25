'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Video,
  Camera,
  NotebookText,
  Youtube,
  MessageCircle,
  User,
  Settings,
  Info,
} from 'lucide-react';
import { Logo } from '@/components/logo';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/analyze', label: 'Analyze Video', icon: Video },
  { href: '/live-session', label: 'Live Session', icon: Camera },
  { href: '/diet-plan', label: 'Diet Planner', icon: NotebookText },
  { href: '/recommendations', label: 'Recommendations', icon: Youtube },
  { href: '/chatbot', label: 'AI Chatbot', icon: MessageCircle },
];

const bottomMenuItems = [
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/oss', label: 'Open Source', icon: Info },
]

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard">
          <Logo />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={{ children: item.label }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
       <SidebarFooter>
         <SidebarMenu>
           {bottomMenuItems.map((item) => (
             <SidebarMenuItem key={item.href}>
               <SidebarMenuButton
                 asChild
                 isActive={isActive(item.href)}
                 tooltip={{ children: item.label }}
               >
                 <Link href={item.href}>
                   <item.icon />
                   <span>{item.label}</span>
                 </Link>
               </SidebarMenuButton>
             </SidebarMenuItem>
           ))}
         </SidebarMenu>
       </SidebarFooter>
    </Sidebar>
  );
}
