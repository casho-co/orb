package com.casho.app

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.CookieManager
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import com.casho.app.databinding.ActivityWebViewBinding
import com.getcapacitor.JSObject
import org.json.JSONArray
import org.json.JSONObject


/**
 * An example full-screen activity that shows and hides the system UI (i.e.
 * status bar and navigation/system bar) with user interaction.
 */
class WebViewActivity : AppCompatActivity() {

  private lateinit var binding: ActivityWebViewBinding


  @SuppressLint("SetJavaScriptEnabled")
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    binding = ActivityWebViewBinding.inflate(layoutInflater)
    setContentView(binding.root)
    supportActionBar?.setDisplayHomeAsUpEnabled(true)

    // Find the WebView by its unique ID
    val webView: WebView = binding.web

    val eventsStr = intent.extras?.getString("events")
    val eventsArray = JSONArray(eventsStr)

    for (i in 0 until eventsArray.length()) {
      val jsonObject: JSONObject = eventsArray.getJSONObject(i)
      val event = Event()

      event.actionJavascript = jsonObject.getString("actionJavascript")
      event.scrapingJavascript = jsonObject.getString("scrapingJavascript")
      event.url = jsonObject.getString("url")
      event.maxActionCount = jsonObject.getInt("maxActionCount")
      if(jsonObject.has("userAgent")) {
        event.userAgent = jsonObject.getString("userAgent")
      }

      EventQueue.add(event)
    }

    // this will enable the javascript.
    webView.settings.javaScriptEnabled = true

    // Add a JavascriptInterface to handle promises and callbacks.
    webView.addJavascriptInterface(this, "bridge")

    CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);

    // loading url in the WebView.
    loadCurrentEvent()

    webView.webViewClient = object : WebViewClient() {

      override fun onLoadResource(view: WebView?, url: String?) {
        super.onLoadResource(view, url)
      }

      override fun onPageFinished(view: WebView?, url: String?) {
          EventQueue.currentEvent()?.let { event ->
            scrapJS(event)
          }
      }
    }
  }

  private fun loadCurrentEvent() {
    // Take the current event, set the user agent and load it's URL
    EventQueue.currentEvent()?.let {
      if(it.userAgent != null) {
        binding.web.settings.userAgentString = it.userAgent
      }
      binding.web.loadUrl(it.url)
    }
  }

  private fun scrapJS(event: Event) {
    event.scrapingJavascript?.let {

      binding.web.evaluateJavascript(it) { scrapResponse ->

        when (scrapResponse) {
            "\"await\"" -> {
              // Do nothing
            }
            else -> {
              checkEventQueue()
            }
        }
      }
    }
  }

  private fun resolveData(response: String) {

    // Convert the data to JSObject
    val jobject = JSObject()
    jobject.put("data", response);

    // Send the data back to Angular
    PluginSingleton.webViewPlugin.resolve(jobject)
  }


  private fun actionJS(event: Event) {
    // Evaluate action JS.
    event.actionJavascript?.let {
      runOnUiThread {
        binding.web.evaluateJavascript(it) { actionResponse ->

          if(actionResponse == "true") {
            // Process the Response
            actionResponse(event)
          } else {
            // Remove the event since the JS evaluation wasn't successful and check for the next event
            checkEventQueue()
          }
        }
      }

    }
  }

  private fun actionResponse(event: Event) {
    if (event.maxActionCount <= 1) {
      // If the max count has reached, check for the next event
      checkEventQueue()
    } else {
      // If the max count hasn't reached, reduce the count by 1
      EventQueue.currentEvent()?.maxActionCount =
        (EventQueue.currentEvent()?.maxActionCount ?: 1) - 1
    }
  }

  private fun checkEventQueue() {
    // Poll the event
    EventQueue.poll()


    if(EventQueue.currentEvent() == null) {
      // If the event queue is empty pop the web view activity
      finish()
    } else {
      // Else load the current event
      loadCurrentEvent()
    }
  }

  // The callback to be called when the required element is found for scraping
  @JavascriptInterface
  fun onElementFound(scrapResponse: String?) {

    // Send the data back to the URL
    scrapResponse?.let { resolveData(it) }

    // Perform the action JS
    EventQueue.currentEvent()?.let {
      actionJS(it)
    }
  }
}
