//base
import TyIcon from './TyIcon'
//bisiness
import TyCaptcha from './TyCaptcha'
import TySelectArea from './TySelectArea'
//data
import TyEditTable from './TyEditTable'
import TyTable from './TyTable'
import TyCodeEdit from './TyCodeEdit'
//form
import TyCascader from './TyCascader'
import TyDictionary from './TyDictionary'
import TyEditor from './TyEditor'
import TyEditor2 from './TyEditor2'
import TyUpload from './TyUpload'
import TyUploadFile from './TyUploadFile'
import TyUploadFile1 from './TyUploadFile1'
import TyCheckbox from './TyCheckbox'
import TyRadio from './TyRadio'
import TyMultiText from './TyMultiText'
import TyDateTime from './TyDateTime'
import TyDropdown from './TyDropdown'
import TyRadio2 from './TyRadio2'

//others
import TyExport from './TyExport'
import TyDialog from './TyDialog'

import TySteps from './TySteps'
import TyViewDone from './TyViewDone'
import TemplateDown from './TemplateDown'

import TyImgCaptcha from './TyImgCaptcha'
import TyDialogSuper from './TyDialogSuper'
import TyDialogTags from './TyDialogTags'
import TyWatermark from './TyWatermark'
import TyTree from './TyTree'



//design
import FmDesign from './FmDesign'
import PcForm from './PcForm'


//业务组件
import TyApproval from 'businessCom/TyApproval'
import TyApprovalBtn from 'businessCom/TyApprovalBtn'
import TyBusinessCrud from 'businessCom/TyBusinessCrud'
import TyBusinessFormManage from 'businessCom/TyBusinessFormManage'
import TyDepartment from 'businessCom/TyDepartment'
import TyBusinessCrud1 from 'businessCom/TyBusinessCrud1'
import TyFormEdit from 'businessCom/TyFormEdit'
import TyPcForm from 'businessCom/TyPcForm'
import TyFormContainer from 'businessCom/TyFormContainer'
import TyDetailHeader from 'businessCom/TyDetailHeader'
import TyBusinessCrud2 from 'businessCom/TyBusinessCrud2'
import TyCustomCalendar from 'businessCom/TyCustomCalendar'
//import TyBusinessImportExport from 'businessCom/TyBusinessImportExport'
import TyBusinessUploadExport from 'businessCom/TyBusinessUploadExport'



/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}


export default {
  install(Vue) {

    //base
    Vue.use(TyIcon);
    //bisiness
    Vue.use(TyCaptcha);
    Vue.use(TySelectArea);
    //data
    Vue.use(TyEditTable);
    Vue.use(TyTable);
    Vue.use(TyCodeEdit);
    //form
    Vue.use(TyCascader);
    Vue.use(TyDictionary);
    Vue.use(TyEditor);
    Vue.use(TyEditor2);
    Vue.use(TyUpload);
    Vue.use(TyUploadFile);
    Vue.use(TyUploadFile1);
    Vue.use(TyCheckbox);
    Vue.use(TyRadio);
    Vue.use(TyMultiText);
    Vue.use(TyDateTime);
    Vue.use(TyDropdown);
    Vue.use(TyRadio2);

    //others
    Vue.use(TyDialog);
    

    Vue.use(TySteps);
    Vue.use(TyViewDone);
    Vue.use(TemplateDown);
    Vue.use(TyImgCaptcha);
    Vue.use(TyTree);

    //design
    Vue.use(FmDesign);
    Vue.use(PcForm);

    Vue.use(TyExport);

    //业务组件
    Vue.use(TyBusinessCrud);
    Vue.use(TyBusinessFormManage);
    Vue.use(TyApprovalBtn);
    Vue.use(TyApproval);
    Vue.use(TyDepartment);
    Vue.use(TyBusinessCrud1);
    Vue.use(TyFormEdit);
    Vue.use(TyPcForm);
    Vue.use(TyDetailHeader);
    Vue.use(TyBusinessCrud2);
    Vue.use(TyFormContainer);
    Vue.use(TyDialogSuper);
    Vue.use(TyDialogTags);
    Vue.use(TyWatermark);
    Vue.use(TyCustomCalendar);
    //Vue.use(TyBusinessImportExport);
    Vue.use(TyBusinessUploadExport);
  },
}
