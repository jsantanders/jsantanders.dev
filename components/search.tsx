"use client";

import useDebounce from "@/hooks/use-debounce";
import { Link } from "@/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2, SearchCode, SearchIcon } from "lucide-react";
import type { SearchResult } from "minisearch";
import { useState } from "react";
import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Props = {
	locale: string;
	locales: {
		title: string;
		placeholder: string;
	};
};

function useSearch(search: string, locale: string) {
	let url = "/api/search";
	if (search) {
		url += `?q=${search}&l=${locale}`;
	}

	return useQuery({
		queryKey: ["search", { search }],
		queryFn: () => fetch(url).then((res) => res.json()),
		enabled: !!search,
	});
}

export const Search = ({ locales, locale }: Props) => {
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounce(search, 500);

	const { isLoading, data } = useSearch(debouncedSearch, locale);

	function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
		setSearch(event.target.value);
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size="icon" variant="outline">
					<SearchIcon />
				</Button>
			</DialogTrigger>
			<DialogContent className="fixed top-20 left-1/2 transform overflow-auto my-auto -translate-x-1/2 max-h-[90vh]">
				<DialogHeader>
					<DialogTitle>{locales.title}</DialogTitle>
				</DialogHeader>
				<div className="flex items-center space-x-2">
					<div className="grid flex-1 gap-2">
						<Label htmlFor="search" className="sr-only">
							{locales.placeholder}
						</Label>
						<div>
							<Input
								name="search"
								value={search}
								onChange={handleSearchChange}
								placeholder={locales.placeholder}
							/>
							<span className="pointer-events-none justify-center text-base-400">
								{isLoading ? (
									<Loader2 className="animate-spin absolute right-0 top-0 m-2.5 h-4 w-4 text-muted-foreground" />
								) : (
									<SearchCode className="absolute right-0 top-0 m-2.5 h-4 w-4 text-muted-foreground" />
								)}
							</span>
						</div>
						<div className="mt-4 grid space-y-4">
							{data?.map((post: SearchResult) => (
								<SearchResultCard key={post.url} {...post} />
							))}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

const SearchResultCard: React.FC<SearchResult> = ({
	url,
	title,
	summary,
	readingTime,
	date,
}) => {
	return (
		<Link href={`${url}`} className="w-full">
			<Card className="transition-all hover:bg-accent">
				<CardHeader className="pb-1">
					<CardTitle className="line-clamp-2 text-2xl font-bold tracking-tight lg:line-clamp-1">
						{title}
					</CardTitle>
				</CardHeader>
				<CardContent className="line-clamp-2 pb-2 tracking-tight text-muted-foreground lg:line-clamp-2">
					{summary}
				</CardContent>
				<CardFooter className="flex flex-row justify-between text-secondary-foreground">
					<div>{readingTime} min</div>
					<time>{date}</time>
				</CardFooter>
			</Card>
		</Link>
	);
};
