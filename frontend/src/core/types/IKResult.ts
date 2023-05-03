export interface IKResult<T> {
    succeeded: boolean,
    eRRORs: IKResultError[],
    result: T
}


export interface IKResultError {
    code: String,
    description: String
}