import {post,get, del,put, use,API_URL} from './api_helper';

export const auth={
    login: data =>post("/login",data),
    validate:()=>get('/validate'),
    search:(data)=>get('/search/'+data)
}



export const ASSET_URL='https://skicst.org/itest/system/'; 