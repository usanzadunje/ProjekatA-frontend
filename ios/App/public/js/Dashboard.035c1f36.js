(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["Dashboard"],{"0f94":function(t,e,n){"use strict";var i=n("7a23"),c={class:"flex align-middle"},a={class:"sliding-filter-title uppercase"};function r(t,e,n,r,o,s){var l=Object(i["z"])("ion-icon");return Object(i["r"])(),Object(i["e"])("div",c,[Object(i["h"])(l,{icon:t.icon,class:"mr-1 text-gray-400"},null,8,["icon"]),Object(i["h"])("span",a,Object(i["B"])(t.title),1)])}var o=n("d867"),s=n("ff79"),l=Object(i["i"])({name:"FilterCategoryHeading",components:{IonIcon:o["i"]},props:{title:{type:String,default:"Rezultati pretrage"},icon:{type:String,default:s["F"]}},setup:function(){return{pieChart:s["F"]}}});l.render=r;e["a"]=l},1007:function(t,e,n){"use strict";n("7ad7")},"2b9d":function(t,e,n){},4313:function(t,e,n){"use strict";n("5f14")},"5aaa":function(t,e,n){"use strict";n("99af");var i=n("fce9");e["a"]={index:function(){return i["a"].get("/cafes")},getCafeCardsChunkInfo:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:20,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",c=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"name",a=arguments.length>4&&void 0!==arguments[4]&&arguments[4];return i["a"].get("/cafes/chunked/start/number-of-cafes/".concat(t,"/").concat(e),{params:{filter:n,sortBy:c,getAllColumns:a}})},show:function(t){return i["a"].get("/cafes/".concat(t),{params:{getAllColumns:!0}})},subscribe:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;return e?i["a"].post("/users/subscribe/cafe/".concat(t,"/notify-in-next/").concat(e)):i["a"].post("/users/subscribe/cafe/".concat(t,"/notify-in-next/"))},unsubscribe:function(t){return i["a"].post("/users/unsubscribe/cafe/".concat(t))},isUserSubscribed:function(t){return i["a"].post("/users/subscribed/cafe/".concat(t))},getAllCafesUserSubscribedTo:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"name";return i["a"].get("/users/cafes/subscriptions",{params:{sortBy:t}})}}},"5f14":function(t,e,n){},"7ad7":function(t,e,n){},"8a67":function(t,e,n){"use strict";n("b0c0");var i=n("7a23"),c=Object(i["L"])("data-v-822cf034");Object(i["u"])("data-v-822cf034");var a={class:"bg-white cafe-card-border-radius"},r={class:"p-5 flex justify-start ion-align-items-center"},o=Object(i["h"])("img",{src:"http://192.168.1.203:8200/storage/img/cafe/test.png",alt:"",class:"cafe-card-image"},null,-1),s={class:"ml-3.5"},l={class:"cafe-card-name"},u=Object(i["h"])("p",{class:"cafe-card-fade-text"},"Kafic, hrana, basta ...",-1),f=Object(i["h"])("hr",{class:"card-horizontal-ruler"},null,-1),d={class:"p-3 flex justify-between ion-align-items-center"},b={class:"flex align-middle"},O={class:"flex align-bottom"},h={class:"cafe-card-fade-text ml-1 mt-0.5"},j={class:"flex align-bottom ml-2"},p=Object(i["h"])("span",{class:"cafe-card-fade-text ml-1 mt-0.5"},"600m",-1);Object(i["s"])();var g=c((function(t,e,n,c,g,v){var m=Object(i["z"])("ion-icon");return Object(i["r"])(),Object(i["e"])("div",a,[Object(i["h"])("div",r,[o,Object(i["h"])("div",s,[Object(i["h"])("h2",l,Object(i["B"])(t.cafe.name),1),u])]),f,Object(i["h"])("div",d,[Object(i["h"])("div",b,[Object(i["h"])("div",O,[Object(i["h"])(m,{icon:t.pieChart,class:"text-yellow-400"},null,8,["icon"]),Object(i["h"])("span",h,Object(i["B"])(t.cafe.taken_capacity),1)]),Object(i["h"])("div",j,[Object(i["h"])(m,{icon:t.locationOutline,class:"text-gray-400"},null,8,["icon"]),p])]),Object(i["h"])("div",null,[Object(i["h"])(m,{icon:t.fastFoodOutline},null,8,["icon"]),Object(i["h"])(m,{icon:t.leafOutline,class:"ml-1"},null,8,["icon"])])])])})),v=n("d867"),m=n("ff79"),C=Object(i["i"])({name:"CafeCard",components:{IonIcon:v["i"]},props:{cafe:{type:Object,default:null}},setup:function(){return{locationOutline:m["r"],pieChart:m["F"],fastFoodOutline:m["n"],leafOutline:m["q"]}}});C.render=g,C.__scopeId="data-v-822cf034";e["a"]=C},"99af":function(t,e,n){"use strict";var i=n("23e7"),c=n("d039"),a=n("e8b5"),r=n("861d"),o=n("7b0b"),s=n("50c4"),l=n("8418"),u=n("65f0"),f=n("1dde"),d=n("b622"),b=n("2d00"),O=d("isConcatSpreadable"),h=9007199254740991,j="Maximum allowed index exceeded",p=b>=51||!c((function(){var t=[];return t[O]=!1,t.concat()[0]!==t})),g=f("concat"),v=function(t){if(!r(t))return!1;var e=t[O];return void 0!==e?!!e:a(t)},m=!p||!g;i({target:"Array",proto:!0,forced:m},{concat:function(t){var e,n,i,c,a,r=o(this),f=u(r,0),d=0;for(e=-1,i=arguments.length;e<i;e++)if(a=-1===e?r:arguments[e],v(a)){if(c=s(a.length),d+c>h)throw TypeError(j);for(n=0;n<c;n++,d++)n in a&&l(f,d,a[n])}else{if(d>=h)throw TypeError(j);l(f,d++,a)}return f.length=d,f}})},"9ef8":function(t,e,n){"use strict";var i=n("7a23"),c=Object(i["L"])("data-v-36e603de");Object(i["u"])("data-v-36e603de");var a={class:"px-4 py-3"},r={key:0,class:"sliding-filter-title uppercase"},o=Object(i["g"])(" Najblizi vama "),s=Object(i["g"])(" SLOBODNI "),l=Object(i["g"])(" HRANA "),u=Object(i["g"])(" POPULARNO ");Object(i["s"])();var f=c((function(t,e,n,f,d,b){var O=Object(i["z"])("ion-icon"),h=Object(i["z"])("ion-button"),j=Object(i["z"])("ion-slide"),p=Object(i["z"])("ion-slides");return Object(i["r"])(),Object(i["e"])("div",a,[t.hasTitle?(Object(i["r"])(),Object(i["e"])("p",r,"FILTERI")):Object(i["f"])("",!0),Object(i["h"])(p,{options:t.slideOpts},{default:c((function(){return[Object(i["h"])(j,null,{default:c((function(){return[Object(i["h"])(h,{class:["sliding-filter-button sliding-filter-button-text h-9 w-32 uppercase",""===t.activeSlidingButton?"sliding-filter-button-active":"sliding-filter-button-inactive"],"data-sliding-filter":"closest",onClick:t.sortButtonActivated},{default:c((function(){return[o,Object(i["h"])(O,{slot:"start",icon:t.locationOutline},null,8,["icon"])]})),_:1},8,["class","onClick"])]})),_:1}),Object(i["h"])(j,null,{default:c((function(){return[Object(i["h"])(h,{class:["sliding-filter-button sliding-filter-button-text h-9 w-28 uppercase","free"===t.activeSlidingButton?"sliding-filter-button-active":"sliding-filter-button-inactive"],"data-sliding-filter":"free",onClick:t.sortButtonActivated},{default:c((function(){return[s,Object(i["h"])(O,{slot:"start",icon:t.pieChart},null,8,["icon"])]})),_:1},8,["class","onClick"])]})),_:1}),Object(i["h"])(j,null,{default:c((function(){return[Object(i["h"])(h,{class:["sliding-filter-button sliding-filter-button-text h-9 w-20 uppercase","food"===t.activeSlidingButton?"sliding-filter-button-active":"sliding-filter-button-inactive"],"data-sliding-filter":"id",onClick:t.sortButtonActivated},{default:c((function(){return[l,Object(i["h"])(O,{slot:"start",icon:t.pieChart},null,8,["icon"])]})),_:1},8,["class","onClick"])]})),_:1}),Object(i["h"])(j,null,{default:c((function(){return[Object(i["h"])(h,{class:["sliding-filter-button sliding-filter-button-text h-9 w-28 uppercase","popular"===t.activeSlidingButton?"sliding-filter-button-active":"sliding-filter-button-inactive"],"data-sliding-filter":"popular",onClick:t.sortButtonActivated},{default:c((function(){return[u,Object(i["h"])(O,{slot:"start",icon:t.pieChart},null,8,["icon"])]})),_:1},8,["class","onClick"])]})),_:1})]})),_:1},8,["options"])])})),d=n("d867"),b=n("ff79"),O=Object(i["i"])({name:"SlidingFilter",components:{IonIcon:d["i"],IonButton:d["b"],IonSlides:d["A"],IonSlide:d["z"]},props:{hasTitle:Boolean},emits:["sortHasChanged"],setup:function(t,e){var n=e.emit,c=Object(i["w"])(""),a={initialSlide:0,speed:500,centeredSlides:!1,slidesPerView:2.3};Object(i["p"])((function(){var t=document.querySelector("ion-slides");Object(i["m"])((function(){t.options=a}))}));var r=function(t){c.value=t.target.dataset.slidingFilter,n("sortHasChanged",c.value)};return{activeSlidingButton:c,slideOpts:a,sortButtonActivated:r,locationOutline:b["r"],pieChart:b["F"]}}});n("ab52");O.render=f,O.__scopeId="data-v-36e603de";e["a"]=O},ab52:function(t,e,n){"use strict";n("2b9d")},dc3f:function(t,e,n){"use strict";n.r(e);var i=n("7a23"),c=Object(i["L"])("data-v-5439f4fd");Object(i["u"])("data-v-5439f4fd");var a={class:"px-5 mt-2"};Object(i["s"])();var r=c((function(t,e,n,r,o,s){var l=Object(i["z"])("UserProfileHeader"),u=Object(i["z"])("SlidingFilter"),f=Object(i["z"])("FilterCategoryHeading"),d=Object(i["z"])("CafeCard"),b=Object(i["z"])("ion-item"),O=Object(i["z"])("ion-icon"),h=Object(i["z"])("ion-item-option"),j=Object(i["z"])("ion-item-options"),p=Object(i["z"])("ion-item-sliding"),g=Object(i["z"])("ion-content"),v=Object(i["z"])("ion-page");return Object(i["r"])(),Object(i["e"])(v,null,{default:c((function(){return[Object(i["h"])(l),Object(i["h"])(g,null,{default:c((function(){return[Object(i["h"])(u,{class:"mt-2",onSortHasChanged:t.sortHasChanged},null,8,["onSortHasChanged"]),Object(i["h"])("div",a,[Object(i["h"])(f,{title:"Kafici koje pratim",class:"mb-2"}),(Object(i["r"])(!0),Object(i["e"])(i["a"],null,Object(i["x"])(t.cafesUserSubscribedTo,(function(e){return Object(i["r"])(),Object(i["e"])(p,{key:e.id,class:"ion-no-padding mb-5"},{default:c((function(){return[Object(i["h"])(b,{class:"ion-no-padding ion-no-margin"},{default:c((function(){return[Object(i["h"])(d,{cafe:e,class:"w-full"},null,8,["cafe"])]})),_:2},1024),Object(i["h"])(j,{side:"end"},{default:c((function(){return[Object(i["h"])(h,{type:"button",onClick:function(n){return t.showAlert(e.id)}},{default:c((function(){return[Object(i["h"])(O,{slot:"icon-only",icon:t.trashOutline,class:"text-2xl"},null,8,["icon"])]})),_:2},1032,["onClick"])]})),_:2},1024)]})),_:2},1024)})),128))])]})),_:1})]})),_:1})})),o=n("1da1"),s=n("5530"),l=(n("4de4"),n("96cf"),n("5502")),u=n("d867"),f=Object(i["L"])("data-v-6983a999");Object(i["u"])("data-v-6983a999");var d={class:"px-4 py-3 mt-3 mb-3"},b={class:"flex justify-between"},O=Object(i["h"])("p",{class:"user-profile-header-heading mt-1"},"Profil",-1),h={class:"mt-5 flex justify-start"},j=Object(i["h"])("div",null,[Object(i["h"])("img",{src:"http://192.168.1.203:8200/storage/img/user/profile-test.png",alt:"Profile picture of user {{ authUser.full_name }}",class:"user-profile-picture"})],-1),p={class:"ml-3 mt-3"},g={class:"user-profile-user-name"},v=Object(i["h"])("p",{class:"user-profile-user-location"},"Srbija, Nis",-1);Object(i["s"])();var m=f((function(t,e,n,c,a,r){var o=Object(i["z"])("ion-icon"),s=Object(i["z"])("ion-button"),l=Object(i["z"])("ion-toolbar"),u=Object(i["z"])("ion-header");return Object(i["r"])(),Object(i["e"])(u,{class:"ion-no-border"},{default:f((function(){return[Object(i["h"])(l,null,{default:f((function(){return[Object(i["h"])("div",d,[Object(i["h"])("div",b,[O,Object(i["h"])(s,{fill:"clear",onClick:e[1]||(e[1]=function(e){return t.$router.push({name:"settings"})})},{default:f((function(){return[Object(i["h"])(o,{slot:"icon-only",icon:t.settingsOutline,class:"text-white"},null,8,["icon"])]})),_:1})]),Object(i["h"])("div",h,[j,Object(i["h"])("div",p,[Object(i["h"])("h2",g,Object(i["B"])(t.authUser.full_name),1),v])])])]})),_:1})]})),_:1})})),C=n("ff79"),x=Object(i["i"])({name:"UserProfileHeader",components:{IonIcon:u["i"],IonHeader:u["h"],IonToolbar:u["I"],IonButton:u["b"]},computed:Object(s["a"])({},Object(l["b"])("auth",["authUser"])),emits:["searchFilterChanged"],setup:function(t,e){var n=e.emit,i=function(t){n("searchFilterChanged",t.target.value)};return{searchInputChanged:i,settingsOutline:C["L"]}}});n("1007");x.render=m,x.__scopeId="data-v-6983a999";var I=x,y=n("9ef8"),w=n("0f94"),_=n("8a67"),S=n("5aaa"),z=Object(i["i"])({name:"Dashboard",components:{IonContent:u["f"],IonPage:u["s"],IonItemSliding:u["p"],IonItem:u["m"],IonItemOptions:u["o"],IonItemOption:u["n"],IonIcon:u["i"],UserProfileHeader:I,SlidingFilter:y["a"],FilterCategoryHeading:w["a"],CafeCard:_["a"]},computed:Object(s["a"])({},Object(l["b"])("auth",["authUser"])),ionViewDidEnter:function(){var t=this;S["a"].getAllCafesUserSubscribedTo(this.sortBy).then((function(e){t.cafesUserSubscribedTo=e.data})).catch((function(t){return alert(t)}))},setup:function(){var t=Object(i["w"])([]),e=Object(i["w"])("name"),n=function(n){e.value=n,S["a"].getAllCafesUserSubscribedTo(n).then((function(e){t.value=e.data})).catch((function(t){return alert(t)}))},c=function(){var t=Object(o["a"])(regeneratorRuntime.mark((function t(e){var n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,u["K"].create({header:"Unsubscribing from cafe",message:"Are you sure you want to delete cafe from subscription list?",buttons:[{text:"Disagree",role:"cancel"},{text:"Agree",handler:function(){a(e)}}]});case 2:return n=t.sent,t.next=5,n.present();case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),a=function(e){S["a"].unsubscribe(e).then((function(n){n.data&&(t.value=t.value.filter((function(t){return t.id!==e})))})).catch((function(t){return alert(t)}))};return{cafesUserSubscribedTo:t,sortBy:e,sortHasChanged:n,showAlert:c,trashOutline:C["N"]}}});n("4313");z.render=r,z.__scopeId="data-v-5439f4fd";e["default"]=z},fce9:function(t,e,n){"use strict";n.d(e,"a",(function(){return r}));n("caad"),n("d3b7");var i=n("bc3a"),c=n.n(i),a=n("4360"),r=c.a.create({baseURL:"http://192.168.1.203:8200/api",withCredentials:!0});r.interceptors.response.use((function(t){return t}),(function(t){return t.response&&[401,419].includes(t.response.status)&&a["a"].getters["auth/authUser"]&&a["a"].dispatch("auth/logout"),Promise.reject(t)}))}}]);
//# sourceMappingURL=Dashboard.035c1f36.js.map