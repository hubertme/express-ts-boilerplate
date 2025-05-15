import AppConfig from "../app_config"; // Path from src/utils/formatter_util.ts to src/app_config.ts

/**
 * Utility class for various formatting operations.
 */
export default class FormatterUtil {
    /**
     * Filters an object to include only keys with non-null values.
     * Optionally, empty strings can also be excluded.
     *
     * @param input The input object with string keys and any values.
     * @param allowEmptyString If false, keys with empty string values will also be excluded. Defaults to true.
     * @returns A new object containing only the keys that meet the criteria.
     */
    static notNullValuesOnly(input: {[key: string]: any}, allowEmptyString: boolean = true): {[key: string]: any} {
        let result: {[key: string]: any} = {};
        Object.keys(input).forEach((key, idx) => {
            if (!allowEmptyString) {
                if (input[key] != null && input[key] !== '') {
                    result[key] = input[key];
                }
            } else {
                if (input[key] != null) {
                    result[key] = input[key];
                }
            }
        });

        return result;
    }

    /**
     * Gets a human-readable, official-sounding name for the current NODE_ENV.
     *
     * @returns A string representing the environment name (e.g., "Development", "Production"). Returns "Unknown" if NODE_ENV is not recognized.
     */
    static getOfficialEnvName(): string {
        switch (process.env.NODE_ENV) {
            case "development":
                return "Development";
            case "staging":
                return "Staging";
            case "prod":
                return "Production";
            default:
                return "Unknown";
        }
    }
} 