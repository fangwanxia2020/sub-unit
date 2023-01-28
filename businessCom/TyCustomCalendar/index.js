import TyCustomCalendar from './src/index';
/* istanbul ignore next */
TyCustomCalendar.install = function (Vue) {
  Vue.component(TyCustomCalendar.name,TyCustomCalendar);
};

export default TyCustomCalendar;
