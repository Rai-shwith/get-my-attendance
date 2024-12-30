// Handles Local Storage Operations
export const IsLoggedIn = () => {
    const user = localStorage.getItem('user');
    if (user) {
        return true;
    }
    return false;
}

export const Login = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
}

export const Logout = () => {
    localStorage.removeItem('user');
}

