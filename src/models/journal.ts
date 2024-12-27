export interface Journal {
    id: number | null,
    title: string,
    date: Date,
    thumbnailUrl: string | null,
    fileUrl: string,
    createId: number | null,
    translatedFileUrl: string | null
}