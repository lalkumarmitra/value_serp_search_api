<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthenticationController extends Controller
{
    public function login(Request $request)
    {
        try {
            Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required',
            ])->validate();
            if (Auth::attempt($request->only('email', 'password'))) {
                $user = User::find(Auth::user()->id);
                $response['message'] = 'Logged in Successfully';
                $response['_token'] =  $user->createToken('apiToken')->accessToken;
                $response['data']['user'] =  $user;
                $status = true;
                $status_code = 200;
            } else throw new Exception('Invalid Credentials', 401);
        } catch (\Illuminate\Validation\ValidationException $e) {
            $response['message'] = $e->getMessage();
            $response['errors'] = $this->handle_error_message($e->validator->errors()->toArray());
            $status = false;
            $status_code = 422;
        } catch (Exception $e) {
            $response['message'] = ($e instanceof \Illuminate\Database\QueryException) ? 'Internal Processing Error' : $e->getMessage();
            $response['error'] = $this->handle_error_message($e->getMessage());
            $status = false;
            $status_code = (in_array($e->getCode(), $this->http_rc)) ? $e->getCode() : 500;
        }
        return $this->build_response($status, $response, $status_code);
    }
    public function logout(){
        $user = Auth::guard('api')->user();
        $token = $user->token();
        if ($token) {
            $token->revoke();
            $response['message'] = 'logged out successfully';
            return $this->build_response(true, $response, 200);
        }
        $response['message'] = 'unable to logout';
        $response['data'] = [$token,'token'];
        return $this->build_response(true,$response,500);
    }
    public function validate_token(){
        $response['data']=['user'=>Auth::user()];
        $response['message'] = 'authenticated';
        $status = true;
        $status_code = 200;
        return $this->build_response($status, $response, $status_code);
    }
}
