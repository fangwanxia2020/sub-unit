import TyEditor from './src/index';

/* istanbul ignore next */
TyEditor.install = function(Vue) {
  Vue.component(TyEditor.name,TyEditor);
};

export default TyEditor;
