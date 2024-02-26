export interface IRefreshToken extends Document {
    token: string;
    userId: string;
}