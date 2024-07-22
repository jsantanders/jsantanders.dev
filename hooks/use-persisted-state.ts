"use client";

import { type Dispatch, type SetStateAction, useState } from "react";

export const usePersistedState = (
	key: string,
	initialValue: string,
): [string, Dispatch<SetStateAction<string>>] => {
	const [state, setState] = useState<string>(() => {
		// Initialize the state
		try {
			if (!global?.window) return initialValue;
			const value = window?.localStorage.getItem(key);
			if (!value) window?.localStorage.setItem(key, initialValue);
			// Check if the local storage already has any values,
			// otherwise initialize it with the passed initialValue
			return value ? value : initialValue;
		} catch (error) {
			console.log(error);
			throw error;
		}
	});

	const setValue = (value: string) => {
		try {
			// If the passed value is a callback function,
			//  then call it with the existing state.
			window.localStorage.setItem(key, value);
			setState(value);
		} catch (error) {
			console.log(error);
		}
	};

	return [state, setValue];
};
