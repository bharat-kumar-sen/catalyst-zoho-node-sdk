exports.authHandler = (msgType) => {
  const msgs = {
    TOKEN_REQUIRED: 'Authentication token is required.',
    TOKEN_INVALID: 'Invalid authentication token passed.',
    TOKEN_EXPIRED: 'Your Session is expired, Kindly Login again.'
  };

  return msgs[msgType];
};