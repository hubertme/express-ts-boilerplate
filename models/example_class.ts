export default class ExampleClass {
    uuid: string;
    transactions_counter: number;

    constructor(
        uuid: string,
        transaction_counter: number
    ) {
        this.uuid = uuid;
        this.transactions_counter = transaction_counter;
    }

    static fromJson(data: {[key: string]: any}): ExampleClass {
        return new ExampleClass(
            data['uuid'],
            data['transaction_counter'],
        )
    }
}
