"use client";

import { Fragment } from "react";
import Link from "next/link";
import { useLocale } from "@/components/providers/locale-provider";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

/**
 * @param {{ items: Array<{ href: string | null; en: string; bn: string }>; className?: string }} props
 */
export function WorkspaceBreadcrumbs({ items, className }) {
  const { copy } = useLocale();

  if (!items?.length) return null;

  return (
    <Breadcrumb className={cn(className)}>
      <BreadcrumbList className="flex-wrap gap-y-2">
        {items.map((item, index) => {
          const label = copy(item.en, item.bn);
          const isLast = index === items.length - 1;

          return (
            <Fragment key={`${item.en}-${index}`}>
              {index > 0 ? <BreadcrumbSeparator /> : null}
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage className="max-w-[10rem] truncate sm:max-w-none">{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
