export interface Account {
    id: number;
    userName: string;
    password: string | null;
    nickName: string | null;
    avatar: string | null;
    email: string | null;
    phoneNumber: string | null;
    openIdQQ: string | null;
    openIdWechat: string | null;
    createTime: Date;
    role: string;
}

export const ROLE_ADMIN = "admin"
export const ROLE_MEMBER = "member"

export interface AccountState {
    token: string|null;
    accountInfo: Account|null;
}

export interface ResponseLogin {
    account: Account,
    token: string
}