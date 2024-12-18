export interface Journal {
    id: number | null,
    title: string,
    date: Date,
    fileUrl: string,
    createId: number | null,
    translatedFileUrl: string | null
}