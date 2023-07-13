package com.casho.app

import android.content.Intent
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin


@CapacitorPlugin
class WebView : Plugin() {

  @PluginMethod(returnType = PluginMethod.RETURN_CALLBACK)
  open fun show(call: PluginCall) {
    val eventsStr = call.getString("events")
    val myIntent = Intent(bridge.webView.context, WebViewActivity::class.java)
    myIntent.putExtra("events", eventsStr)
    bridge.webView.context.startActivity(myIntent)

    call.setKeepAlive(true)
    PluginSingleton.webViewPlugin = call
  }

}





