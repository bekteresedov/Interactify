import { Response } from "express"
import { IResponse } from "../../interfaces/share/IResponse"

export class ShareResponse<T> {
    public content: T
    public message: string
    constructor(content: T, message: string) {
        this.content = content
        this.message = message
    }

    success(response: Response) {
        return response.status(200).json({
            success: true,
            content: this.content,
            message: this.message ?? "The operation was completed successfully"
        })
    }

    created(response: Response<IResponse<T>>) {
        return response.status(201).json({
            success: true,
            content: this.content,
            message: this.message ?? "The operation was completed successfully"
        })
    }

    error500(response: Response<IResponse<T>>) {
        return response.status(500).json({
            success: false,
            content: this.content,
            message: this.message ?? "İşlem Başarısız !"
        })
    }

    error400(response: Response<IResponse<T>>) {
        return response.status(400).json({
            success: false,
            content: this.content,
            message: this.message ?? "İşlem Başarısız !"
        })
    }

    error401(response: Response<IResponse<T>>) {
        return response.status(401).json({
            success: false,
            content: this.content,
            message: this.message ?? "Lütfen Oturum Açın !"
        })
    }

    error404(response: Response<IResponse<T>>) {
        return response.status(404).json({
            success: false,
            content: this.content,
            message: this.message ?? "İşlem Başarısız !"
        })
    }

    error429(response: Response<IResponse<T>>) {
        return response.status(429).json({
            success: false,
            content: this.content,
            message: this.message ?? "Çok Fazla İstek Atıldı !"
        })
    }

}
