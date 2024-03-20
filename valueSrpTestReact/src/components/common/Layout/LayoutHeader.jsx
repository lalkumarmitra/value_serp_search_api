import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeLayoutMode, changeSideBar } from "../../../features/Layout/layoutSlice";
import { setPreloader } from "../../../features/Ui/uiSlice";
import { authenticate } from "../../../features/Auth/authSlice";
import SimpleBar from "simplebar-react";
import axios from "axios";
import Swal from "sweetalert2";
import { get } from "../../../helper/api_helper";
import { swal } from "../../../helper/swal";
import { setResult } from "../../../features/Search/searchSlice";

function LayoutHeader() { 
  const dispatch = useDispatch()
  const ToggleLayoutMode = () => {
    dispatch(changeLayoutMode('toggle'));
  }
  const layoutStates = useSelector(state=>state.layout);
  const handleSidebar = () => {
    if(layoutStates.screenSize === 'md'){
      if(layoutStates.sidebarSize == 'sm') dispatch(changeSideBar('lg'))
      else dispatch(changeSideBar('sm'));
    }
    if(layoutStates.screenSize === 'sm'){
      if(document.getElementsByTagName('body')[0].classList.contains('vertical-sidebar-enable'))
      document.getElementsByTagName('body')[0].classList.remove('vertical-sidebar-enable')
      else document.getElementsByTagName('body')[0].classList.add('vertical-sidebar-enable')
    }
    if(layoutStates.screenSize === 'lg'){
      if(layoutStates.sidebarSize === 'lg') dispatch(changeSideBar('sm'))
      else dispatch(changeSideBar('lg'))
    }
  }
  const authToken = useSelector(state=>state.auth._token);
  const userData = useSelector(state=>state.auth._user);
  const handleLogout = () =>{
    dispatch(setPreloader({loader:true,message:'Logging Out Please Wait ....'}))
    axios({ 
      url: "https://skicst.org/itest/system/api/logout", 
      method: "GET",
      headers: { Accept: "application/json",Authorization:'Bearer '+ authToken},
    }).then(()=>{
      localStorage.removeItem('_token');
      dispatch(authenticate({_token:null,_user:{}}))
      dispatch(setPreloader({loader:false,message:''}))
    })
    .catch(err=>{
      dispatch(setPreloader({loader:false,message:''}))
      Swal.fire({
        title: "error",
        text: err.response ? err.response.data.message : err.message,
        icon: "error",
        confirmButtonClass: "btn btn-primary w-xs mt-2",
        showCloseButton: !0,
      });
    });
  }
  const [searchText,setSearchText] = useState('');
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };
  const handleSearch = e => {
    if(searchText){
      dispatch(setPreloader({loader:true,message:'Searching Please Wait ....'}))
      const params = {api_key: "demo",location: "New Delhi,India",q: searchText}
      get('https://api.valueserp.com/search', { params })
      .then(r => dispatch(setResult({searchText:searchText,searchResult:r})))
      .catch(e => swal.error(e.response?e.response.data.request_info.message:e.message))
      .finally(()=>dispatch(setPreloader({loader:false,message:''})))
    }
  };
  const debouncedHandleSearch = useCallback(debounce(handleSearch, 500), []);
  return (
    <header id="page-topbar">
      <div className="layout-width">
        <div className="navbar-header">
          <div className="d-flex">
            <button onClick={handleSidebar} type="button" className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger" id="topnav-hamburger-icon">
              <span className={(layoutStates.screenSize === 'sm' || layoutStates.sidebarSize === 'sm' ) ? `hamburger-icon open`:`hamburger-icon`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>

            <form onSubmit={(e)=>e.preventDefault()} className="app-search d-none d-md-block">
              <div className="position-relative">
                <input value={searchText} type="text" onChange={e=>setSearchText(e.target.value)} className="form-control" placeholder="Search..." id="search-options"/>
                <span className="mdi mdi-magnify search-widget-icon"></span>
                <span className="mdi mdi-close-circle search-widget-icon search-widget-icon-close d-none" id="search-close-options"></span>
              </div>
            </form>
            <div className="align-items-center justify-content-center ms-2 d-none d-md-flex">
              <button onClick={handleSearch} className="btn btn-soft-dark px-3"><span className="mdi mdi-magnify search-widget-icon"></span></button>
            </div>
          </div>

          <div className="d-flex align-items-center">

            <div className="ms-1 header-item d-sm-flex">
              <button onClick={ToggleLayoutMode} type="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle light-dark-mode">
                <i className="bx bx-moon fs-22"></i>
              </button>
            </div>

            <div className="dropdown ms-sm-3 header-item topbar-user">
              <button type="button" className="btn" id="page-header-user-dropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span className="d-flex align-items-center">
                  <img className="rounded-circle header-profile-user" src={`https://skicst.org/backend/assets/images/users/avatar/h2e8mlUWxkOQLmqhEX3RvTl1OqMKDRFU1wvU9dgo.jpg`} alt="Header Avatar"/>
                  <span className="text-start ms-xl-2">
                    <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                      {userData.name}
                    </span>
                    <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                      {userData.email}
                    </span>
                  </span>
                </span>
              </button>
              <div className="dropdown-menu dropdown-menu-end">
                <h6 className="dropdown-header">Welcome {userData.name}</h6>
                
                <a className="dropdown-item" href="pages-profile-settings.html">
                  <i className="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i>
                  <span className="align-middle">Settings</span>
                </a>
                <button onClick={handleLogout} className="dropdown-item">
                  <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
                  <span className="align-middle" data-key="t-logout">
                    Logout
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default LayoutHeader;
