export interface Account {
    id: number;
    userName: string;
    password: string;
    nickName: string;
    avatar: string;
    email: string;
    phoneNumber: string;
    openIdQQ: string;
    openIdWechat: string;
    createTime: Date;
}

export interface AccountState {
    token: string|null;
    accountInfo: Account|null;
}