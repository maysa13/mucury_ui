const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { 
                '@font-family': 'Prompt',
                '@primary-color': '#E34625',
                '@btn-danger-color': '#fff',
                '@btn-danger-bg': '#E34625',
                '@btn-danger-border': '#E34625',
                // '@btn-danger-bg': '#534a45',
                // '@btn-danger-border': '#534a45',
                '@layout-header-height': '45px',
                '@layout-header-padding': '0 50px',
                '@layout-header-background': '#fff'
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};