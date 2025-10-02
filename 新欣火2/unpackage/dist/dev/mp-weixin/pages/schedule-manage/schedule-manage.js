(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/schedule-manage/schedule-manage"],{

/***/ 102:
/*!***********************************************************************************!*\
  !*** D:/代码/小程序/新欣火1/main.js?{"page":"pages%2Fschedule-manage%2Fschedule-manage"} ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
__webpack_require__(/*! @dcloudio/vue-cli-plugin-uni/packages/uni-cloud/dist/index.js */ 27);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _scheduleManage = _interopRequireDefault(__webpack_require__(/*! ./pages/schedule-manage/schedule-manage.vue */ 103));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_scheduleManage.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 103:
/*!****************************************************************!*\
  !*** D:/代码/小程序/新欣火1/pages/schedule-manage/schedule-manage.vue ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _schedule_manage_vue_vue_type_template_id_c9c8c084___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./schedule-manage.vue?vue&type=template&id=c9c8c084& */ 104);
/* harmony import */ var _schedule_manage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./schedule-manage.vue?vue&type=script&lang=js& */ 106);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _schedule_manage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _schedule_manage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _schedule_manage_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./schedule-manage.vue?vue&type=style&index=0&lang=css& */ 109);
/* harmony import */ var _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 44);

var renderjs





/* normalize component */

var component = Object(_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _schedule_manage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _schedule_manage_vue_vue_type_template_id_c9c8c084___WEBPACK_IMPORTED_MODULE_0__["render"],
  _schedule_manage_vue_vue_type_template_id_c9c8c084___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null,
  false,
  _schedule_manage_vue_vue_type_template_id_c9c8c084___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages/schedule-manage/schedule-manage.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 104:
/*!***********************************************************************************************!*\
  !*** D:/代码/小程序/新欣火1/pages/schedule-manage/schedule-manage.vue?vue&type=template&id=c9c8c084& ***!
  \***********************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_schedule_manage_vue_vue_type_template_id_c9c8c084___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./schedule-manage.vue?vue&type=template&id=c9c8c084& */ 105);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_schedule_manage_vue_vue_type_template_id_c9c8c084___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_schedule_manage_vue_vue_type_template_id_c9c8c084___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_schedule_manage_vue_vue_type_template_id_c9c8c084___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_schedule_manage_vue_vue_type_template_id_c9c8c084___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 105:
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/代码/小程序/新欣火1/pages/schedule-manage/schedule-manage.vue?vue&type=template&id=c9c8c084& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return recyclableRender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
var components
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  var g0 = !_vm.isTeacher ? _vm.filteredUserList.length : null
  var g1 = _vm.isMultiDateMode ? _vm.selectedDates.length : null
  var m0 = _vm.isMultiDateMode ? _vm.getCurrentWeekRange() : null
  var l0 = _vm.isMultiDateMode
    ? _vm.__map(_vm.getAllAvailableDates(), function (date, index) {
        var $orig = _vm.__get_orig(date)
        var m1 = _vm.isDateSelected(date)
        var m2 = _vm.isMonthStart(date)
        var m3 = _vm.isDifferentMonth(date, index)
        var m4 = _vm.formatDate(date, "MM-dd")
        var m5 = _vm.getWeekdayName(date)
        var m6 = _vm.isMonthStart(date)
        var m7 = m6 ? _vm.formatDate(date, "MM月") : null
        return {
          $orig: $orig,
          m1: m1,
          m2: m2,
          m3: m3,
          m4: m4,
          m5: m5,
          m6: m6,
          m7: m7,
        }
      })
    : null
  var l1 = _vm.showWeekPickerModal ? _vm.getWeekOptions() : null
  var l2 =
    !_vm.isLoading && !!_vm.daySchedule
      ? _vm.__map(_vm.visibleSlots, function (slot, __i0__) {
          var $orig = _vm.__get_orig(slot)
          var m8 = _vm.getTimeLabel(slot - 1)
          var m9 = _vm.getTypeIndex(slot - 1)
          var m10 = _vm.getTypeDisplay(slot - 1)
          return {
            $orig: $orig,
            m8: m8,
            m9: m9,
            m10: m10,
          }
        })
      : null
  if (!_vm._isMounted) {
    _vm.e0 = function ($event, date) {
      var _temp = arguments[arguments.length - 1].currentTarget.dataset,
        _temp2 = _temp.eventParams || _temp["event-params"],
        date = _temp2.date
      var _temp, _temp2
      return _vm.toggleDateSelection(date)
    }
    _vm.e1 = function ($event, week) {
      var _temp3 = arguments[arguments.length - 1].currentTarget.dataset,
        _temp4 = _temp3.eventParams || _temp3["event-params"],
        week = _temp4.week
      var _temp3, _temp4
      return _vm.selectWeek(week.weekOffset)
    }
  }
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        g0: g0,
        g1: g1,
        m0: m0,
        l0: l0,
        l1: l1,
        l2: l2,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 106:
/*!*****************************************************************************************!*\
  !*** D:/代码/小程序/新欣火1/pages/schedule-manage/schedule-manage.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_schedule_manage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./schedule-manage.vue?vue&type=script&lang=js& */ 107);
/* harmony import */ var _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_schedule_manage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_schedule_manage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_schedule_manage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_schedule_manage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_schedule_manage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 107:
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/代码/小程序/新欣火1/pages/schedule-manage/schedule-manage.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni, uniCloud) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _courseColor = __webpack_require__(/*! ../../utils/courseColor.js */ 108);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var _default = {
  data: function data() {
    return {
      allUserList: [],
      // 存储所有用户的原始列表
      userIndex: 0,
      isTeacher: false,
      currentUser: null,
      currentDate: new Date(),
      selectedDates: [],
      // 多选日期数组
      isMultiDateMode: false,
      // 是否开启多选模式
      daySchedule: {
        courses: ['', '', '', '', '', ''],
        types: ['无', '无', '无', '无', '无', '无'],
        locations: ['', '', '', '', '', ''],
        classes: ['', '', '', '', '', ''],
        remarks: ['', '', '', '', '', ''] // 新增备注字段
      },

      isLoading: true,
      searchKeyword: '',
      // 搜索关键词
      courseTypes: ['无', '一对一', '班课', '脱产生'],
      remark: '',
      // 新增remark字段，防止页面报错
      visibleSlots: [1, 2, 3, 4, 5, 6],
      // 多选日期相关
      weekOffset: 0,
      // 周偏移量，0表示当前周，1表示下一周，-1表示上一周
      scrollLeft: 0,
      // 滚动位置
      showWeekPickerModal: false // 周选择器弹窗显示状态
    };
  },

  computed: {
    dayDisplay: function dayDisplay() {
      var date = this.currentDate;
      var dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      var isToday = this.formatDate(new Date(), 'yyyy-MM-dd') === this.formatDate(date, 'yyyy-MM-dd');
      return "".concat(this.formatDate(date, 'yyyy-MM-dd'), " ").concat(dayNames[date.getDay()], " ").concat(isToday ? '(今天)' : '');
    },
    // 根据搜索关键词过滤用户列表
    filteredUserList: function filteredUserList() {
      var _this = this;
      var list;
      if (!this.searchKeyword) {
        list = this.allUserList;
      } else {
        list = this.allUserList.filter(function (user) {
          return user.teacherName && user.teacherName.toLowerCase().includes(_this.searchKeyword.toLowerCase());
        });
      }
      // 为每个用户添加 displayName 属性
      var result = list.map(function (user) {
        return _objectSpread(_objectSpread({}, user), {}, {
          displayName: user.teacherName || user.username || user.nickname || '未知用户'
        });
      });
      console.log('🔍 filteredUserList 处理结果:', result.length, '个用户');
      if (result.length > 0) {
        console.log('🔍 第一个用户:', result[0]);
        console.log('🔍 当前 userIndex:', this.userIndex);
        if (this.userIndex < result.length) {
          console.log('🔍 当前选中用户:', result[this.userIndex]);
        }
      }
      return result;
    }
  },
  watch: {
    // 监听搜索关键词的变化
    searchKeyword: function searchKeyword() {
      var _this2 = this;
      // 当筛选条件变化，重置选择器到第一项
      this.userIndex = 0;
      this.$nextTick(function () {
        _this2.updateCurrentUserAndFetchSchedule();
      });
    }
  },
  onLoad: function onLoad() {
    // 读取路由参数（通过气泡入口可能会传入指定教师与日期）
    var pages = getCurrentPages();
    var current = pages[pages.length - 1] || {};
    var options = current.options || {};
    var uid = options.uid,
      username = options.username,
      date = options.date;
    // 若传入了日期，优先设置日期
    if (date) {
      try {
        this.currentDate = new Date(date);
      } catch (e) {}
    }
    if (uid) {
      // 从外部指定了教师，走管理员视角，按uid在用户列表中定位
      this.isTeacher = false;
      this._pendingUid = uid;
      this._pendingUsername = username || '';
      this.fetchUsers();
      return;
    }
    // 正常逻辑：教师自己进入
    var userInfo = uni.getStorageSync('userInfo');
    if (userInfo && userInfo.role && userInfo.role.includes('教师')) {
      this.isTeacher = true;
      this.currentUser = userInfo;
      this.fetchDaySchedule();
    } else {
      this.fetchUsers();
    }
  },
  onReady: function onReady() {
    // 确保数据响应性
    this.$forceUpdate();
  },
  methods: {
    fetchUsers: function fetchUsers() {
      var _this3 = this;
      console.log('🔍 开始获取用户列表...');
      uniCloud.callFunction({
        name: 'user-center',
        data: {
          action: 'get-accounts'
        },
        success: function success(res) {
          console.log('📡 用户列表返回结果:', res);
          var result = res.result;
          if (result.code === 200 && result.data.length > 0) {
            console.log('✅ 获取用户列表成功，用户数量:', result.data.length);
            _this3.allUserList = result.data; // 存入原始列表
            console.log('用户列表:', _this3.allUserList);
            // 如果有待定位的uid（来源于气泡跳转），在这里定位用户
            if (_this3._pendingUid) {
              var idx = _this3.allUserList.findIndex(function (u) {
                return u._id === _this3._pendingUid;
              });
              if (idx !== -1) {
                _this3.currentUser = _this3.allUserList[idx];
                console.log('🎯 通过uid定位到用户:', _this3.currentUser);
                // 找到该用户在过滤后列表中的索引
                var filteredIdx = _this3.filteredUserList.findIndex(function (u) {
                  return u._id === _this3._pendingUid;
                });
                if (filteredIdx !== -1) {
                  _this3.userIndex = filteredIdx;
                  console.log('🎯 在过滤列表中用户索引已设置为:', _this3.userIndex);
                } else {
                  console.warn('⚠️ 用户在过滤列表中未找到，可能被搜索关键词过滤');
                }
                _this3._pendingUid = '';
                _this3._pendingUsername = '';
                _this3.fetchDaySchedule();
                return;
              }
              // 兜底：尝试用用户名匹配
              if (_this3._pendingUsername) {
                var byName = _this3.allUserList.findIndex(function (u) {
                  return u.username === _this3._pendingUsername || u.teacherName === _this3._pendingUsername || u.nickname === _this3._pendingUsername;
                });
                if (byName !== -1) {
                  _this3.currentUser = _this3.allUserList[byName];
                  console.log('🎯 通过用户名定位到用户:', _this3.currentUser);
                  // 找到该用户在过滤后列表中的索引
                  var _filteredIdx = _this3.filteredUserList.findIndex(function (u) {
                    return u._id === _this3.allUserList[byName]._id;
                  });
                  if (_filteredIdx !== -1) {
                    _this3.userIndex = _filteredIdx;
                    console.log('🎯 在过滤列表中用户索引已设置为:', _this3.userIndex);
                  } else {
                    console.warn('⚠️ 用户在过滤列表中未找到，可能被搜索关键词过滤');
                  }
                  _this3._pendingUid = '';
                  _this3._pendingUsername = '';
                  _this3.fetchDaySchedule();
                  return;
                }
              }
            }
            // 如果没有待定位的uid，使用默认逻辑
            _this3.$nextTick(function () {
              _this3.updateCurrentUserAndFetchSchedule();
              // 强制触发响应式更新
              _this3.$forceUpdate();
            });
          } else {
            console.error('❌ 获取用户列表失败:', result.message || '未知错误');
            _this3.allUserList = [];
            _this3.isLoading = false;
          }
        },
        fail: function fail(err) {
          console.error('❌ 获取用户列表请求失败:', err);
          _this3.isLoading = false;
          uni.showToast({
            title: '获取用户列表失败: ' + (err.message || '网络错误'),
            icon: 'none'
          });
        }
      });
    },
    fetchDaySchedule: function fetchDaySchedule() {
      var _this4 = this;
      if (!this.currentUser) {
        console.log('❌ 当前用户为空，无法获取课表');
        return;
      }
      this.isLoading = true;
      var date = this.formatDate(this.currentDate, 'yyyy-MM-dd');

      // 添加调试日志
      console.log('🔍 开始获取课表数据:');
      console.log('当前用户:', this.currentUser);
      console.log('查询日期:', date);
      console.log('用户ID:', this.currentUser._id);
      console.log('用户名:', this.currentUser.username);
      uniCloud.callFunction({
        name: 'schedule-center',
        data: {
          action: 'get-schedules',
          params: {
            username: this.currentUser.username,
            uid: this.currentUser._id,
            date: date
          }
        },
        success: function success(res) {
          console.log('📡 云函数返回结果:', res);
          var result = res.result;
          if (result.code === 200) {
            console.log('✅ 查询成功，返回数据:', result.data);
            if (result.data) {
              // 安全校验：如果接口返回的 uid/username 与当前用户不一致，提示并不覆盖本页数据
              if (result.data.uid && _this4.currentUser && result.data.uid !== _this4.currentUser._id || result.data.username && _this4.currentUser && result.data.username !== _this4.currentUser.username) {
                console.warn('⚠️ 返回数据的用户与当前选择不一致，已忽略', {
                  currentUser: _this4.currentUser,
                  resultUser: {
                    uid: result.data.uid,
                    username: result.data.username
                  }
                });
                uni.showToast({
                  title: '系统返回了其他教师的数据，已忽略',
                  icon: 'none'
                });
                return;
              }
              // 使用 $set 确保响应性
              _this4.$set(_this4, 'daySchedule', {
                courses: [result.data.course_slot_1 || '', result.data.course_slot_2 || '', result.data.course_slot_3 || '', result.data.course_slot_4 || '', result.data.course_slot_5 || '', result.data.course_slot_6 || ''],
                types: [result.data.course_slot_1_type || '无', result.data.course_slot_2_type || '无', result.data.course_slot_3_type || '无', result.data.course_slot_4_type || '无', result.data.course_slot_5_type || '无', result.data.course_slot_6_type || '无'],
                locations: [result.data.course_slot_1_location || '', result.data.course_slot_2_location || '', result.data.course_slot_3_location || '', result.data.course_slot_4_location || '', result.data.course_slot_5_location || '', result.data.course_slot_6_location || ''],
                classes: [result.data.course_slot_1_class || '', result.data.course_slot_2_class || '', result.data.course_slot_3_class || '', result.data.course_slot_4_class || '', result.data.course_slot_5_class || '', result.data.course_slot_6_class || ''],
                remarks: [result.data.course_slot_1_remark || '', result.data.course_slot_2_remark || '', result.data.course_slot_3_remark || '', result.data.course_slot_4_remark || '', result.data.course_slot_5_remark || '', result.data.course_slot_6_remark || '']
              });
              console.log('✅ 课表数据已更新:', _this4.daySchedule);
            } else {
              console.log('⚠️ 查询结果为空，设置默认空数据');
              _this4.$set(_this4, 'daySchedule', {
                courses: ['', '', '', '', '', ''],
                types: ['无', '无', '无', '无', '无', '无'],
                locations: ['', '', '', '', '', ''],
                classes: ['', '', '', '', '', ''],
                remarks: ['', '', '', '', '', '']
              });
            }
          } else {
            console.error('❌ 查询失败:', result.message);
            uni.showToast({
              title: '查询失败: ' + (result.message || '未知错误'),
              icon: 'none'
            });
          }
        },
        fail: function fail(err) {
          console.error('❌ 请求失败:', err);
          uni.showToast({
            title: '查询请求失败: ' + (err.message || '网络错误'),
            icon: 'none'
          });
        },
        complete: function complete() {
          _this4.isLoading = false;
          console.log('🏁 课表获取完成');
        }
      });
    },
    onTypeChange: function onTypeChange(slotIndex, event) {
      var typeIndex = event.detail.value;
      this.$set(this.daySchedule.types, slotIndex, this.courseTypes[typeIndex]);
    },
    getTypeIndex: function getTypeIndex(slotIndex) {
      return this.courseTypes.indexOf(this.daySchedule.types[slotIndex]);
    },
    getTypeDisplay: function getTypeDisplay(slotIndex) {
      return this.daySchedule.types[slotIndex] || '无';
    },
    saveSchedule: function saveSchedule() {
      var _this5 = this;
      // 优先用 currentUser，没有就用本地缓存
      var userInfo = this.currentUser;
      if (!userInfo || !userInfo._id) {
        userInfo = uni.getStorageSync('userInfo') || {};
      }
      if (!userInfo._id) {
        uni.showToast({
          title: '用户信息缺失，请重新登录',
          icon: 'none'
        });
        return;
      }

      // 确定要保存的日期
      var datesToSave = this.isMultiDateMode ? this.selectedDates : [this.currentDate];
      if (this.isMultiDateMode && this.selectedDates.length === 0) {
        uni.showToast({
          title: '请选择要排课的日期',
          icon: 'none'
        });
        return;
      }
      console.log('💾 开始保存排课数据，日期数量:', datesToSave.length);

      // 显示保存进度
      uni.showLoading({
        title: "\u6B63\u5728\u4FDD\u5B58".concat(datesToSave.length, "\u4E2A\u65E5\u671F\u7684\u6392\u8BFE...")
      });

      // 批量保存
      var savePromises = datesToSave.map(function (date) {
        var dateStr = _this5.formatDate(date, 'yyyy-MM-dd');
        console.log('📅 保存日期:', dateStr);
        // 构建课程数据，每节课独立保存
        var scheduleData = {
          username: userInfo.username,
          uid: userInfo._id,
          // 保证uid一定有值
          date: dateStr
        };

        // 验证必要参数
        if (!userInfo.username || !userInfo._id || !dateStr) {
          console.error('❌ 缺少必要参数:', {
            username: userInfo.username,
            uid: userInfo._id,
            date: dateStr
          });
          throw new Error('缺少必要参数');
        }

        // 为6节课设置数据，每节课独立
        for (var i = 0; i < 6; i++) {
          var courseSlot = i + 1; // 第1-6节课

          scheduleData["course_slot_".concat(courseSlot)] = _this5.daySchedule.courses[i] || '';
          scheduleData["course_slot_".concat(courseSlot, "_type")] = _this5.daySchedule.types[i] || '';
          scheduleData["course_slot_".concat(courseSlot, "_location")] = _this5.daySchedule.locations[i] || '';
          scheduleData["course_slot_".concat(courseSlot, "_class")] = _this5.daySchedule.classes[i] || '';
          scheduleData["course_slot_".concat(courseSlot, "_remark")] = _this5.daySchedule.remarks[i] || ''; // 保存备注
        }

        // 为第7-8节课设置空数据（保持兼容）
        for (var _i = 6; _i < 8; _i++) {
          var _courseSlot = _i + 1;
          scheduleData["course_slot_".concat(_courseSlot)] = '';
          scheduleData["course_slot_".concat(_courseSlot, "_type")] = '无';
          scheduleData["course_slot_".concat(_courseSlot, "_location")] = '';
          scheduleData["course_slot_".concat(_courseSlot, "_class")] = '';
          scheduleData["course_slot_".concat(_courseSlot, "_remark")] = ''; // 空备注
        }

        var adminInfo = uni.getStorageSync('userInfo') || {};
        var adminName = adminInfo.realName || adminInfo.username || '';
        var remark = _this5.remark || '';

        // 取第1节课的课程名称、班级、教室、类型作为消息主内容（如有多节课可自行扩展）
        var courseName = _this5.daySchedule.courses[0] || '';
        var className = _this5.daySchedule.classes[0] || '';
        var classroom = _this5.daySchedule.locations[0] || '';
        var courseType = _this5.daySchedule.types[0] || '';
        var scheduleTime = "".concat(dateStr, " 08:00-10:00"); // 如有时间选择器可动态生成

        console.log('排课参数', _objectSpread(_objectSpread({}, scheduleData), {}, {
          adminName: adminName,
          remark: remark,
          courseName: courseName,
          className: className,
          classroom: classroom,
          courseType: courseType,
          scheduleTime: scheduleTime
        }));
        return uniCloud.callFunction({
          name: 'schedule-center',
          data: {
            action: 'set-schedule',
            params: _objectSpread(_objectSpread({}, scheduleData), {}, {
              adminId: userInfo._id,
              // 发起人id
              adminName: adminName,
              remark: remark,
              courseName: courseName,
              className: className,
              classroom: classroom,
              courseType: courseType,
              scheduleTime: scheduleTime
            })
          }
        }).then(function (result) {
          console.log('📡 云函数返回结果:', result);
          if (result.result && result.result.code !== 200) {
            console.error('❌ 云函数返回错误:', {
              code: result.result.code,
              message: result.result.message,
              error: result.result.error
            });
          }
          return result;
        }).catch(function (error) {
          console.error('❌ 云函数调用失败:', error);
          return {
            result: {
              code: 500,
              message: '云函数调用失败: ' + error.message
            }
          };
        });
      });
      Promise.all(savePromises).then(function (results) {
        uni.hideLoading();
        console.log('📡 批量保存结果:', results);

        // 详细分析每个结果
        results.forEach(function (result, index) {
          console.log("\uD83D\uDCCA \u7B2C".concat(index + 1, "\u4E2A\u65E5\u671F\u7684\u4FDD\u5B58\u7ED3\u679C:"), {
            success: result.success,
            errCode: result.errCode,
            result: result.result
          });
          if (result.result && result.result.code !== 200) {
            console.error("\u274C \u7B2C".concat(index + 1, "\u4E2A\u65E5\u671F\u4FDD\u5B58\u5931\u8D25:"), {
              code: result.result.code,
              message: result.result.message,
              error: result.result.error
            });
          }
        });
        var successCount = results.filter(function (res) {
          return res.result && res.result.code === 200;
        }).length;
        var totalCount = results.length;
        if (successCount === totalCount) {
          uni.showToast({
            title: "\u6210\u529F\u4FDD\u5B58".concat(successCount, "\u4E2A\u65E5\u671F\u7684\u6392\u8BFE"),
            icon: 'success',
            duration: 2000
          });
        } else {
          var failedCount = totalCount - successCount;
          uni.showToast({
            title: "\u4FDD\u5B58\u5B8C\u6210\uFF1A".concat(successCount, "/").concat(totalCount, "\u4E2A\u65E5\u671F\u6210\u529F\uFF0C").concat(failedCount, "\u4E2A\u5931\u8D25"),
            icon: 'none',
            duration: 3000
          });
        }
      }).catch(function (err) {
        uni.hideLoading();
        console.error('❌ 批量保存失败:', err);
        uni.showToast({
          title: '保存失败，请重试',
          icon: 'none'
        });
      });
    },
    changeDay: function changeDay(direction) {
      this.currentDate.setDate(this.currentDate.getDate() + direction);
      this.currentDate = new Date(this.currentDate);
      this.fetchDaySchedule();
    },
    onUserChange: function onUserChange(e) {
      this.userIndex = e.detail.value;
      this.updateCurrentUserAndFetchSchedule();
    },
    // 切换多选日期模式
    toggleMultiDateMode: function toggleMultiDateMode() {
      this.isMultiDateMode = !this.isMultiDateMode;
      if (this.isMultiDateMode && this.selectedDates.length === 0) {
        // 进入多选模式时，默认选择当前日期
        this.selectedDates = [new Date(this.currentDate)];
      }
    },
    // 获取一周的日期
    getWeekDates: function getWeekDates() {
      var dates = [];
      var today = new Date(this.currentDate);
      var startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // 从周日开始

      for (var i = 0; i < 7; i++) {
        var date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        dates.push(date);
      }
      return dates;
    },
    // 获取所有可用的日期（4个月）
    getAllAvailableDates: function getAllAvailableDates() {
      var dates = [];
      var today = new Date();
      var startDate = new Date(today);
      startDate.setDate(today.getDate() - today.getDay()); // 从当前周的周日开始

      // 生成4个月的日期（当前周 + 后4个月）
      var totalWeeks = 4 * 4 + 2; // 4个月约等于18周，加上当前周
      for (var week = 0; week < totalWeeks; week++) {
        for (var day = 0; day < 7; day++) {
          var date = new Date(startDate);
          date.setDate(startDate.getDate() + week * 7 + day);
          dates.push(date);
        }
      }
      return dates;
    },
    // 获取当前周范围
    getCurrentWeekRange: function getCurrentWeekRange() {
      var today = new Date();
      var startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      var endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      // 如果跨月，显示月份信息
      if (startOfWeek.getMonth() !== endOfWeek.getMonth()) {
        return "".concat(this.formatDate(startOfWeek, 'MM月dd日'), " ~ ").concat(this.formatDate(endOfWeek, 'MM月dd日'));
      } else {
        return "".concat(this.formatDate(startOfWeek, 'MM-dd'), " ~ ").concat(this.formatDate(endOfWeek, 'MM-dd'));
      }
    },
    // 检查日期是否被选中
    isDateSelected: function isDateSelected(date) {
      var _this6 = this;
      // 确保传入的date是Date对象
      var targetDate = date instanceof Date ? date : new Date(date);
      return this.selectedDates.some(function (selectedDate) {
        // 确保selectedDate也是Date对象
        var compareDate = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
        return _this6.formatDate(compareDate, 'yyyy-MM-dd') === _this6.formatDate(targetDate, 'yyyy-MM-dd');
      });
    },
    // 切换日期选择状态
    toggleDateSelection: function toggleDateSelection(date) {
      var _this7 = this;
      // 确保传入的date是Date对象
      var targetDate = date instanceof Date ? date : new Date(date);
      var dateStr = this.formatDate(targetDate, 'yyyy-MM-dd');
      var index = this.selectedDates.findIndex(function (selectedDate) {
        // 确保selectedDate也是Date对象
        var compareDate = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
        return _this7.formatDate(compareDate, 'yyyy-MM-dd') === dateStr;
      });
      if (index > -1) {
        this.selectedDates.splice(index, 1);
      } else {
        this.selectedDates.push(new Date(targetDate));
      }
    },
    // 选择所有工作日
    selectAllWeekdays: function selectAllWeekdays() {
      var _this8 = this;
      this.selectedDates = [];
      var weekDates = this.getWeekDates();
      weekDates.forEach(function (date) {
        var day = date.getDay();
        if (day >= 1 && day <= 5) {
          // 周一到周五
          _this8.selectedDates.push(new Date(date));
        }
      });
    },
    // 清空选择的日期
    clearSelectedDates: function clearSelectedDates() {
      this.selectedDates = [];
    },
    // 切换周
    changeWeek: function changeWeek(direction) {
      var _this9 = this;
      this.weekOffset += direction;
      // 限制周偏移量在合理范围内
      this.weekOffset = Math.max(0, Math.min(this.weekOffset, 18)); // 最多18周（4个月）
      // 自动滚动到当前周的位置
      this.$nextTick(function () {
        _this9.scrollToCurrentWeek();
      });
    },
    // 滚动到当前周
    scrollToCurrentWeek: function scrollToCurrentWeek() {
      // 计算当前周在滚动容器中的位置
      var itemWidth = 80; // 每个日期项的宽度（rpx转换为px）
      this.scrollLeft = this.weekOffset * 7 * itemWidth;
    },
    // 处理日期滚动事件
    onDateScroll: function onDateScroll(e) {
      // 可以根据滚动位置更新当前周
      var scrollLeft = e.detail.scrollLeft;
      var itemWidth = 80;
      var weekIndex = Math.round(scrollLeft / (7 * itemWidth));
      this.weekOffset = Math.max(0, Math.min(weekIndex, 18)); // 限制在0-18周范围内
    },
    // 获取星期名称
    getWeekdayName: function getWeekdayName(date) {
      var dayNames = ['日', '一', '二', '三', '四', '五', '六'];
      return dayNames[date.getDay()];
    },
    // 判断是否是月份开始
    isMonthStart: function isMonthStart(date) {
      return date.getDate() === 1;
    },
    // 判断是否与前一天是不同月份
    isDifferentMonth: function isDifferentMonth(date, index) {
      if (index === 0) return false;
      var prevDate = this.getAllAvailableDates()[index - 1];
      return date.getMonth() !== prevDate.getMonth();
    },
    // 显示周选择器
    showWeekPicker: function showWeekPicker() {
      this.showWeekPickerModal = true;
    },
    // 隐藏周选择器
    hideWeekPicker: function hideWeekPicker() {
      this.showWeekPickerModal = false;
    },
    // 获取周选项列表
    getWeekOptions: function getWeekOptions() {
      var options = [];
      var today = new Date();
      var startDate = new Date(today);
      startDate.setDate(today.getDate() - today.getDay()); // 从当前周的周日开始

      for (var week = 0; week < 18; week++) {
        var weekStart = new Date(startDate);
        weekStart.setDate(startDate.getDate() + week * 7);
        var weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        var label = '';
        if (week === 0) {
          label = "\u672C\u5468 (".concat(this.formatDate(weekStart, 'MM-dd'), " ~ ").concat(this.formatDate(weekEnd, 'MM-dd'), ")");
        } else if (week === 1) {
          label = "\u4E0B\u5468 (".concat(this.formatDate(weekStart, 'MM-dd'), " ~ ").concat(this.formatDate(weekEnd, 'MM-dd'), ")");
        } else {
          label = "\u7B2C".concat(week + 1, "\u5468 (").concat(this.formatDate(weekStart, 'MM-dd'), " ~ ").concat(this.formatDate(weekEnd, 'MM-dd'), ")");
        }
        options.push({
          weekOffset: week,
          label: label
        });
      }
      return options;
    },
    // 选择周
    selectWeek: function selectWeek(weekOffset) {
      var _this10 = this;
      this.weekOffset = weekOffset;
      this.hideWeekPicker();
      this.$nextTick(function () {
        _this10.scrollToCurrentWeek();
      });
    },
    // 新增一个统一更新当前用户并获取课表的方法
    updateCurrentUserAndFetchSchedule: function updateCurrentUserAndFetchSchedule() {
      console.log('🔄 更新当前用户并获取课表...');
      console.log('当前搜索关键词:', this.searchKeyword);
      console.log('原始用户列表长度:', this.allUserList.length);
      console.log('过滤后用户列表长度:', this.filteredUserList.length);
      console.log('当前用户索引:', this.userIndex);
      if (this.filteredUserList.length > 0) {
        // 确保 userIndex 在有效范围内
        if (this.userIndex >= this.filteredUserList.length) {
          this.userIndex = 0;
          console.log('⚠️ 用户索引超出范围，重置为0');
        }
        this.currentUser = this.filteredUserList[this.userIndex];
        console.log('✅ 当前用户已更新:', this.currentUser);
        console.log('用户索引:', this.userIndex);
        console.log('✅ 当前用户 displayName:', this.currentUser.displayName);
        this.fetchDaySchedule();
      } else {
        console.warn('⚠️ 过滤后用户列表为空，设置默认状态');
        this.currentUser = null;
        this.$set(this, 'daySchedule', {
          courses: ['', '', '', '', '', ''],
          types: ['无', '无', '无', '无', '无', '无'],
          locations: ['', '', '', '', '', ''],
          classes: ['', '', '', '', '', ''],
          remarks: ['', '', '', '', '', '']
        });
        this.isLoading = false;
      }
    },
    formatDate: function formatDate(date, fmt) {
      // 确保date是Date对象
      if (!(date instanceof Date)) {
        date = new Date(date);
      }

      // 检查date是否有效
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', date);
        return '';
      }
      var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate()
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
      }
      return fmt;
    },
    goBack: function goBack() {
      uni.navigateBack();
    },
    returnToToday: function returnToToday() {
      this.currentDate = new Date();
      this.fetchDaySchedule();
    },
    getTimeLabel: function getTimeLabel(index) {
      var times = ['8:00-10:00',
      // 第1节课
      '10:10-12:10',
      // 第2节课
      '14:00-16:00',
      // 第3节课
      '16:10-18:10',
      // 第4节课
      '18:00-20:00',
      // 第5节课
      '20:00-22:00' // 第6节课
      ];

      return times[index];
    },
    getCourseColor: function getCourseColor(type, className) {
      return (0, _courseColor.getCourseColor)(type, className);
    },
    onCourseChange: function onCourseChange(event, slotIndex, field) {
      var value = event.detail.value;
      console.log('课程信息变化:', {
        slotIndex: slotIndex,
        field: field,
        value: value
      });
      switch (field) {
        case 'course':
          this.$set(this.daySchedule.courses, slotIndex, value);
          break;
        case 'location':
          this.$set(this.daySchedule.locations, slotIndex, value);
          break;
        case 'class':
          this.$set(this.daySchedule.classes, slotIndex, value);
          break;
        case 'remark':
          this.$set(this.daySchedule.remarks, slotIndex, value);
          break;
      }
    },
    onInputFocus: function onInputFocus(event) {
      console.log('输入框获得焦点:', event);
    },
    onInputChange: function onInputChange(event) {
      console.log('输入框内容变化:', event);
    }
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/uni-cloud/dist/index.js */ 27)["uniCloud"]))

/***/ }),

/***/ 109:
/*!*************************************************************************************************!*\
  !*** D:/代码/小程序/新欣火1/pages/schedule-manage/schedule-manage.vue?vue&type=style&index=0&lang=css& ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_schedule_manage_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--6-oneOf-1-3!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./schedule-manage.vue?vue&type=style&index=0&lang=css& */ 110);
/* harmony import */ var _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_schedule_manage_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_schedule_manage_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_schedule_manage_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_schedule_manage_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_schedule_manage_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 110:
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/代码/小程序/新欣火1/pages/schedule-manage/schedule-manage.vue?vue&type=style&index=0&lang=css& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[102,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/schedule-manage/schedule-manage.js.map