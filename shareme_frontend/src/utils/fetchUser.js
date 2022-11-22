export const fetchUser = () => {
    const userInfo = sessionStorage.getItem("user") !== "undefined" ? JSON.parse(sessionStorage.getItem("user")) : sessionStorage.clear();
    console.log(userInfo)

    return userInfo
}
