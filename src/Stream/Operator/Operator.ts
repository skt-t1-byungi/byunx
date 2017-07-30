export interface OperatorResult {
    done: boolean,
    value: any,
    pass: boolean
}

export interface Operator {
    operate(value: any): OperatorResult;
}