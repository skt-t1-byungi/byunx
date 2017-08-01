export interface OperateNextStream {
    addChildren(children: OperateNextStream): void;

    operateNext(value?: any): void;
}

