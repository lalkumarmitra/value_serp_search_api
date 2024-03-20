<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthenticationController;
use App\Http\Controllers\SetupController;



Route::post('/login',[AuthenticationController::class,'login']);
Route::get('/setup/admin',[SetupController::class,'setupAdmin']);

Route::group(['middleware'=>'auth:api'],function(){
    Route::get('/validate',[AuthenticationController::class,'validate_token']);
    Route::get('/logout',[AuthenticationController::class,'logout']);
    Route::get('/search/{query}',[SetupController::class,'search']);
});
