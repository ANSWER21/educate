// 请求响应参数（不包含data）
export interface Result {
    code: string;
    msg: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
    data: T;
}

// 分页请求参数
export interface ReqPage {
    pageNum: number;
    pageSize: number;
}

// 分页数据
export class PageInfo<T> {
    total: number;
    list: T[];
    pageNum: number;
    pageSize: number;
    size: number;
    startRow: number;
    endRow: number;
    pages: number;
    prePage: number;
    nextPage: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    navigatePages: number;
    navigatepageNums: number[];
    navigateFirstPage: number;
    navigateLastPage: number;

    constructor(
        total: number,
        list: T[],
        pageNum: number,
        pageSize: number,
        size: number,
        startRow: number,
        endRow: number,
        pages: number,
        prePage: number,
        nextPage: number,
        isFirstPage: boolean,
        isLastPage: boolean,
        hasPreviousPage: boolean,
        hasNextPage: boolean,
        navigatePages: number,
        navigatepageNums: number[],
        navigateFirstPage: number,
        navigateLastPage: number
    ) {
        this.total = total;
        this.list = list;
        this.pageNum = pageNum;
        this.pageSize = pageSize;
        this.size = size;
        this.startRow = startRow;
        this.endRow = endRow;
        this.pages = pages;
        this.prePage = prePage;
        this.nextPage = nextPage;
        this.isFirstPage = isFirstPage;
        this.isLastPage = isLastPage;
        this.hasPreviousPage = hasPreviousPage;
        this.hasNextPage = hasNextPage;
        this.navigatePages = navigatePages;
        this.navigatepageNums = navigatepageNums;
        this.navigateFirstPage = navigateFirstPage;
        this.navigateLastPage = navigateLastPage;
    }
}