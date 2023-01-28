import PcForm from './src/index';

/* istanbul ignore next */
PcForm.install = function(Vue) {
  Vue.component(PcForm.name,PcForm);
};

export default PcForm;
