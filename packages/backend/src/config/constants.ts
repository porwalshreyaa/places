export const CONSTANTS = {
  HTTP: {
    PORT: 3000,
  },
  AUTH: {
    TOKEN_EXPIRES_IN: '7d',
    BCRYPT_SALT_ROUNDS: 10,
    COOKIE_NAME: 'ghoomi_token',
    COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  UPLOAD: {
    MAX_FILE_SIZE_MB: 200,
    RESIZE_MAX_WIDTH: 1920,
    WEBP_QUALITY: 80,
    AVIF_QUALITY: 65,
    ENCODE_EFFORT: 4,
  }
};
