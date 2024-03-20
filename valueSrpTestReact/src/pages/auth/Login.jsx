import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPreloader } from "../../features/Ui/uiSlice";
import { authenticate } from "../../features/Auth/authSlice";
import { swal } from "../../helper/swal";
import { auth } from "../../helper/api_url";


function Login() {
  const dispatch = useDispatch();
  const [passwordShow,setPasswordShow] = useState('password');
  const handleSubmit = (e) => {
    dispatch(setPreloader({loader:true,message:'Logging In please wait'}));
    e.preventDefault();
    let formData = new FormData(e.target);
    auth.login(formData).then((res) => {
      localStorage.setItem('_token',res._token);
      dispatch(authenticate({_token:res._token,_user:res.data.user}))
    })
    .catch((err) => swal.error(err.response ? err.response.data.message : err.message))
    .finally(()=>dispatch(setPreloader({loader:false,message:''})));
  };
  const togglePasswordState =()=>setPasswordShow(p=>p === 'password'?'text':'password');
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center mt-sm-5 mb-4 text-white">
              <p className="mt-3 fs-15 fw-medium ">Value SERP Test</p>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="card mt-4">
              <div className="card-body p-4">
                <div className="text-center mt-2">
                  <h5 className="text-primary">Welcome</h5>
                  <p className="text-muted">Log in to continue .</p>
                  <lord-icon src="https://cdn.lordicon.com/kthelypq.json" trigger="loop" colors="primary:#0ab39c" class="avatar-md" ></lord-icon>
                </div>
                <div className="p-2">
                  <form onSubmit={(e)=>handleSubmit(e)}>
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label"> Email </label>
                      <input type="email" className="form-control" name="email" placeholder="Enter username" />
                    </div>

                    <div className="mb-5">
                      <label className="form-label" htmlFor="password-input"> Password </label>
                      <div className="position-relative auth-pass-inputgroup mb-3">
                        <input type={passwordShow} className="form-control pe-5 password-input" placeholder="Enter password" name="password" />
                        <button  onClick={togglePasswordState} className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon" type="button" id="password-addon" >
                          <i className="ri-eye-fill align-middle"></i>
                        </button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button className="btn btn-success w-100" type="submit"> Log In{" "} </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
