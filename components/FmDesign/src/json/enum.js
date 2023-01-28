/**
 * btnSizeList 按钮尺寸列表
 * @readonly
 * @enum {string}
 */
 export const BTN_SIZE_LIST = {
  /** 中等 */
  MEDIUM: 'medium',
  /** 小 */
  SMALL: 'small',
  /** 迷你 */
  MINI: 'mini',
  get options() {
    return [
      this.MEDIUM,
      this.SMALL,
      this.MINI
    ]
  }
}

/**
 * btnTypeList 按钮类型列表
 * @readonly
 * @enum {string}
 */
 export const BTN_TYPE_LIST = {
  /** 主要 */
  PRIMARY: 'primary',
  /** 成功 */
  SUCCESS: 'success',
  /** 信息 */
  INFO: 'info',
  /** 警告 */
  WARNING: 'warning',
  /** 危险 */
  DANGER: 'danger',
  get options() {
    return [
      this.PRIMARY,
      this.SUCCESS,
      this.INFO,
      this.WARNING,
      this.DANGER
    ]
  }
}

/**
 * borderStyleList 边框风格列表
 * @readonly
 * @enum {string}
 */
 export const BORDER_STYLE_LIST = {
  /** 无 */
  NONE: 'none',
  /** 虚线 */
  DASHED: 'dashed',
  /** 实线 */
  SOLID: 'solid',
  /** 点状 */
  DOTTED: 'dotted',
  /** 双线 */
  DOUBLE: 'double',
  get options() {
    return [
      {
        label:'无',
        value:this.NONE
      },
      {
        label:'虚线',
        value:this.DASHED
      },
      {
        label:'实线',
        value:this.SOLID
      },
      {
        label:'点状',
        value:this.DOTTED
      },
      {
        label:'双线',
        value:this.DOUBLE
      }
    ]
  }
}