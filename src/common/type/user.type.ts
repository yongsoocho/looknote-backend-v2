export type JwtUserType = any;

export const UserSelect = {
  user_id: true,
  email: true,
  name: true,
  nickname: true,
  date_of_birth: true,
  gender: true,
  provider: true,
  created_at: true,
  active: true,
  coin: true,
};

export const SnsUserResponse = {
  user: {
    user_id: 0,
    email: '',
    name: '',
    nickname: '',
    date_of_birth: 0,
    gender: '',
    provider: '',
    active: true,
    created_at: '',
    coin: {
      coin_id: 0,
      coin: 0,
      coin_sum: 0,
      updated_at: '',
    },
  },
  access_token: '',
};

export interface decodedAppleIdToken {
  // "https://appleid.apple.com"
  iss: string;
  // 'co.kr.looknote'
  aud: string;
  exp: number;
  iat: number;
  // '001949.936beb516a9347f8921ec9985663a98f.0557'
  sub: string;
  // 'dtYA8neQH6aDyQZKU0zfWA';
  c_hash: string;
  email: string;
  // 'true'
  email_verified: string;
  auth_time: number;
  // true
  nonce_supported: boolean;
}
