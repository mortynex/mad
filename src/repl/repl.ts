export const startREPL = (
	promptText: string,
	processor: (input: string) => any
) => {
	while (true) {
		const code = prompt(promptText);

		if (!code) {
			continue;
		}

		if (code?.startsWith(";")) {
			switch (code.slice(1).toLowerCase()) {
				case "cls":
					console.log("\n".repeat(100));

					break;
			}

			continue;
		}

		let result: any = null;

		try {
			result = processor(code);
		} catch (e) {
			console.error(e);

			continue;
		}
	}
};
