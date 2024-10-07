"use client";

import {
  Users2,
  HandCoins,
  GraduationCap,
  Smartphone,
  Settings,
  BadgeInfo,
  GroupIcon,
  Home,
  Boxes,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Nav } from "@/components/nav";
import { usePathname } from "next/navigation";
import { group } from "console";
import { Group } from "@radix-ui/react-dropdown-menu";

const isCollapsed = false;

export function SideNav({
  id,
  counts,
  programTitle,
}: {
  id: string;
  programTitle: string;
  counts?: {
    participants: number;
    grants: number;
    devices: number;
    capDevs: number;
  };
}) {
  const pathname = usePathname();

  return (
    <>
      <Nav
        isCollapsed={isCollapsed}
        links={[
          {
            title: "Dashboard",
            label: "",
            icon: Home,
            route: `/programs/${id}`,
            variant: `${pathname === `/programs/${id}` ? `default` : `ghost`}`,
          },
          {
            title: "Participants",
            label: counts?.participants.toString() ?? "",
            icon: Users2,
            route: `/programs/${id}/participants`,
            variant: `${
              pathname.startsWith(`/programs/${id}/participants`) ||
              pathname.startsWith(`/programs/${id}/businesses`)
                ? `default`
                : `ghost`
            }`,
          },


          // {
          //   title: "Existing Participant",
          //   label:  " 24884",
          //   icon: Users2,
          //   route: `/files`,
          //   variant: `${
          //     pathname.startsWith(`/files`) ||
          //     pathname.startsWith(`/files`)                ? `default`
          //       : `ghost`
          //   }`,
          // },


             {
              title: "Group",
              label: "0",
              icon: GroupIcon,
              route: `/programs/${id}/groups`,

              // variant: `${pathname === '/group' ? `default` : `ghost`}`,
              variant: `${
                pathname.startsWith(`/programs/${id}/groups`) ||
                pathname.startsWith(`/programs/${id}/groups`)
                  ? `default`
                  : `ghost`
              }`,

            
            
          },

      
          // {
          //   title: "Grants",
          //   label: counts?.grants.toString() ?? "",
          //   icon: HandCoins,
          //   route: `/programs/${id}/grants`,
          //   variant: `${
          //     pathname.startsWith(`/programs/${id}/grants`)
          //       ? `default`
          //       : `ghost`
          //   }`,
          // },
          // {
          //   title: "Assets",
          //   label: counts?.devices.toString() ?? "",
          //   icon: Smartphone,
          //   route: `/programs/${id}/devices`,
          //   variant: `${
          //     pathname.startsWith(`/programs/${id}/devices`)
          //       ? `default`
          //       : `ghost`
          //   }`,
          // },
          {
            title: "Capacity Development",
            label: counts?.capDevs.toString() ?? "",
            icon: GraduationCap,
            route: `/programs/${id}/capacity-development`,
            variant: `${
              pathname.startsWith(`/programs/${id}/capacity-development`)
                ? `default`
                : `ghost`
            }`,
          },

          {
            title: "Help",
            label: "",
            icon: BadgeInfo,
            variant: "ghost",
            route: "/programs/participants",
          },
          {
            title: "Settings",
            label: "",
            icon: Settings,
            variant: "ghost",
            route: "/programs/participants",
          },
        ]}
      />
      {/* <Nav
        isCollapsed={isCollapsed}
        links={[
          {
            title: "Help",
            label: "",
            icon: BadgeInfo,
            variant: "ghost",
            route: "/programs/participants",
          },
          {
            title: "Settings",
            label: "",
            icon: Settings,
            variant: "ghost",
            route: "/programs/participants",
          },
        ]}
      /> */}
    </>
  );
}
