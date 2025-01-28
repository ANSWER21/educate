import http from "@/api/http.ts";
import {Blog, BlogTOC} from "@/models/blog.ts";

export const getBlogTocChildren = (parentId: number | null) => {
    return http.get<BlogTOC[]>(`/api/v1/blog/pri/get/blogToc/children`, {parentId: parentId});
};

export const getBlogByFolderId = (folderId: number | null) => {
    return http.get<Blog[]>(`/api/v1/blog/pri/get/blog/by/folderId`, {folderId: folderId});
};

export const createBlogTOC = (data: BlogTOC) => {
    return http.post<BlogTOC>('/api/v1/blog/pri/create/blogToc', data);
};

export const deleteBlogTOC = (id: number) => {
    return http.get<boolean>('/api/v1/blog/pri/delete/blogToc', {id: id});
};

export const createBlog = (title: string, folderId: number | null) => {
    return http.get<Blog>('/api/v1/blog/pri/create/blog', {title: title, folderId: folderId});
}

export const deleteBlog = (id: number) => {
    return http.get<number>('/api/v1/blog/pri/delete/blog', {id: id});
}