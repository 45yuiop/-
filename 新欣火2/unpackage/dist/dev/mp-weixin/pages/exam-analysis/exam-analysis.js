(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/exam-analysis/exam-analysis"],{

/***/ 310:
/*!*******************************************************************************!*\
  !*** D:/代码/小程序/新欣火1/main.js?{"page":"pages%2Fexam-analysis%2Fexam-analysis"} ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
__webpack_require__(/*! @dcloudio/vue-cli-plugin-uni/packages/uni-cloud/dist/index.js */ 27);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _examAnalysis = _interopRequireDefault(__webpack_require__(/*! ./pages/exam-analysis/exam-analysis.vue */ 311));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_examAnalysis.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 311:
/*!************************************************************!*\
  !*** D:/代码/小程序/新欣火1/pages/exam-analysis/exam-analysis.vue ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _exam_analysis_vue_vue_type_template_id_36a69848_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./exam-analysis.vue?vue&type=template&id=36a69848&scoped=true& */ 312);
/* harmony import */ var _exam_analysis_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./exam-analysis.vue?vue&type=script&lang=js& */ 314);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _exam_analysis_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _exam_analysis_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _exam_analysis_vue_vue_type_style_index_0_id_36a69848_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./exam-analysis.vue?vue&type=style&index=0&id=36a69848&scoped=true&lang=css& */ 316);
/* harmony import */ var _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 44);

var renderjs





/* normalize component */

var component = Object(_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _exam_analysis_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _exam_analysis_vue_vue_type_template_id_36a69848_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _exam_analysis_vue_vue_type_template_id_36a69848_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "36a69848",
  null,
  false,
  _exam_analysis_vue_vue_type_template_id_36a69848_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages/exam-analysis/exam-analysis.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 312:
/*!*******************************************************************************************************!*\
  !*** D:/代码/小程序/新欣火1/pages/exam-analysis/exam-analysis.vue?vue&type=template&id=36a69848&scoped=true& ***!
  \*******************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_exam_analysis_vue_vue_type_template_id_36a69848_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./exam-analysis.vue?vue&type=template&id=36a69848&scoped=true& */ 313);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_exam_analysis_vue_vue_type_template_id_36a69848_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_exam_analysis_vue_vue_type_template_id_36a69848_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_exam_analysis_vue_vue_type_template_id_36a69848_scoped_true___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_exam_analysis_vue_vue_type_template_id_36a69848_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 313:
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/代码/小程序/新欣火1/pages/exam-analysis/exam-analysis.vue?vue&type=template&id=36a69848&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
  var g0 = _vm.examImageFileIDs.length
  var g1 = _vm.examImageFileIDs.length
  var g2 = _vm.examImages.length
  var g3 = _vm.analysisImageFileIDs.length
  var g4 = _vm.analysisImageFileIDs.length
  var g5 = _vm.analysisImages.length
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        g0: g0,
        g1: g1,
        g2: g2,
        g3: g3,
        g4: g4,
        g5: g5,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 314:
/*!*************************************************************************************!*\
  !*** D:/代码/小程序/新欣火1/pages/exam-analysis/exam-analysis.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_exam_analysis_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./exam-analysis.vue?vue&type=script&lang=js& */ 315);
/* harmony import */ var _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_exam_analysis_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_exam_analysis_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_exam_analysis_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_exam_analysis_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_exam_analysis_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 315:
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/代码/小程序/新欣火1/pages/exam-analysis/exam-analysis.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni, uniCloud) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ 28));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ 18));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 31));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var ImageZoomViewer = function ImageZoomViewer() {
  __webpack_require__.e(/*! require.ensure | components/ImageZoomViewer */ "components/ImageZoomViewer").then((function () {
    return resolve(__webpack_require__(/*! @/components/ImageZoomViewer.vue */ 374));
  }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};
var _default = {
  components: {
    ImageZoomViewer: ImageZoomViewer
  },
  data: function data() {
    return {
      // 年级相关
      gradeList: [],
      gradeIndex: 0,
      selectedGrade: '',
      // 学生相关
      studentList: [],
      studentIndex: 0,
      selectedStudent: null,
      // 年份相关
      yearList: [],
      yearIndex: 0,
      selectedYear: '',
      // 月份相关
      monthList: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      monthIndex: 0,
      selectedMonth: '',
      // 考试类型
      examTypes: ['期中', '元调', '二调', '四调', '中考', '月考', '期末'],
      selectedExamType: '',
      customExamType: '',
      // 试卷图片 - 分别存储云存储文件ID和本地图片路径
      examImages: [],
      // 本地新选择的图片路径
      examImageFileIDs: [],
      // 云存储的文件ID

      // 分析内容
      analysisText: '',
      analysisImages: [],
      // 本地新选择的图片路径
      analysisImageFileIDs: [],
      // 云存储的文件ID

      // 评分
      difficultyRating: 0,
      studentPerformance: 0,
      // 编辑模式
      isEdit: false,
      editId: '',
      // 图片放大查看
      showImageZoom: false,
      currentImages: [],
      currentImageIndex: 0
    };
  },
  onLoad: function onLoad(options) {
    var _this = this;
    try {
      console.log('试卷分析页面加载开始');

      // 检查用户登录状态
      var userInfo = uni.getStorageSync('userInfo');
      console.log('onLoad - userInfo:', userInfo);
      this.initYearList();
      this.initDefaultValues();
      this.loadGradeList();

      // 检查是否为编辑模式
      if (options.id) {
        this.isEdit = true;
        this.editId = options.id;
        // 延迟加载详情，确保年份列表已初始化
        setTimeout(function () {
          _this.loadAnalysisDetail(options.id);
        }, 100);
      }
      console.log('试卷分析页面加载完成');
    } catch (error) {
      console.error('试卷分析页面加载失败:', error);
      uni.showToast({
        title: '页面加载失败',
        icon: 'none'
      });
    }
  },
  methods: {
    // 初始化年份列表
    initYearList: function initYearList() {
      try {
        console.log('初始化年份列表');
        var currentYear = new Date().getFullYear();
        for (var i = currentYear - 5; i <= currentYear + 1; i++) {
          this.yearList.push(i + '年');
        }
        this.selectedYear = this.yearList[0];
        console.log('年份列表初始化完成:', this.yearList);
      } catch (error) {
        console.error('初始化年份列表失败:', error);
      }
    },
    // 初始化默认值
    initDefaultValues: function initDefaultValues() {
      try {
        console.log('初始化默认值');
        var currentMonth = new Date().getMonth();
        this.monthIndex = currentMonth;
        this.selectedMonth = this.monthList[currentMonth];
        console.log('默认值初始化完成:', {
          monthIndex: this.monthIndex,
          selectedMonth: this.selectedMonth
        });
      } catch (error) {
        console.error('初始化默认值失败:', error);
      }
    },
    // 年级选择
    onGradeChange: function onGradeChange(e) {
      this.gradeIndex = e.detail.value;
      this.selectedGrade = this.gradeList[this.gradeIndex];
      this.loadStudentsByGrade();
    },
    // 学生选择
    onStudentChange: function onStudentChange(e) {
      this.studentIndex = e.detail.value;
      this.selectedStudent = this.studentList[this.studentIndex];
    },
    // 根据年级加载学生列表
    loadStudentsByGrade: function loadStudentsByGrade() {
      var _this2 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var userInfo, result, allStudents;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (_this2.selectedGrade) {
                  _context.next = 2;
                  break;
                }
                return _context.abrupt("return");
              case 2:
                _context.prev = 2;
                userInfo = uni.getStorageSync('userInfo');
                console.log('loadStudentsByGrade - userInfo:', userInfo);
                if (userInfo) {
                  _context.next = 8;
                  break;
                }
                uni.showToast({
                  title: '请先登录',
                  icon: 'none'
                });
                return _context.abrupt("return");
              case 8:
                _context.next = 10;
                return uniCloud.callFunction({
                  name: 'student-hours',
                  data: {
                    action: 'getMyClassStudentsByType',
                    teacherId: userInfo._id
                  }
                });
              case 10:
                result = _context.sent;
                if (result.result.code === 200) {
                  allStudents = [].concat((0, _toConsumableArray2.default)(result.result.data.classStudents), (0, _toConsumableArray2.default)(result.result.data.oneToOneStudents)); // 筛选指定年级的所有学生（包括一对一、班课、托产生）
                  _this2.studentList = allStudents.filter(function (student) {
                    return student.grade === _this2.selectedGrade;
                  });

                  // 重置学生选择
                  _this2.selectedStudent = null;
                  _this2.studentIndex = 0;
                  console.log('加载学生列表完成:', _this2.studentList);
                } else {
                  uni.showToast({
                    title: result.result.message || '加载学生失败',
                    icon: 'none'
                  });
                }
                _context.next = 18;
                break;
              case 14:
                _context.prev = 14;
                _context.t0 = _context["catch"](2);
                console.error('加载学生列表失败:', _context.t0);
                uni.showToast({
                  title: '加载学生失败，请重试',
                  icon: 'none'
                });
              case 18:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[2, 14]]);
      }))();
    },
    // 加载年级列表
    loadGradeList: function loadGradeList() {
      var _this3 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var userInfo, result, allStudents, grades;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                userInfo = uni.getStorageSync('userInfo');
                console.log('loadGradeList - userInfo:', userInfo);
                if (userInfo) {
                  _context2.next = 6;
                  break;
                }
                uni.showToast({
                  title: '请先登录',
                  icon: 'none'
                });
                return _context2.abrupt("return");
              case 6:
                _context2.next = 8;
                return uniCloud.callFunction({
                  name: 'student-hours',
                  data: {
                    action: 'getMyClassStudentsByType',
                    teacherId: userInfo._id
                  }
                });
              case 8:
                result = _context2.sent;
                if (!(result.result.code === 200)) {
                  _context2.next = 21;
                  break;
                }
                allStudents = [].concat((0, _toConsumableArray2.default)(result.result.data.classStudents), (0, _toConsumableArray2.default)(result.result.data.oneToOneStudents)); // 获取所有年级并去重
                grades = (0, _toConsumableArray2.default)(new Set(allStudents.map(function (student) {
                  return student.grade;
                }).filter(Boolean)));
                _this3.gradeList = grades.sort();
                if (!(_this3.gradeList.length > 0)) {
                  _context2.next = 18;
                  break;
                }
                _this3.selectedGrade = _this3.gradeList[0];
                _this3.gradeIndex = 0;
                // 加载第一个年级的学生
                _context2.next = 18;
                return _this3.loadStudentsByGrade();
              case 18:
                console.log('加载年级列表完成:', _this3.gradeList);
                _context2.next = 22;
                break;
              case 21:
                uni.showToast({
                  title: result.result.message || '加载年级失败',
                  icon: 'none'
                });
              case 22:
                _context2.next = 28;
                break;
              case 24:
                _context2.prev = 24;
                _context2.t0 = _context2["catch"](0);
                console.error('加载年级列表失败:', _context2.t0);
                uni.showToast({
                  title: '加载年级失败，请重试',
                  icon: 'none'
                });
              case 28:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 24]]);
      }))();
    },
    // 年份选择
    onYearChange: function onYearChange(e) {
      this.yearIndex = e.detail.value;
      this.selectedYear = this.yearList[this.yearIndex];
    },
    // 月份选择
    onMonthChange: function onMonthChange(e) {
      this.monthIndex = e.detail.value;
      this.selectedMonth = this.monthList[this.monthIndex];
    },
    // 选择考试类型
    selectExamType: function selectExamType(type) {
      this.selectedExamType = type;
      this.customExamType = '';
    },
    // 自定义考试类型输入
    onCustomTypeInput: function onCustomTypeInput(e) {
      this.customExamType = e.detail.value;
      this.selectedExamType = '';
    },
    // 选择试卷图片
    chooseImage: function chooseImage() {
      var _this4 = this;
      uni.chooseImage({
        count: 5 - this.examImages.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function success(res) {
          _this4.examImages = [].concat((0, _toConsumableArray2.default)(_this4.examImages), (0, _toConsumableArray2.default)(res.tempFilePaths));
        }
      });
    },
    // 删除试卷图片（保留原有方法以兼容）
    deleteImage: function deleteImage(index) {
      this.examImages.splice(index, 1);
    },
    // 选择分析图片
    chooseAnalysisImage: function chooseAnalysisImage() {
      var _this5 = this;
      uni.chooseImage({
        count: 3 - this.analysisImages.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function success(res) {
          _this5.analysisImages = [].concat((0, _toConsumableArray2.default)(_this5.analysisImages), (0, _toConsumableArray2.default)(res.tempFilePaths));
        }
      });
    },
    // 删除分析图片（保留原有方法以兼容）
    deleteAnalysisImage: function deleteAnalysisImage(index) {
      this.analysisImages.splice(index, 1);
    },
    // 设置难度评分
    setDifficultyRating: function setDifficultyRating(rating) {
      this.difficultyRating = rating;
    },
    // 设置学生答题效果
    setStudentPerformance: function setStudentPerformance(rating) {
      this.studentPerformance = rating;
    },
    // 提交分析
    submitAnalysis: function submitAnalysis() {
      var _this6 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var examImageFileIDs, i, imagePath, fileName, uploadResult, analysisImageFileIDs, _i, _imagePath, _fileName, _uploadResult, userInfo, result;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(!_this6.selectedYear || !_this6.selectedMonth || !_this6.selectedExamType && !_this6.customExamType)) {
                  _context3.next = 3;
                  break;
                }
                uni.showToast({
                  title: '请填写完整的基本信息',
                  icon: 'none'
                });
                return _context3.abrupt("return");
              case 3:
                if (!(!_this6.selectedStudent || !_this6.selectedGrade)) {
                  _context3.next = 6;
                  break;
                }
                uni.showToast({
                  title: '请选择年级和学生',
                  icon: 'none'
                });
                return _context3.abrupt("return");
              case 6:
                if (!((!_this6.examImages || _this6.examImages.length === 0) && (!_this6.examImageFileIDs || _this6.examImageFileIDs.length === 0))) {
                  _context3.next = 9;
                  break;
                }
                uni.showToast({
                  title: '请上传试卷图片',
                  icon: 'none'
                });
                return _context3.abrupt("return");
              case 9:
                if (!((!_this6.analysisText || _this6.analysisText.trim() === '') && (!_this6.analysisImages || _this6.analysisImages.length === 0) && (!_this6.analysisImageFileIDs || _this6.analysisImageFileIDs.length === 0))) {
                  _context3.next = 12;
                  break;
                }
                uni.showToast({
                  title: '请填写试卷分析或上传分析图片',
                  icon: 'none'
                });
                return _context3.abrupt("return");
              case 12:
                if (!(!_this6.difficultyRating || _this6.difficultyRating === 0)) {
                  _context3.next = 15;
                  break;
                }
                uni.showToast({
                  title: '请选择考试难度',
                  icon: 'none'
                });
                return _context3.abrupt("return");
              case 15:
                if (!(!_this6.studentPerformance || _this6.studentPerformance === 0)) {
                  _context3.next = 18;
                  break;
                }
                uni.showToast({
                  title: '请选择学生答题效果',
                  icon: 'none'
                });
                return _context3.abrupt("return");
              case 18:
                uni.showLoading({
                  title: '正在提交...'
                });
                _context3.prev = 19;
                console.log('开始上传图片到云存储');

                // 上传试卷图片到云存储（只上传本地新选择的图片）
                examImageFileIDs = (0, _toConsumableArray2.default)(_this6.examImageFileIDs); // 保留原有的云存储文件ID
                i = 0;
              case 23:
                if (!(i < _this6.examImages.length)) {
                  _context3.next = 45;
                  break;
                }
                imagePath = _this6.examImages[i];
                fileName = "exam_images/".concat(Date.now(), "_").concat(i, "_").concat(Math.random().toString(36).substr(2, 9), ".jpg");
                _context3.prev = 26;
                _context3.next = 29;
                return uniCloud.uploadFile({
                  filePath: imagePath,
                  cloudPath: fileName
                });
              case 29:
                uploadResult = _context3.sent;
                examImageFileIDs.push(uploadResult.fileID);
                console.log("\u8BD5\u5377\u56FE\u7247 ".concat(i + 1, " \u4E0A\u4F20\u6210\u529F:"), uploadResult.fileID);
                _context3.next = 42;
                break;
              case 34:
                _context3.prev = 34;
                _context3.t0 = _context3["catch"](26);
                console.error("\u8BD5\u5377\u56FE\u7247 ".concat(i + 1, " \u4E0A\u4F20\u5931\u8D25:"), _context3.t0);
                // 检查是否是域名问题
                if (!(_context3.t0.message && _context3.t0.message.includes('domain list'))) {
                  _context3.next = 41;
                  break;
                }
                throw new Error('图片上传失败：请检查微信小程序域名配置。请在微信开发者工具中配置云存储域名。');
              case 41:
                throw new Error("\u8BD5\u5377\u56FE\u7247 ".concat(i + 1, " \u4E0A\u4F20\u5931\u8D25"));
              case 42:
                i++;
                _context3.next = 23;
                break;
              case 45:
                // 上传分析图片到云存储（只上传本地新选择的图片）
                analysisImageFileIDs = (0, _toConsumableArray2.default)(_this6.analysisImageFileIDs); // 保留原有的云存储文件ID
                _i = 0;
              case 47:
                if (!(_i < _this6.analysisImages.length)) {
                  _context3.next = 69;
                  break;
                }
                _imagePath = _this6.analysisImages[_i];
                _fileName = "analysis_images/".concat(Date.now(), "_").concat(_i, "_").concat(Math.random().toString(36).substr(2, 9), ".jpg");
                _context3.prev = 50;
                _context3.next = 53;
                return uniCloud.uploadFile({
                  filePath: _imagePath,
                  cloudPath: _fileName
                });
              case 53:
                _uploadResult = _context3.sent;
                analysisImageFileIDs.push(_uploadResult.fileID);
                console.log("\u5206\u6790\u56FE\u7247 ".concat(_i + 1, " \u4E0A\u4F20\u6210\u529F:"), _uploadResult.fileID);
                _context3.next = 66;
                break;
              case 58:
                _context3.prev = 58;
                _context3.t1 = _context3["catch"](50);
                console.error("\u5206\u6790\u56FE\u7247 ".concat(_i + 1, " \u4E0A\u4F20\u5931\u8D25:"), _context3.t1);
                // 检查是否是域名问题
                if (!(_context3.t1.message && _context3.t1.message.includes('domain list'))) {
                  _context3.next = 65;
                  break;
                }
                throw new Error('图片上传失败：请检查微信小程序域名配置。请在微信开发者工具中配置云存储域名。');
              case 65:
                throw new Error("\u5206\u6790\u56FE\u7247 ".concat(_i + 1, " \u4E0A\u4F20\u5931\u8D25"));
              case 66:
                _i++;
                _context3.next = 47;
                break;
              case 69:
                console.log('所有图片上传完成，开始调用云函数');

                // 获取用户信息
                userInfo = uni.getStorageSync('userInfo');
                if (userInfo) {
                  _context3.next = 73;
                  break;
                }
                throw new Error('用户信息不存在');
              case 73:
                _context3.next = 75;
                return uniCloud.callFunction({
                  name: 'exam-analysis',
                  data: {
                    action: _this6.isEdit ? 'update' : 'save',
                    data: _objectSpread(_objectSpread({}, _this6.isEdit && {
                      id: _this6.editId
                    }), {}, {
                      year: _this6.selectedYear,
                      month: _this6.selectedMonth,
                      examType: _this6.selectedExamType || _this6.customExamType,
                      examImages: examImageFileIDs,
                      // 使用云存储文件ID
                      analysisText: _this6.analysisText,
                      analysisImages: analysisImageFileIDs,
                      // 使用云存储文件ID
                      difficultyRating: _this6.difficultyRating,
                      studentPerformance: _this6.studentPerformance,
                      studentId: _this6.selectedStudent._id,
                      studentName: _this6.selectedStudent.studentName,
                      grade: _this6.selectedGrade,
                      userId: userInfo._id,
                      userRole: userInfo.role,
                      userName: userInfo.teacherName || userInfo.username || '未知用户'
                    })
                  }
                });
              case 75:
                result = _context3.sent;
                console.log('云函数调用结果:', result);
                uni.hideLoading();
                if (result.result.code === 0) {
                  uni.showToast({
                    title: _this6.isEdit ? '更新成功' : '提交成功',
                    icon: 'success'
                  });
                  if (_this6.isEdit) {
                    // 编辑模式下返回上一页
                    setTimeout(function () {
                      uni.navigateBack();
                    }, 1500);
                  } else {
                    // 重置表单
                    _this6.resetForm();
                  }
                } else {
                  console.error('提交失败:', result.result.message);
                  uni.showToast({
                    title: result.result.message || '提交失败',
                    icon: 'none'
                  });
                }
                _context3.next = 86;
                break;
              case 81:
                _context3.prev = 81;
                _context3.t2 = _context3["catch"](19);
                uni.hideLoading();
                console.error('提交失败:', _context3.t2);

                // 如果是域名配置问题，显示更详细的提示
                if (_context3.t2.message && _context3.t2.message.includes('域名配置')) {
                  uni.showModal({
                    title: '配置提示',
                    content: '图片上传失败，需要在微信开发者工具中配置云存储域名。\n\n配置步骤：\n1. 点击右上角"详情"\n2. 选择"域名信息"\n3. 在"uploadFile合法域名"中添加云存储域名\n4. 重新编译项目',
                    showCancel: false,
                    confirmText: '我知道了'
                  });
                } else {
                  uni.showToast({
                    title: _context3.t2.message || '提交失败，请重试',
                    icon: 'none'
                  });
                }
              case 86:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[19, 81], [26, 34], [50, 58]]);
      }))();
    },
    // 重置表单
    resetForm: function resetForm() {
      this.selectedYear = this.yearList[0];
      this.yearIndex = 0;
      this.selectedMonth = this.monthList[new Date().getMonth()];
      this.monthIndex = new Date().getMonth();
      this.selectedExamType = '';
      this.customExamType = '';
      this.examImages = [];
      this.examImageFileIDs = []; // 重置云存储文件ID
      this.analysisText = '';
      this.analysisImages = [];
      this.analysisImageFileIDs = []; // 重置云存储文件ID
      this.difficultyRating = 0;
      this.studentPerformance = 0;
      this.selectedGrade = this.gradeList[0] || '';
      this.gradeIndex = 0;
      this.selectedStudent = null;
      this.studentIndex = 0;
      this.studentList = [];
      this.isEdit = false;
      this.editId = '';
    },
    // 加载分析详情
    loadAnalysisDetail: function loadAnalysisDetail(id) {
      var _this7 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
        var result, data, yearIndex, monthIndex, examTypeIndex, cloudImages, localImages, _cloudImages, _localImages, gradeIndex, studentIndex;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                console.log('开始加载分析详情:', id);
                _context4.next = 4;
                return uniCloud.callFunction({
                  name: 'exam-analysis',
                  data: {
                    action: 'getDetail',
                    data: {
                      id: id
                    }
                  }
                });
              case 4:
                result = _context4.sent;
                console.log('加载详情结果:', result);
                if (!(result.result.code === 0)) {
                  _context4.next = 33;
                  break;
                }
                data = result.result.data;
                console.log('详情数据:', data);
                _this7.selectedYear = data.year;
                yearIndex = _this7.yearList.indexOf(data.year);
                _this7.yearIndex = yearIndex !== -1 ? yearIndex : 0;
                _this7.selectedMonth = data.month;
                monthIndex = _this7.monthList.indexOf(data.month);
                _this7.monthIndex = monthIndex !== -1 ? monthIndex : 0;

                // 如果找不到对应的索引，使用默认值
                if (yearIndex === -1) {
                  _this7.selectedYear = _this7.yearList[0];
                }
                if (monthIndex === -1) {
                  _this7.selectedMonth = _this7.monthList[0];
                }

                // 检查考试类型是否在预设列表中
                examTypeIndex = _this7.examTypes.indexOf(data.examType);
                if (examTypeIndex !== -1) {
                  _this7.selectedExamType = data.examType;
                  _this7.customExamType = '';
                } else {
                  _this7.selectedExamType = '';
                  _this7.customExamType = data.examType;
                }
                // 处理试卷图片 - 如果是云存储文件ID，直接使用；如果是本地路径，清空（编辑时重新选择）
                if (data.examImages && Array.isArray(data.examImages)) {
                  // 检查是否为云存储文件ID（以cloud://开头）
                  cloudImages = data.examImages.filter(function (img) {
                    return typeof img === 'string' && img.startsWith('cloud://');
                  });
                  localImages = data.examImages.filter(function (img) {
                    return typeof img === 'string' && !img.startsWith('cloud://');
                  });
                  _this7.examImageFileIDs = cloudImages;
                  _this7.examImages = []; // 编辑时清空本地图片，需要重新选择
                } else {
                  _this7.examImageFileIDs = [];
                  _this7.examImages = [];
                }
                _this7.analysisText = data.analysisText || '';
                // 处理分析图片 - 如果是云存储文件ID，直接使用；如果是本地路径，清空（编辑时重新选择）
                if (data.analysisImages && Array.isArray(data.analysisImages)) {
                  // 检查是否为云存储文件ID（以cloud://开头）
                  _cloudImages = data.analysisImages.filter(function (img) {
                    return typeof img === 'string' && img.startsWith('cloud://');
                  });
                  _localImages = data.analysisImages.filter(function (img) {
                    return typeof img === 'string' && !img.startsWith('cloud://');
                  });
                  _this7.analysisImageFileIDs = _cloudImages;
                  _this7.analysisImages = []; // 编辑时清空本地图片，需要重新选择
                } else {
                  _this7.analysisImageFileIDs = [];
                  _this7.analysisImages = [];
                }
                _this7.difficultyRating = data.difficultyRating;
                _this7.studentPerformance = data.studentPerformance;

                // 设置年级和学生信息
                if (data.grade) {
                  _this7.selectedGrade = data.grade;
                  gradeIndex = _this7.gradeList.indexOf(data.grade);
                  _this7.gradeIndex = gradeIndex !== -1 ? gradeIndex : 0;
                }
                if (!(data.studentId && data.studentName)) {
                  _context4.next = 30;
                  break;
                }
                _context4.next = 28;
                return _this7.loadStudentsByGrade();
              case 28:
                studentIndex = _this7.studentList.findIndex(function (student) {
                  return student._id === data.studentId;
                });
                if (studentIndex !== -1) {
                  _this7.selectedStudent = _this7.studentList[studentIndex];
                  _this7.studentIndex = studentIndex;
                }
              case 30:
                console.log('详情加载完成');
                _context4.next = 35;
                break;
              case 33:
                console.error('加载详情失败:', result.result.message);
                uni.showToast({
                  title: result.result.message || '加载失败',
                  icon: 'none'
                });
              case 35:
                _context4.next = 41;
                break;
              case 37:
                _context4.prev = 37;
                _context4.t0 = _context4["catch"](0);
                console.error('加载详情失败:', _context4.t0);
                uni.showToast({
                  title: '加载失败，请重试',
                  icon: 'none'
                });
              case 41:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 37]]);
      }))();
    },
    // 跳转到列表页面
    goToList: function goToList() {
      uni.navigateTo({
        url: '/pages/exam-analysis/exam-analysis-list'
      });
    },
    // 返回上一页
    goBack: function goBack() {
      uni.navigateBack();
    },
    // 打开图片放大查看
    openImageZoom: function openImageZoom(images, currentIndex) {
      if (!images || images.length === 0) {
        uni.showToast({
          title: '没有图片可预览',
          icon: 'none'
        });
        return;
      }
      this.currentImages = images;
      this.currentImageIndex = currentIndex;
      this.showImageZoom = true;
    },
    // 关闭图片放大查看
    closeImageZoom: function closeImageZoom() {
      this.showImageZoom = false;
      this.currentImages = [];
      this.currentImageIndex = 0;
    },
    // 切换图片
    switchImage: function switchImage(index) {
      this.currentImageIndex = index;
    },
    // 删除云存储的试卷图片
    deleteCloudExamImage: function deleteCloudExamImage(index) {
      var _this8 = this;
      var fileID = this.examImageFileIDs[index];
      if (fileID) {
        uniCloud.deleteFile({
          fileList: [fileID]
        }).then(function () {
          _this8.examImageFileIDs.splice(index, 1);
          uni.showToast({
            title: '图片删除成功',
            icon: 'success'
          });
        }).catch(function (err) {
          console.error('删除云存储图片失败:', err);
          uni.showToast({
            title: '图片删除失败',
            icon: 'none'
          });
        });
      }
    },
    // 删除本地新选择的试卷图片
    deleteLocalExamImage: function deleteLocalExamImage(index) {
      this.examImages.splice(index, 1);
      uni.showToast({
        title: '图片删除成功',
        icon: 'success'
      });
    },
    // 删除云存储的分析图片
    deleteCloudAnalysisImage: function deleteCloudAnalysisImage(index) {
      var _this9 = this;
      var fileID = this.analysisImageFileIDs[index];
      if (fileID) {
        uniCloud.deleteFile({
          fileList: [fileID]
        }).then(function () {
          _this9.analysisImageFileIDs.splice(index, 1);
          uni.showToast({
            title: '图片删除成功',
            icon: 'success'
          });
        }).catch(function (err) {
          console.error('删除云存储图片失败:', err);
          uni.showToast({
            title: '图片删除失败',
            icon: 'none'
          });
        });
      }
    },
    // 删除本地新选择的分析图片
    deleteLocalAnalysisImage: function deleteLocalAnalysisImage(index) {
      this.analysisImages.splice(index, 1);
      uni.showToast({
        title: '图片删除成功',
        icon: 'success'
      });
    },
    // 将图片转换为base64格式
    imageToBase64: function imageToBase64(filePath) {
      return new Promise(function (resolve, reject) {
        uni.getFileSystemManager().readFile({
          filePath: filePath,
          encoding: 'base64',
          success: function success(res) {
            // 根据文件扩展名确定MIME类型
            var ext = filePath.split('.').pop().toLowerCase();
            var mimeType = 'image/jpeg';
            if (ext === 'png') mimeType = 'image/png';else if (ext === 'gif') mimeType = 'image/gif';else if (ext === 'webp') mimeType = 'image/webp';
            var base64 = "data:".concat(mimeType, ";base64,").concat(res.data);
            resolve(base64);
          },
          fail: function fail(err) {
            console.error('读取文件失败:', err);
            reject(err);
          }
        });
      });
    } // 调试用户信息
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/uni-cloud/dist/index.js */ 27)["uniCloud"]))

/***/ }),

/***/ 316:
/*!*********************************************************************************************************************!*\
  !*** D:/代码/小程序/新欣火1/pages/exam-analysis/exam-analysis.vue?vue&type=style&index=0&id=36a69848&scoped=true&lang=css& ***!
  \*********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_exam_analysis_vue_vue_type_style_index_0_id_36a69848_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--6-oneOf-1-3!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./exam-analysis.vue?vue&type=style&index=0&id=36a69848&scoped=true&lang=css& */ 317);
/* harmony import */ var _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_exam_analysis_vue_vue_type_style_index_0_id_36a69848_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_exam_analysis_vue_vue_type_style_index_0_id_36a69848_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_exam_analysis_vue_vue_type_style_index_0_id_36a69848_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_exam_analysis_vue_vue_type_style_index_0_id_36a69848_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_exam_analysis_vue_vue_type_style_index_0_id_36a69848_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 317:
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/代码/小程序/新欣火1/pages/exam-analysis/exam-analysis.vue?vue&type=style&index=0&id=36a69848&scoped=true&lang=css& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[310,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/exam-analysis/exam-analysis.js.map