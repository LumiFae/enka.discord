import {generateRandomCapitalString} from "./misc";

export class UserVerification<K, V> extends Map<K, V> {
    setCode(key: K, value: V) {
        this.set(key, value);
        setTimeout(() => this.delete(key), 300000);
    }
}

type VerificationCode = {
    code: string;
    name: string;
}

export const userVerifCodes = new UserVerification<string, VerificationCode>();

