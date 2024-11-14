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
}

export interface AccountState {
    token: string|null;
    accountInfo: Account|null;
}