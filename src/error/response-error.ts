export class ResponseError extends Error {
    constructor(public status: number, public message: string) {
        super(message);
        this.name = "ResponseError";
    Object.setPrototypeOf(this, ResponseError.prototype);
        // this.name = "ResponseError";
    }
}