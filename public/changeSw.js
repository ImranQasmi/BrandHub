    // ///////////////////////////////////////////////////////
    // ///Naming and Defineing File to Cache
    // //////////////////////////////////////////////////////
    // var dynamicCache = 'olx-dynamic-cache-v2';
    // var cacheName = "olx-v2"; /////// Cache name
    // var fileToCache = [ ////// Name of file to pre cache
    //     '/',
    //     '/index.html',
    //     '/src/css/style.css',
    //     '/src/images/bgimag.jpg',
    //     '/src/images/OLX-logo.png',
    //     '/src/images/icons/icon-72x72.png',
    //     '/src/images/icons/icon-96x96.png',
    //     '/src/images/icons/icon-128x128.png',
    //     '/src/images/icons/icon-144x144.png',
    //     '/src/images/icons/icon-152x152.png',
    //     '/src/images/icons/icon-192x192.png',
    //     '/src/images/icons/icon-384x384.png',
    //     '/src/images/icons/icon-512x512.png',
    //     '/src/js/app.js',
    //     '/src/pages/chat.html',
    //     '/src/pages/login.html',
    //     '/src/pages/show_ads.html',
    //     '/src/pages/signup.html',
    //     '/src/pages/submit-ads.html',
    //     '/src/pages/offline.html',
    //     '/404.html',
    //     '/firebase-messaging-sw.js',
    //     '/mainfest.json',
    //     'https://use.fontawesome.com/releases/v5.7.2/css/all.css',
    //     'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
    //     'https://code.jquery.com/jquery-3.3.1.slim.min.js',
    //     'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js',
    //     'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js',
    //     'https://unpkg.com/sweetalert/dist/sweetalert.min.js',
    //     'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
    // ];


    // //////////////////////////////////////////////////
    // //////////////     Installing Service Worker
    // ///////////////////////////////////////////////////
    // self.addEventListener('install', (event) => {
    //     self.skipWaiting();
    //     event.waitUntil(
    //         caches.open(cacheName)
    //         .then((cache) => {
    //             console.log("[service Worker] is Installed.........", event);
    //             return cache.addAll(fileToCache);
    //         })
    //         .catch(error =>{
    //             console.log("Error", error);
    //         })
    //     );
    // });

    // /////////////////////////////////////////////////////
    // ////////////////////  Activating Service Worker
    // /////////////////////////////////////////////////////
    // self.addEventListener('activate', (event) => {
    //     event.waitUntil(
    //         caches.keys()
    //         .then((keyList) => {
    //             return Promise.all(keyList.map((key) => {
    //                 console.log("[service Worker] is Activated.........", event);
    //                 if (key !== cacheName && key !== dynamicCache) {
    //                     return caches.delete(key);
    //                 }
    //             }));
    //         })
    //     );
    //     return self.clients.claim();
    // });


    // /////////////////////////////////////////////////////////
    // ///////////////// Fetching Data using Service Worker
    // /////////////////////////////////////////////////////////

    // self.addEventListener('fetch', function(e) 
    // {
    //     console.log('[Service Worker] Fetch', e.request.url);
    //     var referrerURL = 'https://olxapp-125.firebaseapp.com/src/pages/offline.html';
    //     if (e.request.referrer === referrerURL) {
    //         e.respondWith(async function() {
    //             const cache = await caches.open(dynamicCache);
    //             const cachedResponse = await cache.match(e.request);
    //             const networkResponsePromise = fetch(e.request);
    //             e.waitUntil(async function() {
    //                 const networkResponse = await networkResponsePromise;
    //                 await cache.put(e.request, networkResponse.clone());
    //             }());
    //             // Returned the cached response if we have one, otherwise return the network response.
    //             return cachedResponse || networkResponsePromise;
    //         }());
    //     } else {
    //         e.respondWith(
    //             caches.match(e.request)
    //             .then(function(response) {
    //                 return response || fetch(e.request);
    //             })
    //         );
    //     }
    // });


    