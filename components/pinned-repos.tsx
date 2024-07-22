"use client";

import { fetcher } from "@/lib/fetcher";
import type { ReposData } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { BookMarked, Circle, GitFork, Star } from "lucide-react";

const LoadingRepo: React.FC = () => (
  <li className="w-full">
    <div className="flex flex-col rounded-md border border-solid border-muted p-4">
      <div
        className="mb-2 flex flex-row items-center"
        style={{ paddingTop: "2px", paddingBottom: "2px" }}
      >
        <BookMarked
          width={16}
          height={16}
          aria-hidden
          className="mr-2 text-muted-foreground"
        />
        <div className="h-2 w-2/3 rounded animate-pulse bg-muted" />
      </div>
      <div className="mb-1 animate-pulse w-full mt-1 h-2 rounded bg-muted" />
      <div className="mb-5 animate-pulse w-full mt-1 h-2 rounded bg-muted" />
      <div className="flex flex-row items-center">
        <span className="mr-4 flex flex-row items-center text-gray-400">
          <div
            aria-hidden
            style={{ width: "12px", height: "12px" }}
            className="mr-1 rounded-full bg-muted"
          />
          <div className="my-1 h-2 w-12 rounded bg-muted animate-pulse" />
        </span>
        <span className="flex flex-row items-center text-gray-400">
          <Star
            width={16}
            height={16}
            aria-hidden
            className="mr-1 text-muted-foreground"
          />
          <div className="my-1 h-2 w-12 rounded bg-muted animate-pulse" />
        </span>
        <span className="ml-4 flex flex-row items-center text-gray-400">
          <GitFork
            width={16}
            height={16}
            aria-hidden
            className="mr-1 text-muted-foreground"
          />
          <div className="my-1 h-2 w-12 rounded bg-muted animate-pulse" />
        </span>
      </div>
    </div>
  </li>
);

export const Repos: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["repos"],
    queryFn: () => fetcher<ReposData>("/api/github/repos"),
  });

  return (
    <ol className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {isLoading &&
        Array(4)
          .fill("loading")
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          .map((_, i) => <LoadingRepo key={i} />)}
      {!isLoading &&
        data?.repos?.viewer?.pinnedItems?.nodes?.map((repo) => (
          <li key={repo.id} className="w-full">
            <div className="flex flex-col rounded-md border border-solid border-muted p-4">
              <div className="mb-2 flex flex-row items-center">
                <BookMarked
                  width={16}
                  height={16}
                  aria-hidden
                  className="mr-2 text-muted-foreground"
                />
                <a
                  className="rounded px-1 text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2"
                  rel="noopener noreferrer"
                  target="_blank"
                  href={repo.url}
                >
                  {repo.owner.login === "jsantanders" ? (
                    <span>{repo.name}</span>
                  ) : (
                    <>
                      <span className="font-normal">{repo.owner.login}</span>
                      <span>/{repo.name}</span>
                    </>
                  )}
                </a>
              </div>
              <p className="mb-4 line-clamp-2 text-xs text-muted-foreground">
                {repo.description}
              </p>
              <div className="flex flex-row items-center">
                <span className="mr-4 flex flex-row items-center text-xs text-muted-foreground">
                  <Circle
                    width={12}
                    height={12}
                    aria-hidden
                    className="mr-1"
                    style={{ color: repo.primaryLanguage.color }}
                  />
                  {repo.primaryLanguage.name}
                </span>
                {repo.stargazerCount > 0 && (
                  <span className="flex flex-row items-center text-xs text-muted-foreground">
                    <Star
                      width={16}
                      height={16}
                      aria-hidden
                      className="mr-1 text-muted-foreground"
                    />
                    {repo.stargazerCount}
                  </span>
                )}
                {repo.forkCount > 0 && (
                  <span className="ml-4 flex flex-row items-center text-xs text-muted-foreground">
                    <GitFork
                      width={16}
                      height={16}
                      aria-hidden
                      className="mr-1"
                    />
                    {repo.forkCount}
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
    </ol>
  );
};
