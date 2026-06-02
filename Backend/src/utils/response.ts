export const successResponse = (
  data: unknown,
  message = 'Success',
) => ({
  success: true,
  message,
  data,
});

export const errorResponse = (
  message: string,
) => ({
  success: false,
  message,
});