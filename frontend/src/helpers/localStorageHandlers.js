export const setUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
}

export const removeUser = () => {
    localStorage.removeItem('user');
}

export const getUser = () => {
    return JSON.parse(localStorage.getItem('user'));
}