import { cn } from "@/lib/utils";
import { Link } from "@/navigation";

export const SocialLink = (
	props: React.PropsWithChildren<{
		href: string;
		ariaLabel: string;
		className?: string;
		linkProps?: React.HTMLAttributes<HTMLAnchorElement>;
	}>,
) => {
	const { className, href, children, linkProps, ariaLabel } = props;
	return (
		<div className={cn(className, "flex")}>
			<Link
				target="_blank"
				href={href}
				aria-label={ariaLabel}
				title={ariaLabel}
				className="group flex text-sm font-medium text-muted-foreground transition hover:text-primary"
				{...linkProps}
			>
				<span>{children}</span>
			</Link>
		</div>
	);
};
