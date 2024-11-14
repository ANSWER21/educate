export interface Suggest {
    id: number | null,
    type: string,
    content: string,
    contact: string,
    date: Date,
    status: string,
}

export const TYPE_SUGGESTION = "suggestion"
export const TYPE_BUG = "bug"
export const TYPE_OTHER = "other"

export const STATUS_UN_HANDLE = "un-handle"
export const STATUS_HANDLED = "handled"