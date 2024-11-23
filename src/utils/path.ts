// 工具函数：获取文件名
export function getFileName(url: string): string {
    const fileName = url.substring(url.lastIndexOf('/') + 1);
    return fileName.replace(/_\d+(?=\.pdf$)/, "");
}