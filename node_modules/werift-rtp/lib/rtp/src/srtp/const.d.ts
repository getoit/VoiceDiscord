export declare const ProtectionProfileAes128CmHmacSha1_80: 1;
export declare const ProtectionProfileAeadAes128Gcm: 7;
export declare const Profiles: readonly [1, 7];
export type Profile = (typeof Profiles)[number];
export declare const keyLength: (profile: Profile) => number;
export declare const saltLength: (profile: Profile) => 14 | 12;
