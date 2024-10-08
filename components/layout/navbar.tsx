"use client";

import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Link, usePathname, useRouter } from "@/navigation";
import { Menu } from "lucide-react";
import { Fragment, type PropsWithChildren } from "react";
import { Button } from "../ui/button";
import { LangSwitcher } from "./lang-switcher";
import { ThemeToggle } from "./theme-toggle";
import useHiddenNav from "./use-hidden-nav";

type NavLinkProps = {
	href: string;
};

type NavbarProps = {
	locales: {
		home: string;
		blog: string;
		about: string;
		navigation: string;
	};
};

export const Navbar = ({ locales }: NavbarProps) => {
	const [navRef, isNavVisible] = useHiddenNav();
	const classes = isNavVisible ? "navbar" : "navbar navbar-hidden";

	return (
		<nav
			ref={navRef}
			className={`sticky top-0 z-10 my-4 bg-background py-2 backdrop-blur-sm ${classes}`}
		>
			<div className="mx-auto flex w-full items-center justify-between">
				<Fragment>
					<MobileNav
						locales={locales}
						className="pointer-events-auto md:hidden"
					/>
					<DesktopNav
						locales={locales}
						className="pointer-events-auto hidden md:block"
					/>
				</Fragment>
				<div className="flex flex-row gap-x-2">
					<ThemeToggle />
					<LangSwitcher />
				</div>
			</div>
		</nav>
	);
};

const DesktopNav: React.FC<NavbarProps & { className: string }> = ({
	className,
	locales,
}) => {
	return (
		<div className={cn("flex flex-row", className)}>
			<DesktopNavLink href="/">{locales.home}</DesktopNavLink>
			<DesktopNavLink href="/posts/pages/1">{locales.blog}</DesktopNavLink>
			<DesktopNavLink href="/about">{locales.about}</DesktopNavLink>
		</div>
	);
};

const DesktopNavLink: React.FC<PropsWithChildren<NavLinkProps>> = ({
	children,
	href,
}) => {
	const pathname = usePathname();
	const isActive = pathname.replace(/\/$/, "") === href.replace(/\/$/, "");

	return (
		<Link
			className={cn(
				isActive
					? "font-semibold underline decoration-primary decoration-2 underline-offset-4"
					: "font-normal text-muted-foreground",
				"mr-7 inline-block py-2 pr-1 text-lg transition-all hover:text-primary hover:underline hover:decoration-primary hover:decoration-2 hover:underline-offset-4 hover:ease-in",
			)}
			href={href}
		>
			<span>{children}</span>
		</Link>
	);
};

const MobileNav: React.FC<NavbarProps & { className: string }> = ({
	className,
	locales,
}) => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					className={cn("focus:ring-1 focus:ring-primary", className)}
					variant="outline"
					size="icon"
				>
					<Menu />
				</Button>
			</SheetTrigger>
			<SheetContent side="bottom" className="rounded-lg backdrop-blur-sm">
				<SheetHeader>
					<SheetTitle>{locales.navigation}</SheetTitle>
				</SheetHeader>
				<ul className="-my-2 divide-y divide-border text-base text-primary">
					<MobileNavLink href="/">{locales.home}</MobileNavLink>
					<MobileNavLink href="/posts/pages/1">{locales.blog}</MobileNavLink>
					<MobileNavLink href="/about">{locales.about}</MobileNavLink>
				</ul>
			</SheetContent>
		</Sheet>
	);
};

const MobileNavLink: React.FC<PropsWithChildren<{ href: string }>> = ({
	href,
	children,
}) => {
	const router = useRouter();
	return (
		<SheetClose asChild>
			<li>
				<button
					className="block w-full py-2 text-left"
					onClick={() => router.push(href)}
					type="button"
				>
					{children}
				</button>
			</li>
		</SheetClose>
	);
};
