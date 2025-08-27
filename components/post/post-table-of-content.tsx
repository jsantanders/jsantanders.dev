"use client";

import { Link } from "@/navigation";
import type { Toc, TocEntry } from "@stefanprobst/rehype-extract-toc";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

type PostTableOfContentProps = {
  toc: Toc;
  locales: {
    title: string;
  };
};

//TODO: I don't want to include the footnotes section,
// but still want to generate it. It could be a better way of handle this.
const NON_TOC_ELEMENTS = ["Footnotes"];

export const PostTableOfContents: React.FC<PostTableOfContentProps> = ({
  toc,
  locales,
}) => {
  // Desktop: expanded by default; Mobile: collapsed pill by default
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [showMobileControl, setShowMobileControl] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const lastScrollY = useRef(0);
  const idsInOrder = useMemo(() => flattenTocIds(toc), [toc]);

  useEffect(() => {
    if (!idsInOrder.length) return;
    let ticking = false;
    const updateActiveHeading = () => {
      const scrollY = window.scrollY;
      // Offset so the active section updates a bit before reaching the very top
      const offset = 96; // ~24px top nav + spacing
      let current: string | null = null;
      for (const id of idsInOrder) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop - offset <= scrollY) {
          current = id;
        } else {
          break;
        }
      }
      setActiveId(current);
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Determine scroll direction for mobile control visibility
          const y = window.scrollY;
          const diff = y - lastScrollY.current;
          if (!mobileExpanded) {
            if (diff > 2) setShowMobileControl(false); // scrolling down
            else if (diff < -2) setShowMobileControl(true); // scrolling up
          } else {
            setShowMobileControl(true);
          }
          lastScrollY.current = y;
          updateActiveHeading();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Initial run
    updateActiveHeading();
    return () => window.removeEventListener("scroll", onScroll);
  }, [idsInOrder, mobileExpanded]);

  if (!toc?.length) return null;

  return (
    <>
      {/* Desktop: fixed right, sticky-like, always visible and expanded by default */}
      <div className="hidden lg:block">
        <div className="fixed right-6 top-[160px] z-30 w-72 max-h-[70vh] overflow-auto rounded-lg border bg-primary-foreground p-4 shadow-sm">
          <Collapsible
            open={desktopOpen}
            onOpenChange={setDesktopOpen}
            className="w-full"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{locales.title}</h2>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-9 p-0"
                  aria-label="Toggle table of contents"
                >
                  {desktopOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="mt-4">
              <nav aria-label="Table of contents">
                <ListOfContent nodes={toc} activeId={activeId} />
              </nav>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {/* Mobile: bottom-center pill that expands to overlay panel; show on scroll up */}
      <div className="lg:hidden">
        {/* Pill control */}
        <button
          onClick={() => setMobileExpanded(true)}
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-40 rounded-full border bg-primary-foreground px-4 py-2 shadow-md transition-all duration-200 ${
            showMobileControl
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none"
          }`}
          aria-label="Open table of contents"
        >
          <span className="text-sm font-medium">{locales.title}</span>
        </button>

        {/* Expanded overlay */}
        {mobileExpanded && (
          <div className="fixed inset-x-0 bottom-0 z-50 flex items-end justify-center">
            <div className="mb-4 w-[min(92vw,28rem)] max-h-[75vh] overflow-auto rounded-xl border bg-primary-foreground p-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{locales.title}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-9 p-0"
                  onClick={() => setMobileExpanded(false)}
                  aria-label="Close table of contents"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <nav className="mt-3" aria-label="Table of contents">
                <ListOfContent
                  nodes={toc}
                  activeId={activeId}
                  onNavigate={() => setMobileExpanded(false)}
                />
              </nav>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const ListOfContent: React.FC<{
  nodes: Toc;
  chapter?: string;
  activeId?: string | null;
  onNavigate?: () => void;
}> = ({ nodes, chapter = "", activeId, onNavigate }) => {
  const headingElements = nodes
    .filter((n) => !NON_TOC_ELEMENTS.includes(n.value))
    .map((node, idx) => {
      return (
        <li key={node.id}>
          <TOCLink
            node={node}
            ch={`${chapter}${idx + 1}.`}
            activeId={activeId}
            onNavigate={onNavigate}
          />
          {node.children?.length && node.children?.length > 0 && (
            <ListOfContent
              nodes={node.children}
              chapter={`${chapter}${idx + 1}.`}
              activeId={activeId}
              onNavigate={onNavigate}
            />
          )}
        </li>
      );
    });

  return <ul>{headingElements}</ul>;
};

const TOCLink: React.FC<{
  node: TocEntry;
  ch: string;
  activeId?: string | null;
  onNavigate?: () => void;
}> = ({ node, ch, activeId, onNavigate }) => {
  const fontSizes: Record<number, string> = { 2: "base", 3: "sm", 4: "xs" };
  const padding: Record<number, string> = { 2: "pl-0", 3: "pl-7", 4: "pl-10" };
  const id = node.id;
  const isActive = id && activeId === id;

  if (!id) return null;

  return (
    <Link
      href={`#${id}`}
      className={`block py-1 ${padding[node.depth]} pl-2 border-l text-${
        fontSizes[node.depth]
      } ${
        isActive
          ? "text-foreground border-primary"
          : "text-muted-foreground border-transparent hover:text-primary hover:underline"
      }`}
      aria-current={isActive ? "true" : undefined}
      onClick={(e) => {
        e.preventDefault();
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
        onNavigate?.();
      }}
    >
      {ch} {node.value}
    </Link>
  );
};

function flattenTocIds(nodes: Toc, acc: string[] = []): string[] {
  for (const n of nodes) {
    if (NON_TOC_ELEMENTS.includes(n.value)) continue;
    if (n.id) acc.push(n.id);
    if (n.children?.length) flattenTocIds(n.children, acc);
  }
  return acc;
}
