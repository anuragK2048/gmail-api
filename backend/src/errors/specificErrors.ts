import { ApiError } from "./apiError";

export class NotFoundError extends ApiError {
  constructor(displayMessage: string, errorCode?: string) {
    super(displayMessage, 404, true, errorCode);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
