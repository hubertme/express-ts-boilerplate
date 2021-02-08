export default class FormatterUtil {
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
}
