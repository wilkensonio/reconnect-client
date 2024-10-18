const HandleError = (error) => {
    const response = error.response;
    if (response && response.status === 401) {
        localStorage.removeItem('reconnect_access_token');
        localStorage.removeItem('reconnect_token_type');
        window.location.href = '/signin?message=Session expired. Please sign in again.';
    } else {
        console.error("api/studentService", response);
        return response;
    }
};

export { HandleError };