import TemplateDown from './src/index';

/* istanbul ignore next */
TemplateDown.install = function (Vue) {
  Vue.component(TemplateDown.name, TemplateDown);
};

export default TemplateDown;
