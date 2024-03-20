import Login from "../pages/auth/Login"
import Home from "../pages/public/Home"



export const authenticatedRoutes = [
    {type:'menu',label:'InterView Test',path:'/dashboard',element:<Home/>,icon:'ri-home-8-line',children:[]},
]
export const publicRoutes = [
    
]
export const authRoutes = [
    {label:'Login',path:'/',element:<Login /> ,icon:'null',users:[],children:[]},
    {label:'Login',path:'/login',element:<Login /> ,icon:'null',users:[],children:[]},
]