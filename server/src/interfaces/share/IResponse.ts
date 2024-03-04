export interface IResponse<T> {
    success: boolean;
    content?: T;
    message: string | string[];
}