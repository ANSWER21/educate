// 定义“无限制”日期为 TIMESTAMP 支持的最小值
export const UNLIMITED_DATE = new Date('1970-01-01T00:00:01Z');

// 判断是否是“无限制”
export function isUnlimitedDate(date: Date): boolean {
    return date.getTime() === UNLIMITED_DATE.getTime();
}