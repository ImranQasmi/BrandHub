// importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

// workbox.precaching.precacheAndRoute([
//     'https://use.fontawesome.com/releases/v5.7.2/css/all.css',
//     'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
//     '/src/css/style.css',
//     { url: '/index.html', revision: '383676' },
// ]);

// // workbox.routing.registerRoute(
// //     // Cache CSS files.
// //     /\.css$/,
// //     // Use cache but update in the background.
// //     new workbox.strategies.StaleWhileRevalidate({
// //       // Use a custom cache name.
// //       cacheName: 'css-cache',
// //     })
// //   );
  
//   workbox.routing.registerRoute(
//     // Cache image files.
//     /\.(?:png|jpg|jpeg|svg|gif)$/,
//     // Use the cache if it's available.
//     new workbox.strategies.CacheFirst({
//       // Use a custom cache name.
//       cacheName: 'image-cache',
//       plugins: [
//         new workbox.expiration.Plugin({
//           // Cache only 20 images.
//           maxEntries: 20,
//           // Cache for a maximum of a week.
//           maxAgeSeconds: 7 * 24 * 60 * 60,
//         })
//       ],
//     })
//   );