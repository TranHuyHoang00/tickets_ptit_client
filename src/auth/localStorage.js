
const GetLocalStorage = (value) => {
    let data = JSON.parse(window.localStorage.getItem(`${value}`));
    return data
}
const RemoveLocalStorage = (value) => {
    localStorage.removeItem(`${value}`);
    return true
}
export {
    GetLocalStorage, RemoveLocalStorage
}