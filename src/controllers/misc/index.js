// eslint-disable-next-line import/prefer-default-export
export const notFound = {
  path: '/{any*}',
  method: '*',
  options: {
    auth: false,
  },
  handler(request, h) {
    return h
      .response({
        message: 'Welcome to sms management application',
        nextStep: 'check our docs at /documentation to get started.',
        status: 'Not found',
      })
      .code(404);
  },
};
