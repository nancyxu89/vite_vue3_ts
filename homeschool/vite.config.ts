import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import styleImport, { VantResolve } from 'vite-plugin-style-import'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import topLevelAwait from "vite-plugin-top-level-await"
import commonjs from "rollup-plugin-commonjs"
import externalGlobals from "rollup-plugin-external-globals"
import { viteVConsole } from 'vite-plugin-vconsole'
import vpr from 'vite-plugin-restart'
import AutoImport from 'unplugin-auto-import/vite'
import itc, { autoComplete } from 'vite-plugin-cdn-import'
import injectES from 'vite-plugin-inject-externals'
import { resolve, join } from 'path'
const ViteRestart = (vpr as any).default || vpr
const importToCDN = (itc as any).default || itc
const injectExternals = (injectES as any).default || injectES

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  loadEnv(mode, process.cwd())
  return {
    define: {
      'process.env': process.env
    },
    resolve: {
      alias: {
        src: join(__dirname, 'src'),
        '@': join(__dirname, 'src')
      }
    },
    plugins: [
      vue(),
      injectExternals({
        // Default value: 'head-prepend'
        // The custom injection location will replace the corresponding text in index.html
        injectTo: 'body',
        modules: [
          // {
          //   name:'vant',
          //   global: 'vant',
          //   path:'https://cdnjs.cloudflare.com/ajax/libs/vant/3.4.9/vant.min.js'
          // },
          // {
          //   name:'vant/3.4.9/index.min.css',
          //   path: 'https://cdnjs.cloudflare.com/ajax/libs/vant/3.4.9/index.min.css',
          //   injectTo: 'head'
          // },
          // {
          //   name: 'vue',
          //   global: 'Vue',
          //   path: 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.37/vue.global.prod.min.js',
          // },
          // {
          //   name: 'vue-demi',
          //   global: 'VueDemi',
          //   path: 'https://cdn.bootcdn.net/ajax/libs/vue-demi/0.13.1/index.iife.js'
          // },
          // {
          //   name: 'vue-router',
          //   global: 'VueRouter',
          //   path: 'https://unpkg.com/vue-router@4.1.3/dist/vue-router.global.prod.js',
          // },
          // {
          //   name: 'axios',
          //   global: 'axios',
          //   // 如果有name和global，但是没有path和htmltag，会直接替换全局变量，但是不注入script标签
          //   path: 'https://cdn.bootcdn.net/ajax/libs/axios/0.27.2/axios.js'
          // },
          // {
          //   name: 'dayjs',
          //   global: 'dayjs',
          //   path: 'https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.4/dayjs.min.js'
          // },
          // {
          //   name: 'pinia',
          //   global: 'Pinia',
          //   path: 'https://cdn.bootcdn.net/ajax/libs/pinia/2.0.14/pinia.iife.prod.min.js'
          // },
        ]
      }),
      viteVConsole({
        entry: resolve(__dirname, 'src/main.ts').replace(/\\/g, '/'),
        localEnabled: mode !== 'production',
        enabled: mode !== 'production',
        config: {
            maxLogNumber: 1000,
            theme: 'light'
        }
      }),
      commonjs(),
      importToCDN({
          modules:[
            autoComplete("vue"),
            autoComplete("axios"),
            {
              name: 'vue-demi',
              var: 'VueDemi',
              path: "lib/index.iife.min.js",
            },
            {
              name: 'pinia',
              var: 'Pinia',
              path: 'dist/pinia.iife.min.js'
            },
            {
              name: "vue-router",
              var: "VueRouter",
              path: "https://cdn.jsdelivr.net/npm/vue-router@4/dist/vue-router.global.min.js",
            },
            {
              name: 'dayjs',
              var: 'dayjs',
              path: 'https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.4/dayjs.min.js'
            },
            {
              name: 'vConsole',
              var: 'VConsole',
              path: 'https://cdn.bootcdn.net/ajax/libs/vConsole/3.14.6/vconsole.min.js'
            },
            {
              name: 'vant',
              var: 'vant',
              path: 'https://cdn.jsdelivr.net/npm/vant@3.4.9/lib/vant.min.js',
              css: 'https://cdn.jsdelivr.net/npm/vant@3.4.9/lib/index.css',
            },
          ]
        }
      ),
      topLevelAwait({
        // The export name of top-level await promise for each chunk module
        promiseExportName: "__tla",
        // The function to generate import names of top-level await promise in each chunk module
        promiseImportName: i => `__tla_${i}`
      }),
      // AutoImport({
      //   include: [
      //     /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      //     /\.vue$/,
      //     /\.vue\?vue/, // .vue
      //     /\.md$/, // .md
      //   ],
      //   imports: [
      //     'vue',
      //     'vue-router',
      //     {
      //       axios: [
      //         ['default', 'axios'],
      //       ],
      //     },
      //     // 'vue-i18n',
      //     // '@vueuse/head',
      //     // '@vueuse/core',
      //   ],
      //   dts: 'src/auto-imports.d.ts',
      // }),
      ViteRestart({
        restart: [
          'vite.config.[jt]s',
        ]
      }),
      vueSetupExtend(),
      styleImport({
        resolves: [VantResolve()],
      })
    ],
    build: {
      target: 'modules',
      outDir: 'dist',
      assetsDir: 'static',
      minify: 'terser', // 混淆器,terser构建后文件体积更小
      sourcemap: false,
      rollupOptions: {
        treeshake: true,
        external: ['vue', 'vue-router', 'axois', 'dayjs', 'vconsole', 'pinia', 'vant'],
        // plugins: [
        //   commonjs(),
        //   externalGlobals({
        //     'vue-router': 'VueRouter',
        //     'vue': 'Vue',
        //     'axios': 'Axios',
        //     'pinia': 'Pinia',
        //     // 'vant': 'Vant',
        //     'dayjs': 'dayjs'
        //   }),
        // ],
        output: {
          // format: 'es',
          // globals: {
          //   'vue-router': 'VueRouter',
          //   'vue': 'Vue',
          //   'axios': 'Axios',
          //   'pinia': 'Pinia',
          //   'dayjs': 'dayjs'
          // },
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
            if (facadeModuleId?.match?.(/\.*\/views\/(.*)\.vue$/)?.[1]) {
              return 'static/chunks/' + facadeModuleId.match(/\.*\/views\/(.*)\.vue$/)[1].replace(/\//, '_') + '-[hash].js'
            }
            return 'static/chunks/[name]-[hash].js'
          },
          entryFileNames: 'static/entry/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          manualChunks (id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          }
        }
      }
    },
    server: {
      port: 8090, // 端口号
    }
  }
})
