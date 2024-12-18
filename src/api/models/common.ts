import http from "@/api/http.ts";

// 删除文件
export const deleteFile = (fileUrl: string) => http.get<boolean>('/api/v1/common/pri/delete/file', {fileUrl: fileUrl})
