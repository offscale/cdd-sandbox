
export module Util {
    export function isIterable (value) {
        return Symbol.iterator in Object(value);
    }

    export function arrayIncludes(value: any, array: [any]): boolean {
        return (array.indexOf(value) > -1);
    }

    export function pluralise(value: string): string {
        return `${value}s`;
    }
}
