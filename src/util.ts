export function deepcopy<T extends object>(data: T): T {
    return JSON.parse(JSON.stringify(data));
}

export function deepfreeze<T extends object>(o: T): T {
    Object.freeze(o);

    for (let propKey in o) {
        const prop = o[propKey];
        if (!o.hasOwnProperty(propKey) || !(typeof prop === 'object') || Object.isFrozen(prop)) {
            continue;
        }
        deepfreeze(prop);
    }

    return o;
}

export function object_get(object: object, expression: string, defaultValue: any = null) {
    return expression
        .split('.')
        .reduce(function (prev: any, curr: string) {
            const arr: string[] | null = curr.match(/(.*?)\[(.*?)\]/);

            if (arr) {
                return prev && prev[arr[1]][arr[2]]
            } else {
                return prev && prev[curr]
            }
        }, object) || defaultValue
}

export function array_remove(arr: any[], ...items: any[]) {
    let what, idx;
    let len = items.length;

    while (len && arr.length) {
        what = items[--len];
        while ((idx = arr.indexOf(what)) !== -1) {
            arr.splice(idx, 1);
        }
    }
}

export function array_last(arr: any[]) {
    return arr[arr.length - 1];
}

export function object_each<T extends object, K extends keyof T>(obj: T, each: (v: any, key: K) => void) {
    Object.keys(obj).forEach((key: K) => {
        if (obj.hasOwnProperty(key)) {
            each(obj[key], key);
        }
    });
}