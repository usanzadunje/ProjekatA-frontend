(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0c45c6"],{"3b01":function(e,s,o){"use strict";o.r(s),o.d(s,"FacebookLoginWeb",(function(){return c}));var n=o("1547");class c extends n["b"]{constructor(){super({name:"FacebookLogin",platforms:["web"]})}async login(e){return console.log("FacebookLoginWeb.login",e),new Promise((s,o)=>{FB.login(e=>{console.debug("FB.login",e),"connected"===e.status?s({accessToken:{token:e.authResponse.accessToken}}):o({accessToken:{token:null}})},{scope:e.permissions.join(",")})})}async logout(){return new Promise(e=>{FB.logout(()=>e())})}async getCurrentAccessToken(){return new Promise((e,s)=>{FB.getLoginStatus(o=>{if("connected"===o.status){const s={accessToken:{applicationId:void 0,declinedPermissions:[],expires:void 0,isExpired:void 0,lastRefresh:void 0,permissions:[],token:o.authResponse.accessToken,userId:o.authResponse.userID}};e(s)}else s({accessToken:{token:null}})})})}async getProfile(e){const s=e.fields.join(",");return new Promise((e,o)=>{FB.api("/me",{fields:s},s=>{s.error?o(s.error.message):e(s)})})}}}}]);
//# sourceMappingURL=chunk-2d0c45c6.a16f343b.js.map