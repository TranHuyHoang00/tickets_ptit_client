// DB
const Remove_Local_Acount_DB = () => {
    localStorage.removeItem(`${process.env.REACT_APP_LOCALHOST_ACOUNT_DB}`);
    return true
}
const Get_Local_Acount_DB = () => {
    let data = JSON.parse(window.localStorage.getItem(`${process.env.REACT_APP_LOCALHOST_ACOUNT_DB}`));
    return data
}
const Set_Local_Acount_DB = (data) => {
    localStorage.setItem(`${process.env.REACT_APP_LOCALHOST_ACOUNT_DB}`, JSON.stringify(
        { data: data }
    ))
}
const Get_Local_Token_Acount_DB = () => {
    let data = JSON.parse(window.localStorage.getItem(`${process.env.REACT_APP_LOCALHOST_ACOUNT_DB}`));
    if (data && data.data && data.data.access) {
        return data.data.access
    } else {
        return null
    }
}
// User
const Remove_Local_Acount_User = () => {
    localStorage.removeItem(`${process.env.REACT_APP_LOCALHOST_ACOUNT_USER}`);
    return true
}
const Get_Local_Acount_User = () => {
    let data = JSON.parse(window.localStorage.getItem(`${process.env.REACT_APP_LOCALHOST_ACOUNT_USER}`));
    return data
}
const Set_Local_Acount_User = (data) => {
    localStorage.setItem(`${process.env.REACT_APP_LOCALHOST_ACOUNT_USER}`, JSON.stringify(
        { data: data }
    ))
}
const Get_Local_Token_Acount_User = () => {
    let data = JSON.parse(window.localStorage.getItem(`${process.env.REACT_APP_LOCALHOST_ACOUNT_USER}`));
    if (data && data.data && data.data.access) {
        return data.data.access
    } else {
        return null
    }
}
export {
    Remove_Local_Acount_DB, Get_Local_Acount_DB, Set_Local_Acount_DB, Get_Local_Token_Acount_DB,
    Remove_Local_Acount_User, Get_Local_Acount_User, Set_Local_Acount_User, Get_Local_Token_Acount_User,
}