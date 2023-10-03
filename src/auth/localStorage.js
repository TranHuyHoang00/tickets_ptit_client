
const GetLocalStorage = (value) => {
    let data = JSON.parse(window.localStorage.getItem(`${value}`));
    return data
}
const RemoveLocal_AcountDB = () => {
    localStorage.removeItem(`${process.env.REACT_APP_LOCALHOST_ACOUNT_DB}`);
    return true
}
const GetLocal_AcountDB = () => {
    let data = JSON.parse(window.localStorage.getItem(`${process.env.REACT_APP_LOCALHOST_ACOUNT_DB}`));
    return data
}
const GetLocal_Token = () => {
    let data = JSON.parse(window.localStorage.getItem(`${process.env.REACT_APP_LOCALHOST_ACOUNT_DB}`));
    if (data && data.data && data.data.access) {
        return data.data.access
    } else {
        return null
    }
}
export {
    GetLocalStorage, RemoveLocal_AcountDB, GetLocal_AcountDB, GetLocal_Token
}