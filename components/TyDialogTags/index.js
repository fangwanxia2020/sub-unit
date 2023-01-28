import TyDialogTags from './src/index';

/* istanbul ignore next */
TyDialogTags.install = function(Vue) {
  Vue.component(TyDialogTags.name,TyDialogTags);
};

export default TyDialogTags;
