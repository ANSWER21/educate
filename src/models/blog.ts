export const TYPE_BLOG = 'blog';
export const TYPE_BLOG_TOC = 'blogTOC';

export interface Blog {
    id: number | null,
    title: string,
    thumbnailUrl: string | null,
    content: string,
    folderId: number | null,
    createId: number | null,
    createTime: Date,
    deleteTime: Date | null,
    hasChild: false,
    type: 'blog',
}

export interface BlogTOC {
    id: number | null,
    title: string,
    createTime: Date | null,
    parentId: number | null,
    hasChild: boolean,
    children: any[],
    type: 'blogTOC'
}

