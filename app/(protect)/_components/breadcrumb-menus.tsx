"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useSelectedLayoutSegments } from "next/navigation";
import menus from "../_lib/menus";
import Link from "next/link";
import React from "react";

export function BreadcrumbMenus() {
  const segments = useSelectedLayoutSegments();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const menu = menus.find((menu) => menu.url.includes(segment));
          const realMenu = menu || {
            title: segment,
            url: `/${segments.slice(0, index + 1).join("/")}`,
          };

          const key = realMenu.url + realMenu.title;

          return (
            <React.Fragment key={key}>
              <BreadcrumbItem className="hidden md:block">
                {index === segments.length - 1 ? (
                  <BreadcrumbPage>{realMenu.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={realMenu.url}>{realMenu.title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < segments.length - 1 && (
                <BreadcrumbSeparator className="hidden md:block" />
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
