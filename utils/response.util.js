export const successResponse = (res, message, data = {}) => {
    res.status(200).json({ success: true, message, data });
};

export const errorResponse = (res, message, statusCode = 500) => {
    res.status(statusCode).json({ success: false, message });
};
