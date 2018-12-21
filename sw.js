/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "app.js",
    "revision": "b7edb611f5de99819d3759b2cd3dcdd9"
  },
  {
    "url": "index.html",
    "revision": "032826d948510920f23da0ab07df91f6"
  },
  {
    "url": "styles.css",
    "revision": "ad4e5ac019fd3b7ef9c0c5947cb97331"
  },
  {
    "url": "workbox-config.js",
    "revision": "ad59797e2f908fea7d5073cc02abdfd6"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/https:\/\/jsonplaceholder\.typicode\.com/, workbox.strategies.networkFirst(), 'GET');
