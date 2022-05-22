module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/mining-element-test/' : '/',
  css: {
    loaderOptions: {
      scss: {
        prependData: `
        @import "@/assets/styles/variables.scss";
        @import "@/assets/styles/mixins.scss";
        `,
      },
    },
  },
};
