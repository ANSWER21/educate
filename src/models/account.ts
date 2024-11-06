export interface Account {
    id: number;
    username: string;
    password: string;
    nickname: string;
}

export interface AccountState {
    token: string|null;
    accountInfo: Account|null;
}