import { WebPlugin, registerPlugin } from '@capacitor/core';

export interface WebViewPlugin {
  show(options: { value: string }): Promise<{ html: string }>;
}

export abstract class WebViewClassPlugin extends WebPlugin {
  abstract show(options: { value: string }): Promise<{ html: string }>;
}

export type CallbackID = string;

export interface MyData {
  data: string;
}

export type WebViewPluginCallback = (message: MyData | null, err?: any) => void;

export interface MyPlugin {
  show(
    options: { events: string },
    callback: WebViewPluginCallback
  ): Promise<CallbackID>;
}

const WebView = registerPlugin<MyPlugin>('WebView');

export default WebView;
