import '@fortawesome/fontawesome-free/css/all.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import minifyTheme from "minify-css-string";
import '@mdi/font/css/materialdesignicons.css'

//icons

import zhHans from 'vuetify/lib/locale/zh-Hans'

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: { zhHans },
    current: 'zhHans',
  },
  icons: {
    values:{

},
    iconfont: 'fa' || 'mdi',
  },
  theme: {
    options: {
      customProperties: true,
      minifyTheme,
      themeCache: {
        get: (key) => localStorage.getItem(key),
        set: (key, value) => localStorage.setItem(key, value),
      },
    },
    themes: {
      light:{
        primary: "#0096BE", //西雅图蓝
        secondary: "#9b59b6",
        accent: "#e67e22",
        info: "#00AA9E"     //Tiffany蓝
      },
    },
    // dark: true,
    light: true,
  },
});

