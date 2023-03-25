/**
 * This runs a sequence of asynchronous functions, one after the other.
 * @param {*} items
 * @param {*} consumer
 * @returns
 */
export default function sequence(
  items: string[],
  consumer: (item: string, index: number) => Promise<string>,
) {
    const results: string[] = [];
    const iterator = items.values();
    let index = 0;
    const runner = (): Promise<string[]> => {
        const item = iterator.next().value;
        if (item) {
            index++;
            return consumer(item, index)
                .then(result => {
                    results.push(result);
                })
                .then(runner);
        }
        return Promise.resolve(results);
    };
    return runner();
};
