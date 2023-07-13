import { HttpClient } from '@angular/common/http';
import { Component, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './core/services/auth.service';
import WebView from 'src/plugins/nativePlugins';


class Event {
  constructor(
    scrapingJavascript: string,
    maxActionCount: number,
    actionJavascript?: string,
    url?: string,
    userAgent?: string,
    eventId?: string
  ) {
    this.url = url;
    this.actionJavascript = actionJavascript;
    this.scrapingJavascript = scrapingJavascript;
    this.maxActionCount = maxActionCount;
    this.eventId = eventId
    this.userAgent = userAgent
  }
  userAgent?: string
  eventId?: string                  // Uniquely identifies the event
  url?: string
  actionJavascript?: string    // The javascript to take actions like scroll, click load more or click next button
  scrapingJavascript: string  // The javascript to scrap the HTML data,
  maxActionCount: number
}
class Product {
  constructor(obj?: any) {
    Object.assign(this, obj);
  }
  name?: string;
  date?: string;
  src?: string;
}
class Show {
  constructor(name?: string, date?: string) {
    this.name = name;
    this.date = date;
  }
  name?: string;
  date?: string;
}
class Ride {
  constructor(from?: string, to?: string, date?: string, status?: string) {
    this.from = from;
    this.to = to;
    this.date = date;
    this.status = status;
  }
  from?: string;
  to?: string;
  date?: string;
  status?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-boilerplate';
  products: Product[] = [];
  shows: Show[] = [];
  rides: Ride[] = [];

  constructor(private _http: HttpClient, private _authService: AuthService, private _ngZone: NgZone) { }

  ngOnInit() { }
  getToken() {
    this._authService.getToken().subscribe((x) => console.log(x));
  }
  testToken() {
    this._http.post(`${environment.baseUrl}auth/test/`, {}).subscribe((x) => {
      console.log(x);
    });
  }


  openAmazon() {
    var amazonData = '';

    const selectorToFind = '#ordersContainer';
    const scraperJS = `(function(){function waitForElement(e){return new Promise(t=>{if(document.querySelector(e))return t();listenMutations(e,t)})}function listenMutations(e,t){const n=document.body;new MutationObserver((n,o)=>{if(document.querySelector(e))return o.disconnect(),t()}).observe(n,{attributes:!0,childList:!0,subtree:!0})};waitForElement("${selectorToFind}").then(e=>{bridge.onElementFound(document.querySelector("${selectorToFind}").innerHTML)}); return 'await'})()`
    const actionJS = `(function() { 
      var nextButton = document.getElementsByClassName('a-last')[0];
      if (nextButton.classList.contains('a-disabled')) {
        return false;
      }
      nextButton.childNodes[0].click()
      return true;
    })()`
    const events = [new Event(scraperJS, 1, actionJS, 'https://www.amazon.in/gp/your-account/order-history?unifiedOrders=0&digitalOrders=0&janeOrders=0&orderFilter=year-2022&ref_=ppx_yo2ov_mob_b_filter_y2022_all', 'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.4) Gecko/20100101 Firefox/4.0', 'event-id'),
    new Event(scraperJS, 10, actionJS, 'https://www.amazon.in/gp/your-account/order-history?unifiedOrders=0&digitalOrders=0&janeOrders=0&orderFilter=year-2023&ref_=ppx_yo2ov_mob_b_filter_y2023_all', 'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.4) Gecko/20100101 Firefox/4.0', 'event-id')];
    WebView.show(
      {
        events: JSON.stringify(events),
      },
      (data) => {
        if (data?.data) {
          const htmlstring = data.data
            .replace(/\\u003C/g, '<')
            .replace(/\\"/g, "'")
            .replace(/\\n/g, '');
          amazonData += htmlstring;
          const products: Product[] = [];
          var parser = new DOMParser();
          var test = parser.parseFromString(amazonData, 'text/html');
          test
            .querySelectorAll('.a-box-group.a-spacing-base.order.js-order-card')
            .forEach((ele) => {

              const upperBox = ele.querySelectorAll('.a-box')[0]
              const lowerBox = ele.querySelectorAll('.a-box')[1]
              let prod = new Product();

              prod.date =
                upperBox
                  .querySelector('.a-color-secondary.value')
                  ?.innerHTML.trim() ?? '';

              prod.name =
                lowerBox.querySelectorAll('.a-link-normal')[1].innerHTML.trim() ?? '';

              prod.src =
                lowerBox.querySelectorAll('.a-link-normal')[0]
                  ?.firstElementChild?.getAttribute('src') ?? '';
              products.push(prod);
            });
          this._ngZone.run(() => {
            this.products = products;
          });
        }
      }
    );
  }

  openNetflix() {
    var netflixData = '';

    WebView.show(
      {
        events: ''
      },
      (data) => {
        if (data?.data) {
          const htmlstring = data.data
            .replace(/\\u003C/g, '<')
            .replace(/\\"/g, "'");
          netflixData += htmlstring;
          const shows: Show[] = [];
          var netflixParser = new DOMParser();
          var testNetflix = netflixParser.parseFromString(
            netflixData,
            'text/html'
          );
          testNetflix.querySelectorAll('.retableRow').forEach((x) => {
            let show = new Show();
            show.name = x.querySelector('.col.title>a')?.innerHTML.trim() ?? '';
            show.date =
              x.querySelector('.col.date.nowrap')?.innerHTML.trim() ?? '';
            shows.push(show);
          });
          this._ngZone.run(() => {
            this.shows = shows;
          });
        }
      }
    );
  }

  openUber() {
    var uberData = '';

    const selectorToFind = '._css-eTbQd'
    const selectorToScrap = '._css-gemfqT'
    const scraperJS = `(function(){function waitForElement(e){return new Promise(t=>{if(document.querySelector(e))return t();listenMutations(e,t)})}function listenMutations(e,t){const n=document.body;new MutationObserver((n,o)=>{if(document.querySelector(e))return o.disconnect(),t()}).observe(n,{attributes:!0,childList:!0,subtree:!0})};waitForElement("${selectorToFind}").then(e=>{bridge.onElementFound(document.querySelector("${selectorToScrap}").innerHTML)}); return 'await'})()`
    const actionJS = `(function() { return false })()`
    const events = [
      new Event(scraperJS, 0, actionJS, 'https://riders.uber.com/trips')
    ];
    WebView.show(
      {
        events: JSON.stringify(events),
      },
      (data) => {
        if (data?.data) {
          const htmlstring = data.data
            .replace(/\\u003C/g, '<')
            .replace(/\\"/g, "'");
          uberData += htmlstring;
          var uberParser = new DOMParser();
          var testUber = uberParser.parseFromString(uberData, 'text/html');
          const rides: Ride[] = [];
          testUber.querySelectorAll('._css-gtxWCh').forEach((x) => {
            let ride = new Ride();
            ride.status =
              x.querySelector('._css-krCBTw')?.innerHTML.trim() ?? '';
            ride.date = x.querySelector('._css-dTqljZ')?.innerHTML.trim() ?? '';
            ride.from = x.querySelector('._css-jBkfju')?.innerHTML.trim() ?? '';
            ride.to = x.querySelector('._css-byJCfZ')?.innerHTML.trim() ?? '';
            rides.push(ride);
          });
          this._ngZone.run(() => {
            this.rides = rides;
          });
        }
      }
    );
  }
}
