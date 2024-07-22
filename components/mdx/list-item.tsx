export type ListItemProps = React.PropsWithChildren<
	React.HTMLAttributes<HTMLLIElement>
>;

export const ListItem: React.FC<ListItemProps> = ({ children, ...props }) => {
	const { className, ...rest } = props;

	return (
		<li className="list-item" {...rest}>
			<span className={className}>{children}</span>
		</li>
	);
};
