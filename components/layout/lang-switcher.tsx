"use client";

import * as React from "react";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "@/navigation";
import { useLocale } from "next-intl";

export function LangSwitcher() {
	const router = useRouter();
	const pathname = usePathname();
	const locale = useLocale();

	return (
		<Select
			value={locale}
			onValueChange={(value: "en" | "es") =>
				router.replace(pathname, { locale: value })
			}
		>
			<SelectTrigger className="w-[120px]">
				<SelectValue defaultValue={locale} />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectItem value="es">Español</SelectItem>
					<SelectItem value="en">English</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
