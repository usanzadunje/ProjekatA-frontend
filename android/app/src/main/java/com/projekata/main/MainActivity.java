package com.projekata.main;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
     @Override
     public void onCreate(Bundle savedInstanceState) {
         super.onCreate(savedInstanceState);

         registerPlugin(com.getcapacitor.community.facebooklogin.FacebookLogin.class);
     }
}
