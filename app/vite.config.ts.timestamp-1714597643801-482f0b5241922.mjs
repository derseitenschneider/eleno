// Users/brianboy/Repositories/00-private/eleno/app/vite.config.ts
import path from "node:path";
import react from "file:///Users/brianboy/Repositories/00-private/eleno/app/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///Users/brianboy/Repositories/00-private/eleno/app/node_modules/vite/dist/node/index.js";
import preload from "file:///Users/brianboy/Repositories/00-private/eleno/app/node_modules/vite-plugin-preload/dist/index.mjs";
import { VitePWA } from "file:///Users/brianboy/Repositories/00-private/eleno/app/node_modules/vite-plugin-pwa/dist/index.js";

// Users/brianboy/Repositories/00-private/eleno/app/manifest.ts
var manifest = {
  lang: "de",
  name: "Eleno - smart unterrichten",
  short_name: "Eleno",
  description: "Smart unterrichten",
  id: "?homescreen=1",
  orientation: "landscape",
  display: "standalone",
  background_color: "#484e53",
  theme_color: "#484e53",
  icons: [
    {
      src: "./pwa/windows11/SmallTile.scale-100.png",
      sizes: "71x71"
    },
    {
      src: "./pwa/windows11/SmallTile.scale-125.png",
      sizes: "89x89"
    },
    {
      src: "./pwa/windows11/SmallTile.scale-150.png",
      sizes: "107x107"
    },
    {
      src: "./pwa/windows11/SmallTile.scale-200.png",
      sizes: "142x142"
    },
    {
      src: "./pwa/windows11/SmallTile.scale-400.png",
      sizes: "284x284"
    },
    {
      src: "./pwa/windows11/Square150x150Logo.scale-100.png",
      sizes: "150x150"
    },
    {
      src: "./pwa/windows11/Square150x150Logo.scale-125.png",
      sizes: "188x188"
    },
    {
      src: "./pwa/windows11/Square150x150Logo.scale-150.png",
      sizes: "225x225"
    },
    {
      src: "./pwa/windows11/Square150x150Logo.scale-200.png",
      sizes: "300x300"
    },
    {
      src: "./pwa/windows11/Square150x150Logo.scale-400.png",
      sizes: "600x600"
    },
    {
      src: "./pwa/windows11/Wide310x150Logo.scale-100.png",
      sizes: "310x150"
    },
    {
      src: "./pwa/windows11/Wide310x150Logo.scale-125.png",
      sizes: "388x188"
    },
    {
      src: "./pwa/windows11/Wide310x150Logo.scale-150.png",
      sizes: "465x225"
    },
    {
      src: "./pwa/windows11/Wide310x150Logo.scale-200.png",
      sizes: "620x300"
    },
    {
      src: "./pwa/windows11/Wide310x150Logo.scale-400.png",
      sizes: "1240x600"
    },
    {
      src: "./pwa/windows11/LargeTile.scale-100.png",
      sizes: "310x310"
    },
    {
      src: "./pwa/windows11/LargeTile.scale-125.png",
      sizes: "388x388"
    },
    {
      src: "./pwa/windows11/LargeTile.scale-150.png",
      sizes: "465x465"
    },
    {
      src: "./pwa/windows11/LargeTile.scale-200.png",
      sizes: "620x620"
    },
    {
      src: "./pwa/windows11/LargeTile.scale-400.png",
      sizes: "1240x1240"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.scale-100.png",
      sizes: "44x44"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.scale-125.png",
      sizes: "55x55"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.scale-150.png",
      sizes: "66x66"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.scale-200.png",
      sizes: "88x88"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.scale-400.png",
      sizes: "176x176"
    },
    {
      src: "./pwa/windows11/StoreLogo.scale-100.png",
      sizes: "50x50"
    },
    {
      src: "./pwa/windows11/StoreLogo.scale-125.png",
      sizes: "63x63"
    },
    {
      src: "./pwa/windows11/StoreLogo.scale-150.png",
      sizes: "75x75"
    },
    {
      src: "./pwa/windows11/StoreLogo.scale-200.png",
      sizes: "100x100"
    },
    {
      src: "./pwa/windows11/StoreLogo.scale-400.png",
      sizes: "200x200"
    },
    {
      src: "./pwa/windows11/SplashScreen.scale-100.png",
      sizes: "620x300"
    },
    {
      src: "./pwa/windows11/SplashScreen.scale-125.png",
      sizes: "775x375"
    },
    {
      src: "./pwa/windows11/SplashScreen.scale-150.png",
      sizes: "930x450"
    },
    {
      src: "./pwa/windows11/SplashScreen.scale-200.png",
      sizes: "1240x600"
    },
    {
      src: "./pwa/windows11/SplashScreen.scale-400.png",
      sizes: "2480x1200"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.targetsize-16.png",
      sizes: "16x16"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.targetsize-20.png",
      sizes: "20x20"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.targetsize-24.png",
      sizes: "24x24"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.targetsize-30.png",
      sizes: "30x30"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.targetsize-32.png",
      sizes: "32x32"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.targetsize-36.png",
      sizes: "36x36"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.targetsize-40.png",
      sizes: "40x40"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.targetsize-44.png",
      sizes: "44x44"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.targetsize-48.png",
      sizes: "48x48"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.targetsize-60.png",
      sizes: "60x60"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.targetsize-64.png",
      sizes: "64x64"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.targetsize-72.png",
      sizes: "72x72"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.targetsize-80.png",
      sizes: "80x80"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.targetsize-96.png",
      sizes: "96x96"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.targetsize-256.png",
      sizes: "256x256"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-unplated_targetsize-16.png",
      sizes: "16x16"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-unplated_targetsize-20.png",
      sizes: "20x20"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-unplated_targetsize-24.png",
      sizes: "24x24"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-unplated_targetsize-30.png",
      sizes: "30x30"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-unplated_targetsize-32.png",
      sizes: "32x32"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-unplated_targetsize-36.png",
      sizes: "36x36"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-unplated_targetsize-40.png",
      sizes: "40x40"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-unplated_targetsize-44.png",
      sizes: "44x44"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-unplated_targetsize-48.png",
      sizes: "48x48"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-unplated_targetsize-60.png",
      sizes: "60x60"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-unplated_targetsize-64.png",
      sizes: "64x64"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-unplated_targetsize-72.png",
      sizes: "72x72"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-unplated_targetsize-80.png",
      sizes: "80x80"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-unplated_targetsize-96.png",
      sizes: "96x96"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-unplated_targetsize-256.png",
      sizes: "256x256"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-16.png",
      sizes: "16x16"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-20.png",
      sizes: "20x20"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-24.png",
      sizes: "24x24"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-30.png",
      sizes: "30x30"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-32.png",
      sizes: "32x32"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-36.png",
      sizes: "36x36"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-40.png",
      sizes: "40x40"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-44.png",
      sizes: "44x44"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-48.png",
      sizes: "48x48"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-60.png",
      sizes: "60x60"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-64.png",
      sizes: "64x64"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-72.png",
      sizes: "72x72"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-80.png",
      sizes: "80x80"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-96.png",
      sizes: "96x96"
    },
    {
      src: "./pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-256.png",
      sizes: "256x256"
    },
    {
      src: "./pwa/android/android-launchericon-512-512.png",
      sizes: "512x512"
    },
    {
      src: "./pwa/android/android-launchericon-192-192.png",
      sizes: "192x192"
    },
    {
      src: "./pwa/android/android-launchericon-144-144.png",
      sizes: "144x144"
    },
    {
      src: "./pwa/android/android-launchericon-96-96.png",
      sizes: "96x96"
    },
    {
      src: "./pwa/android/android-launchericon-72-72.png",
      sizes: "72x72"
    },
    {
      src: "./pwa/android/android-launchericon-48-48.png",
      sizes: "48x48"
    },
    {
      src: "./pwa/ios/16.png",
      sizes: "16x16"
    },
    {
      src: "./pwa/ios/20.png",
      sizes: "20x20"
    },
    {
      src: "./pwa/ios/29.png",
      sizes: "29x29"
    },
    {
      src: "./pwa/ios/32.png",
      sizes: "32x32"
    },
    {
      src: "./pwa/ios/40.png",
      sizes: "40x40"
    },
    {
      src: "./pwa/ios/50.png",
      sizes: "50x50"
    },
    {
      src: "./pwa/ios/57.png",
      sizes: "57x57"
    },
    {
      src: "./pwa/ios/58.png",
      sizes: "58x58"
    },
    {
      src: "./pwa/ios/60.png",
      sizes: "60x60"
    },
    {
      src: "./pwa/ios/64.png",
      sizes: "64x64"
    },
    {
      src: "./pwa/ios/72.png",
      sizes: "72x72"
    },
    {
      src: "./pwa/ios/76.png",
      sizes: "76x76"
    },
    {
      src: "./pwa/ios/80.png",
      sizes: "80x80"
    },
    {
      src: "./pwa/ios/87.png",
      sizes: "87x87"
    },
    {
      src: "./pwa/ios/100.png",
      sizes: "100x100"
    },
    {
      src: "./pwa/ios/114.png",
      sizes: "114x114"
    },
    {
      src: "./pwa/ios/120.png",
      sizes: "120x120"
    },
    {
      src: "./pwa/ios/128.png",
      sizes: "128x128"
    },
    {
      src: "./pwa/ios/144.png",
      sizes: "144x144"
    },
    {
      src: "./pwa/ios/152.png",
      sizes: "152x152"
    },
    {
      src: "./pwa/ios/167.png",
      sizes: "167x167"
    },
    {
      src: "./pwa/ios/180.png",
      sizes: "180x180"
    },
    {
      src: "./pwa/ios/192.png",
      sizes: "192x192"
    },
    {
      src: "./pwa/ios/256.png",
      sizes: "256x256"
    },
    {
      src: "./pwa/ios/512.png",
      sizes: "512x512"
    },
    {
      src: "./pwa/ios/1024.png",
      sizes: "1024x1024"
    }
  ]
};
var manifest_default = manifest;

// Users/brianboy/Repositories/00-private/eleno/app/vite.config.ts
var __vite_injected_original_dirname = "/Users/brianboy/Repositories/00-private/eleno/app";
var vite_config_default = defineConfig({
  test: {
    environment: "jsdom",
    root: "./tests",
    globals: true,
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  base: "/",
  plugins: [
    react(),
    preload(),
    VitePWA({
      registerType: "autoUpdate",
      // strategies: 'injectManifest',
      devOptions: {
        enabled: false
      },
      manifest: manifest_default,
      minify: true
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
          return null;
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiVXNlcnMvYnJpYW5ib3kvUmVwb3NpdG9yaWVzLzAwLXByaXZhdGUvZWxlbm8vYXBwL3ZpdGUuY29uZmlnLnRzIiwgIlVzZXJzL2JyaWFuYm95L1JlcG9zaXRvcmllcy8wMC1wcml2YXRlL2VsZW5vL2FwcC9tYW5pZmVzdC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9icmlhbmJveS9SZXBvc2l0b3JpZXMvMDAtcHJpdmF0ZS9lbGVuby9hcHBcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9icmlhbmJveS9SZXBvc2l0b3JpZXMvMDAtcHJpdmF0ZS9lbGVuby9hcHAvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2JyaWFuYm95L1JlcG9zaXRvcmllcy8wMC1wcml2YXRlL2VsZW5vL2FwcC92aXRlLmNvbmZpZy50c1wiOy8vLzxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlc3RcIiAvPlxuXG5pbXBvcnQgcGF0aCBmcm9tIFwibm9kZTpwYXRoXCJcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIlxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIlxuaW1wb3J0IHByZWxvYWQgZnJvbSBcInZpdGUtcGx1Z2luLXByZWxvYWRcIlxuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1wd2FcIlxuaW1wb3J0IG1hbmlmZXN0IGZyb20gXCIuL21hbmlmZXN0XCJcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHRlc3Q6IHtcbiAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcbiAgICByb290OiAnLi90ZXN0cycsXG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgfVxuICB9LFxuICBiYXNlOiBcIi9cIixcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgcHJlbG9hZCgpLFxuICAgIFZpdGVQV0Eoe1xuICAgICAgcmVnaXN0ZXJUeXBlOiBcImF1dG9VcGRhdGVcIixcblxuICAgICAgLy8gc3RyYXRlZ2llczogJ2luamVjdE1hbmlmZXN0JyxcbiAgICAgIGRldk9wdGlvbnM6IHtcbiAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICB9LFxuICAgICAgbWFuaWZlc3QsXG4gICAgICBtaW5pZnk6IHRydWUsXG4gICAgfSksXG4gIF0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBjc3NNaW5pZnk6IHRydWUsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rcyhpZCkge1xuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcyhcIm5vZGVfbW9kdWxlc1wiKSkge1xuICAgICAgICAgICAgcmV0dXJuIGlkXG4gICAgICAgICAgICAgIC50b1N0cmluZygpXG4gICAgICAgICAgICAgIC5zcGxpdChcIm5vZGVfbW9kdWxlcy9cIilbMV1cbiAgICAgICAgICAgICAgLnNwbGl0KFwiL1wiKVswXVxuICAgICAgICAgICAgICAudG9TdHJpbmcoKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSlcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2JyaWFuYm95L1JlcG9zaXRvcmllcy8wMC1wcml2YXRlL2VsZW5vL2FwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2JyaWFuYm95L1JlcG9zaXRvcmllcy8wMC1wcml2YXRlL2VsZW5vL2FwcC9tYW5pZmVzdC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYnJpYW5ib3kvUmVwb3NpdG9yaWVzLzAwLXByaXZhdGUvZWxlbm8vYXBwL21hbmlmZXN0LnRzXCI7aW1wb3J0IHR5cGUgeyBNYW5pZmVzdE9wdGlvbnMgfSBmcm9tIFwidml0ZS1wbHVnaW4tcHdhXCI7XG5cbmNvbnN0IG1hbmlmZXN0OiBQYXJ0aWFsPE1hbmlmZXN0T3B0aW9ucz4gPSB7XG5cdGxhbmc6IFwiZGVcIixcblx0bmFtZTogXCJFbGVubyAtIHNtYXJ0IHVudGVycmljaHRlblwiLFxuXHRzaG9ydF9uYW1lOiBcIkVsZW5vXCIsXG5cdGRlc2NyaXB0aW9uOiBcIlNtYXJ0IHVudGVycmljaHRlblwiLFxuXHRpZDogXCI/aG9tZXNjcmVlbj0xXCIsXG5cdG9yaWVudGF0aW9uOiBcImxhbmRzY2FwZVwiLFxuXHRkaXNwbGF5OiBcInN0YW5kYWxvbmVcIixcblx0YmFja2dyb3VuZF9jb2xvcjogXCIjNDg0ZTUzXCIsXG5cdHRoZW1lX2NvbG9yOiBcIiM0ODRlNTNcIixcblx0aWNvbnM6IFtcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2Evd2luZG93czExL1NtYWxsVGlsZS5zY2FsZS0xMDAucG5nXCIsXG5cdFx0XHRzaXplczogXCI3MXg3MVwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TbWFsbFRpbGUuc2NhbGUtMTI1LnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiODl4ODlcIixcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogXCIuL3B3YS93aW5kb3dzMTEvU21hbGxUaWxlLnNjYWxlLTE1MC5wbmdcIixcblx0XHRcdHNpemVzOiBcIjEwN3gxMDdcIixcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogXCIuL3B3YS93aW5kb3dzMTEvU21hbGxUaWxlLnNjYWxlLTIwMC5wbmdcIixcblx0XHRcdHNpemVzOiBcIjE0MngxNDJcIixcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogXCIuL3B3YS93aW5kb3dzMTEvU21hbGxUaWxlLnNjYWxlLTQwMC5wbmdcIixcblx0XHRcdHNpemVzOiBcIjI4NHgyODRcIixcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogXCIuL3B3YS93aW5kb3dzMTEvU3F1YXJlMTUweDE1MExvZ28uc2NhbGUtMTAwLnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiMTUweDE1MFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmUxNTB4MTUwTG9nby5zY2FsZS0xMjUucG5nXCIsXG5cdFx0XHRzaXplczogXCIxODh4MTg4XCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2Evd2luZG93czExL1NxdWFyZTE1MHgxNTBMb2dvLnNjYWxlLTE1MC5wbmdcIixcblx0XHRcdHNpemVzOiBcIjIyNXgyMjVcIixcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogXCIuL3B3YS93aW5kb3dzMTEvU3F1YXJlMTUweDE1MExvZ28uc2NhbGUtMjAwLnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiMzAweDMwMFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmUxNTB4MTUwTG9nby5zY2FsZS00MDAucG5nXCIsXG5cdFx0XHRzaXplczogXCI2MDB4NjAwXCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2Evd2luZG93czExL1dpZGUzMTB4MTUwTG9nby5zY2FsZS0xMDAucG5nXCIsXG5cdFx0XHRzaXplczogXCIzMTB4MTUwXCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2Evd2luZG93czExL1dpZGUzMTB4MTUwTG9nby5zY2FsZS0xMjUucG5nXCIsXG5cdFx0XHRzaXplczogXCIzODh4MTg4XCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2Evd2luZG93czExL1dpZGUzMTB4MTUwTG9nby5zY2FsZS0xNTAucG5nXCIsXG5cdFx0XHRzaXplczogXCI0NjV4MjI1XCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2Evd2luZG93czExL1dpZGUzMTB4MTUwTG9nby5zY2FsZS0yMDAucG5nXCIsXG5cdFx0XHRzaXplczogXCI2MjB4MzAwXCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2Evd2luZG93czExL1dpZGUzMTB4MTUwTG9nby5zY2FsZS00MDAucG5nXCIsXG5cdFx0XHRzaXplczogXCIxMjQweDYwMFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9MYXJnZVRpbGUuc2NhbGUtMTAwLnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiMzEweDMxMFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9MYXJnZVRpbGUuc2NhbGUtMTI1LnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiMzg4eDM4OFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9MYXJnZVRpbGUuc2NhbGUtMTUwLnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiNDY1eDQ2NVwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9MYXJnZVRpbGUuc2NhbGUtMjAwLnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiNjIweDYyMFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9MYXJnZVRpbGUuc2NhbGUtNDAwLnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiMTI0MHgxMjQwXCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2Evd2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5zY2FsZS0xMDAucG5nXCIsXG5cdFx0XHRzaXplczogXCI0NHg0NFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uc2NhbGUtMTI1LnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiNTV4NTVcIixcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogXCIuL3B3YS93aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLnNjYWxlLTE1MC5wbmdcIixcblx0XHRcdHNpemVzOiBcIjY2eDY2XCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2Evd2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5zY2FsZS0yMDAucG5nXCIsXG5cdFx0XHRzaXplczogXCI4OHg4OFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uc2NhbGUtNDAwLnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiMTc2eDE3NlwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TdG9yZUxvZ28uc2NhbGUtMTAwLnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiNTB4NTBcIixcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogXCIuL3B3YS93aW5kb3dzMTEvU3RvcmVMb2dvLnNjYWxlLTEyNS5wbmdcIixcblx0XHRcdHNpemVzOiBcIjYzeDYzXCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2Evd2luZG93czExL1N0b3JlTG9nby5zY2FsZS0xNTAucG5nXCIsXG5cdFx0XHRzaXplczogXCI3NXg3NVwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TdG9yZUxvZ28uc2NhbGUtMjAwLnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiMTAweDEwMFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TdG9yZUxvZ28uc2NhbGUtNDAwLnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiMjAweDIwMFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcGxhc2hTY3JlZW4uc2NhbGUtMTAwLnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiNjIweDMwMFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcGxhc2hTY3JlZW4uc2NhbGUtMTI1LnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiNzc1eDM3NVwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcGxhc2hTY3JlZW4uc2NhbGUtMTUwLnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiOTMweDQ1MFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcGxhc2hTY3JlZW4uc2NhbGUtMjAwLnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiMTI0MHg2MDBcIixcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogXCIuL3B3YS93aW5kb3dzMTEvU3BsYXNoU2NyZWVuLnNjYWxlLTQwMC5wbmdcIixcblx0XHRcdHNpemVzOiBcIjI0ODB4MTIwMFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28udGFyZ2V0c2l6ZS0xNi5wbmdcIixcblx0XHRcdHNpemVzOiBcIjE2eDE2XCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2Evd2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby50YXJnZXRzaXplLTIwLnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiMjB4MjBcIixcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogXCIuL3B3YS93aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLnRhcmdldHNpemUtMjQucG5nXCIsXG5cdFx0XHRzaXplczogXCIyNHgyNFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28udGFyZ2V0c2l6ZS0zMC5wbmdcIixcblx0XHRcdHNpemVzOiBcIjMweDMwXCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2Evd2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby50YXJnZXRzaXplLTMyLnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiMzJ4MzJcIixcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogXCIuL3B3YS93aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLnRhcmdldHNpemUtMzYucG5nXCIsXG5cdFx0XHRzaXplczogXCIzNngzNlwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28udGFyZ2V0c2l6ZS00MC5wbmdcIixcblx0XHRcdHNpemVzOiBcIjQweDQwXCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2Evd2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby50YXJnZXRzaXplLTQ0LnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiNDR4NDRcIixcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogXCIuL3B3YS93aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLnRhcmdldHNpemUtNDgucG5nXCIsXG5cdFx0XHRzaXplczogXCI0OHg0OFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28udGFyZ2V0c2l6ZS02MC5wbmdcIixcblx0XHRcdHNpemVzOiBcIjYweDYwXCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2Evd2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby50YXJnZXRzaXplLTY0LnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiNjR4NjRcIixcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogXCIuL3B3YS93aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLnRhcmdldHNpemUtNzIucG5nXCIsXG5cdFx0XHRzaXplczogXCI3Mng3MlwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28udGFyZ2V0c2l6ZS04MC5wbmdcIixcblx0XHRcdHNpemVzOiBcIjgweDgwXCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2Evd2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby50YXJnZXRzaXplLTk2LnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiOTZ4OTZcIixcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogXCIuL3B3YS93aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLnRhcmdldHNpemUtMjU2LnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiMjU2eDI1NlwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS11bnBsYXRlZF90YXJnZXRzaXplLTE2LnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiMTZ4MTZcIixcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogXCIuL3B3YS93aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tdW5wbGF0ZWRfdGFyZ2V0c2l6ZS0yMC5wbmdcIixcblx0XHRcdHNpemVzOiBcIjIweDIwXCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2Evd2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLXVucGxhdGVkX3RhcmdldHNpemUtMjQucG5nXCIsXG5cdFx0XHRzaXplczogXCIyNHgyNFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS11bnBsYXRlZF90YXJnZXRzaXplLTMwLnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiMzB4MzBcIixcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogXCIuL3B3YS93aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tdW5wbGF0ZWRfdGFyZ2V0c2l6ZS0zMi5wbmdcIixcblx0XHRcdHNpemVzOiBcIjMyeDMyXCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2Evd2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLXVucGxhdGVkX3RhcmdldHNpemUtMzYucG5nXCIsXG5cdFx0XHRzaXplczogXCIzNngzNlwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS11bnBsYXRlZF90YXJnZXRzaXplLTQwLnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiNDB4NDBcIixcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogXCIuL3B3YS93aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tdW5wbGF0ZWRfdGFyZ2V0c2l6ZS00NC5wbmdcIixcblx0XHRcdHNpemVzOiBcIjQ0eDQ0XCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2Evd2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLXVucGxhdGVkX3RhcmdldHNpemUtNDgucG5nXCIsXG5cdFx0XHRzaXplczogXCI0OHg0OFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS11bnBsYXRlZF90YXJnZXRzaXplLTYwLnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiNjB4NjBcIixcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogXCIuL3B3YS93aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tdW5wbGF0ZWRfdGFyZ2V0c2l6ZS02NC5wbmdcIixcblx0XHRcdHNpemVzOiBcIjY0eDY0XCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2Evd2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLXVucGxhdGVkX3RhcmdldHNpemUtNzIucG5nXCIsXG5cdFx0XHRzaXplczogXCI3Mng3MlwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS11bnBsYXRlZF90YXJnZXRzaXplLTgwLnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiODB4ODBcIixcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogXCIuL3B3YS93aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tdW5wbGF0ZWRfdGFyZ2V0c2l6ZS05Ni5wbmdcIixcblx0XHRcdHNpemVzOiBcIjk2eDk2XCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2Evd2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLXVucGxhdGVkX3RhcmdldHNpemUtMjU2LnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiMjU2eDI1NlwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtMTYucG5nXCIsXG5cdFx0XHRzaXplczogXCIxNngxNlwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtMjAucG5nXCIsXG5cdFx0XHRzaXplczogXCIyMHgyMFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtMjQucG5nXCIsXG5cdFx0XHRzaXplczogXCIyNHgyNFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtMzAucG5nXCIsXG5cdFx0XHRzaXplczogXCIzMHgzMFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtMzIucG5nXCIsXG5cdFx0XHRzaXplczogXCIzMngzMlwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtMzYucG5nXCIsXG5cdFx0XHRzaXplczogXCIzNngzNlwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtNDAucG5nXCIsXG5cdFx0XHRzaXplczogXCI0MHg0MFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtNDQucG5nXCIsXG5cdFx0XHRzaXplczogXCI0NHg0NFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtNDgucG5nXCIsXG5cdFx0XHRzaXplczogXCI0OHg0OFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtNjAucG5nXCIsXG5cdFx0XHRzaXplczogXCI2MHg2MFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtNjQucG5nXCIsXG5cdFx0XHRzaXplczogXCI2NHg2NFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtNzIucG5nXCIsXG5cdFx0XHRzaXplczogXCI3Mng3MlwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtODAucG5nXCIsXG5cdFx0XHRzaXplczogXCI4MHg4MFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtOTYucG5nXCIsXG5cdFx0XHRzaXplczogXCI5Nng5NlwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL3dpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtMjU2LnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiMjU2eDI1NlwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL2FuZHJvaWQvYW5kcm9pZC1sYXVuY2hlcmljb24tNTEyLTUxMi5wbmdcIixcblx0XHRcdHNpemVzOiBcIjUxMng1MTJcIixcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogXCIuL3B3YS9hbmRyb2lkL2FuZHJvaWQtbGF1bmNoZXJpY29uLTE5Mi0xOTIucG5nXCIsXG5cdFx0XHRzaXplczogXCIxOTJ4MTkyXCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2EvYW5kcm9pZC9hbmRyb2lkLWxhdW5jaGVyaWNvbi0xNDQtMTQ0LnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiMTQ0eDE0NFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL2FuZHJvaWQvYW5kcm9pZC1sYXVuY2hlcmljb24tOTYtOTYucG5nXCIsXG5cdFx0XHRzaXplczogXCI5Nng5NlwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL2FuZHJvaWQvYW5kcm9pZC1sYXVuY2hlcmljb24tNzItNzIucG5nXCIsXG5cdFx0XHRzaXplczogXCI3Mng3MlwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL2FuZHJvaWQvYW5kcm9pZC1sYXVuY2hlcmljb24tNDgtNDgucG5nXCIsXG5cdFx0XHRzaXplczogXCI0OHg0OFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL2lvcy8xNi5wbmdcIixcblx0XHRcdHNpemVzOiBcIjE2eDE2XCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2EvaW9zLzIwLnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiMjB4MjBcIixcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogXCIuL3B3YS9pb3MvMjkucG5nXCIsXG5cdFx0XHRzaXplczogXCIyOXgyOVwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL2lvcy8zMi5wbmdcIixcblx0XHRcdHNpemVzOiBcIjMyeDMyXCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2EvaW9zLzQwLnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiNDB4NDBcIixcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogXCIuL3B3YS9pb3MvNTAucG5nXCIsXG5cdFx0XHRzaXplczogXCI1MHg1MFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL2lvcy81Ny5wbmdcIixcblx0XHRcdHNpemVzOiBcIjU3eDU3XCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2EvaW9zLzU4LnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiNTh4NThcIixcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogXCIuL3B3YS9pb3MvNjAucG5nXCIsXG5cdFx0XHRzaXplczogXCI2MHg2MFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL2lvcy82NC5wbmdcIixcblx0XHRcdHNpemVzOiBcIjY0eDY0XCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2EvaW9zLzcyLnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiNzJ4NzJcIixcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogXCIuL3B3YS9pb3MvNzYucG5nXCIsXG5cdFx0XHRzaXplczogXCI3Nng3NlwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL2lvcy84MC5wbmdcIixcblx0XHRcdHNpemVzOiBcIjgweDgwXCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2EvaW9zLzg3LnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiODd4ODdcIixcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogXCIuL3B3YS9pb3MvMTAwLnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiMTAweDEwMFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL2lvcy8xMTQucG5nXCIsXG5cdFx0XHRzaXplczogXCIxMTR4MTE0XCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2EvaW9zLzEyMC5wbmdcIixcblx0XHRcdHNpemVzOiBcIjEyMHgxMjBcIixcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogXCIuL3B3YS9pb3MvMTI4LnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiMTI4eDEyOFwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL2lvcy8xNDQucG5nXCIsXG5cdFx0XHRzaXplczogXCIxNDR4MTQ0XCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2EvaW9zLzE1Mi5wbmdcIixcblx0XHRcdHNpemVzOiBcIjE1MngxNTJcIixcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogXCIuL3B3YS9pb3MvMTY3LnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiMTY3eDE2N1wiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL2lvcy8xODAucG5nXCIsXG5cdFx0XHRzaXplczogXCIxODB4MTgwXCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2EvaW9zLzE5Mi5wbmdcIixcblx0XHRcdHNpemVzOiBcIjE5MngxOTJcIixcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogXCIuL3B3YS9pb3MvMjU2LnBuZ1wiLFxuXHRcdFx0c2l6ZXM6IFwiMjU2eDI1NlwiLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3JjOiBcIi4vcHdhL2lvcy81MTIucG5nXCIsXG5cdFx0XHRzaXplczogXCI1MTJ4NTEyXCIsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6IFwiLi9wd2EvaW9zLzEwMjQucG5nXCIsXG5cdFx0XHRzaXplczogXCIxMDI0eDEwMjRcIixcblx0XHR9LFxuXHRdLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgbWFuaWZlc3Q7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBRUEsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sV0FBVztBQUNsQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLGFBQWE7QUFDcEIsU0FBUyxlQUFlOzs7QUNKeEIsSUFBTSxXQUFxQztBQUFBLEVBQzFDLE1BQU07QUFBQSxFQUNOLE1BQU07QUFBQSxFQUNOLFlBQVk7QUFBQSxFQUNaLGFBQWE7QUFBQSxFQUNiLElBQUk7QUFBQSxFQUNKLGFBQWE7QUFBQSxFQUNiLFNBQVM7QUFBQSxFQUNULGtCQUFrQjtBQUFBLEVBQ2xCLGFBQWE7QUFBQSxFQUNiLE9BQU87QUFBQSxJQUNOO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNDLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsSUFDUjtBQUFBLEVBQ0Q7QUFDRDtBQUVBLElBQU8sbUJBQVE7OztBRGhkZixJQUFNLG1DQUFtQztBQVV6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNO0FBQUEsSUFDSixhQUFhO0FBQUEsSUFDYixNQUFNO0FBQUEsSUFDTixTQUFTO0FBQUEsSUFDVCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxNQUFNO0FBQUEsRUFDTixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsSUFDUixRQUFRO0FBQUEsTUFDTixjQUFjO0FBQUE7QUFBQSxNQUdkLFlBQVk7QUFBQSxRQUNWLFNBQVM7QUFBQSxNQUNYO0FBQUEsTUFDQTtBQUFBLE1BQ0EsUUFBUTtBQUFBLElBQ1YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFdBQVc7QUFBQSxJQUNYLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGFBQWEsSUFBSTtBQUNmLGNBQUksR0FBRyxTQUFTLGNBQWMsR0FBRztBQUMvQixtQkFBTyxHQUNKLFNBQVMsRUFDVCxNQUFNLGVBQWUsRUFBRSxDQUFDLEVBQ3hCLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFDWixTQUFTO0FBQUEsVUFDZDtBQUNBLGlCQUFPO0FBQUEsUUFDVDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
