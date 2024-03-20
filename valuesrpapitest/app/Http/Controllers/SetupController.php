<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SetupController extends Controller
{
    public function setupAdmin(){
        return $this->tryCatchWrapper(function(){
            $user = User::create([
                'name'=>'Admin',
                'email'=>'admin@admin.com',
                'password'=>'admin123456',
            ]);
            return [
                'message'=>'admin created',
                'data'=>['admin'=>$user]
            ];
        });
    }

    public function search($query){
        return $this->tryCatchWrapper(function()use($query){
            $queryString = http_build_query([
                'api_key' => 'demo',
                'location' => 'New Delhi,India',
                'q' => $query
            ]);
            $ch = curl_init(sprintf('%s?%s', 'https://api.valueserp.com/search', $queryString));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_TIMEOUT, 180);

            $api_result = json_decode(curl_exec($ch));
            curl_close($ch);
            if(!$api_result->request_info->success) throw new Exception ($api_result->request_info->message,500);


            return [
                'message'=>'Search Results',
                'data'=>['result'=>$api_result]
            ];
        });
    }
}
