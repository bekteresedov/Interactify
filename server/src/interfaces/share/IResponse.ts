export interface IResponse<T> {
    success: Boolean;
    content?: T;
    message: String | String[];
}