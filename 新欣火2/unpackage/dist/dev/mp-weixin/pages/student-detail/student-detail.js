(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/student-detail/student-detail"],{

/***/ 358:
/*!*********************************************************************************!*\
  !*** D:/代码/小程序/新欣火1/main.js?{"page":"pages%2Fstudent-detail%2Fstudent-detail"} ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
__webpack_require__(/*! @dcloudio/vue-cli-plugin-uni/packages/uni-cloud/dist/index.js */ 27);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _studentDetail = _interopRequireDefault(__webpack_require__(/*! ./pages/student-detail/student-detail.vue */ 359));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_studentDetail.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 359:
/*!**************************************************************!*\
  !*** D:/代码/小程序/新欣火1/pages/student-detail/student-detail.vue ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _student_detail_vue_vue_type_template_id_e4349334_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./student-detail.vue?vue&type=template&id=e4349334&scoped=true& */ 360);
/* harmony import */ var _student_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./student-detail.vue?vue&type=script&lang=js& */ 362);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _student_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _student_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _student_detail_vue_vue_type_style_index_0_id_e4349334_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./student-detail.vue?vue&type=style&index=0&id=e4349334&scoped=true&lang=css& */ 364);
/* harmony import */ var _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 44);

var renderjs





/* normalize component */

var component = Object(_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _student_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _student_detail_vue_vue_type_template_id_e4349334_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _student_detail_vue_vue_type_template_id_e4349334_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "e4349334",
  null,
  false,
  _student_detail_vue_vue_type_template_id_e4349334_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages/student-detail/student-detail.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 360:
/*!*********************************************************************************************************!*\
  !*** D:/代码/小程序/新欣火1/pages/student-detail/student-detail.vue?vue&type=template&id=e4349334&scoped=true& ***!
  \*********************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_student_detail_vue_vue_type_template_id_e4349334_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./student-detail.vue?vue&type=template&id=e4349334&scoped=true& */ 361);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_student_detail_vue_vue_type_template_id_e4349334_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_student_detail_vue_vue_type_template_id_e4349334_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_student_detail_vue_vue_type_template_id_e4349334_scoped_true___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_student_detail_vue_vue_type_template_id_e4349334_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 361:
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/代码/小程序/新欣火1/pages/student-detail/student-detail.vue?vue&type=template&id=e4349334&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
  var g0 = _vm.studentData ? _vm.studentData.subjects.length : null
  var g1 = _vm.studentData ? _vm.studentData.classes.length : null
  var g2 =
    _vm.studentData && _vm.activeTab === "courses" ? _vm.courses.length : null
  var l0 =
    _vm.studentData && _vm.activeTab === "courses" && !(g2 === 0)
      ? _vm.__map(_vm.courses, function (course, index) {
          var $orig = _vm.__get_orig(course)
          var m0 = _vm.formatDate(course.enroll_date)
          var m1 = course.completion_date
            ? _vm.formatDate(course.completion_date)
            : null
          return {
            $orig: $orig,
            m0: m0,
            m1: m1,
          }
        })
      : null
  var g3 =
    _vm.studentData && _vm.activeTab === "scores" ? _vm.scores.length : null
  var l1 =
    _vm.studentData && _vm.activeTab === "scores" && !(g3 === 0)
      ? _vm.__map(_vm.scores, function (score, index) {
          var $orig = _vm.__get_orig(score)
          var m2 = _vm.formatDate(score.exam_date)
          var m3 = _vm.getSubjectByCourseId(score.course_id)
          return {
            $orig: $orig,
            m2: m2,
            m3: m3,
          }
        })
      : null
  var l2 = _vm.showSubjectModalFlag
    ? _vm.__map(_vm.allSubjects, function (subject, __i0__) {
        var $orig = _vm.__get_orig(subject)
        var g4 = _vm.tempSubjects.includes(subject)
        var g5 = _vm.tempSubjects.includes(subject)
        return {
          $orig: $orig,
          g4: g4,
          g5: g5,
        }
      })
    : null
  var l3 = _vm.showClassModalFlag
    ? _vm.__map(_vm.filteredClasses, function (classItem, __i1__) {
        var $orig = _vm.__get_orig(classItem)
        var m4 = _vm.isClassSelected(classItem)
        var m5 = _vm.isClassSelected(classItem)
        return {
          $orig: $orig,
          m4: m4,
          m5: m5,
        }
      })
    : null
  var g6 = _vm.showClassModalFlag
    ? _vm.classSearchKeyword && _vm.filteredClasses.length === 0
    : null
  var g7 = _vm.showClassModalFlag
    ? _vm.filteredClasses.length === 0 && !_vm.classSearchKeyword
    : null
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        g0: g0,
        g1: g1,
        g2: g2,
        l0: l0,
        g3: g3,
        l1: l1,
        l2: l2,
        l3: l3,
        g6: g6,
        g7: g7,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 362:
/*!***************************************************************************************!*\
  !*** D:/代码/小程序/新欣火1/pages/student-detail/student-detail.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_student_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./student-detail.vue?vue&type=script&lang=js& */ 363);
/* harmony import */ var _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_student_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_student_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_student_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_student_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_student_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 363:
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/代码/小程序/新欣火1/pages/student-detail/student-detail.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  data: function data() {
    return {
      studentData: null,
      originalStudentData: null,
      gradeIndex: 0,
      gradeOptions: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级', '高一', '高二', '高三'],
      allSubjects: ['语文', '数学', '英语', '物理', '化学'],
      showSubjectModalFlag: false,
      tempSubjects: [],
      availableClasses: [],
      showClassModalFlag: false,
      classSearchKeyword: '',
      filteredClasses: [],
      tempClasses: [],
      // 添加学术信息相关数据
      activeTab: 'courses',
      courses: [],
      scores: [],
      // 成绩编辑相关数据
      showScoreEditModal: false,
      editScoreData: {
        id: '',
        subject: '',
        subjectIndex: -1,
        examType: '',
        examTypeIndex: -1,
        score: '',
        examDate: '',
        remark: ''
      },
      editScoreIndex: -1,
      examTypeOptions: ['期中', '期末', '月考', '中考']
    };
  },
  onLoad: function onLoad(options) {
    if (options.studentId) {
      this.loadStudentDetail(options.studentId);
    }
  },
  methods: {
    goBack: function goBack() {
      uni.navigateBack();
    },
    loadStudentDetail: function loadStudentDetail(studentId) {
      var _this = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var result;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return uniCloud.callFunction({
                  name: 'archive-manager',
                  data: {
                    action: 'getStudentDetail',
                    studentId: studentId
                  }
                });
              case 3:
                result = _context.sent;
                if (result.result.code === 0) {
                  _this.studentData = result.result.data;
                  _this.originalStudentData = JSON.parse(JSON.stringify(result.result.data));
                  _this.gradeIndex = _this.gradeOptions.indexOf(_this.studentData.grade);
                  _this.tempSubjects = (0, _toConsumableArray2.default)(_this.studentData.subjects);
                  _this.tempClasses = (0, _toConsumableArray2.default)(_this.studentData.classes);

                  // 加载班级列表
                  _this.loadAvailableClasses();

                  // 加载学术信息
                  _this.loadAcademicRecords(studentId);
                } else {
                  uni.showToast({
                    title: '加载学生信息失败',
                    icon: 'error'
                  });
                  setTimeout(function () {
                    uni.navigateBack();
                  }, 1500);
                }
                _context.next = 12;
                break;
              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](0);
                console.error('加载学生详情失败:', _context.t0);
                uni.showToast({
                  title: '加载学生信息失败',
                  icon: 'error'
                });
                setTimeout(function () {
                  uni.navigateBack();
                }, 1500);
              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 7]]);
      }))();
    },
    loadAvailableClasses: function loadAvailableClasses() {
      var _this2 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var result;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return uniCloud.callFunction({
                  name: 'archive-manager',
                  data: {
                    action: 'getClasses'
                  }
                });
              case 3:
                result = _context2.sent;
                if (result.result.code === 0) {
                  _this2.availableClasses = result.result.data || [];
                  _this2.filteredClasses = _this2.availableClasses;
                }
                _context2.next = 11;
                break;
              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2["catch"](0);
                console.error('加载班级列表失败:', _context2.t0);
                uni.showToast({
                  title: '加载班级失败',
                  icon: 'error'
                });
              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 7]]);
      }))();
    },
    // 添加加载学术记录的方法
    loadAcademicRecords: function loadAcademicRecords(studentId) {
      var _this3 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var academicResult;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return uniCloud.callFunction({
                  name: 'archive-manager',
                  data: {
                    action: 'getStudentAcademicRecords',
                    studentId: studentId
                  }
                });
              case 3:
                academicResult = _context3.sent;
                if (academicResult.result.code === 0) {
                  _this3.courses = academicResult.result.data.courses || [];
                  _this3.scores = academicResult.result.data.scores || [];

                  // 如果课程数据为空，根据班级数据生成课程
                  if (_this3.courses.length === 0 && _this3.studentData.classes.length > 0) {
                    _this3.syncCoursesWithClasses();
                  }
                }
                _context3.next = 11;
                break;
              case 7:
                _context3.prev = 7;
                _context3.t0 = _context3["catch"](0);
                console.error('加载学生学术档案失败:', _context3.t0);
                uni.showToast({
                  title: '加载学术档案失败',
                  icon: 'error'
                });
              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 7]]);
      }))();
    },
    onGradeChange: function onGradeChange(e) {
      this.gradeIndex = e.detail.value;
      this.studentData.grade = this.gradeOptions[e.detail.value];
    },
    showSubjectModal: function showSubjectModal() {
      this.tempSubjects = (0, _toConsumableArray2.default)(this.studentData.subjects);
      this.showSubjectModalFlag = true;
    },
    closeSubjectModal: function closeSubjectModal() {
      this.showSubjectModalFlag = false;
    },
    toggleSubject: function toggleSubject(subject) {
      var index = this.tempSubjects.indexOf(subject);
      if (index > -1) {
        this.tempSubjects.splice(index, 1);
      } else {
        this.tempSubjects.push(subject);
      }
    },
    removeSubject: function removeSubject(index) {
      this.studentData.subjects.splice(index, 1);
    },
    confirmSubjects: function confirmSubjects() {
      this.studentData.subjects = (0, _toConsumableArray2.default)(this.tempSubjects);
      this.showSubjectModalFlag = false;
    },
    // 保存学生信息
    saveStudentInfo: function saveStudentInfo() {
      var _this4 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
        var result;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(!_this4.studentData.name || !_this4.studentData.grade)) {
                  _context4.next = 3;
                  break;
                }
                uni.showToast({
                  title: '请填写完整信息',
                  icon: 'none'
                });
                return _context4.abrupt("return");
              case 3:
                _context4.prev = 3;
                uni.showLoading({
                  title: '保存中...'
                });
                _context4.next = 7;
                return uniCloud.callFunction({
                  name: 'student-manager',
                  data: {
                    action: 'updateStudent',
                    studentId: _this4.studentData.studentId,
                    updateData: {
                      name: _this4.studentData.name,
                      grade: _this4.studentData.grade,
                      subjects: _this4.studentData.subjects,
                      classes: _this4.studentData.classes,
                      updateTime: new Date().toISOString()
                    }
                  }
                });
              case 7:
                result = _context4.sent;
                uni.hideLoading();
                if (result.result.code === 0) {
                  uni.showToast({
                    title: '保存成功',
                    icon: 'success'
                  });
                  // 重新加载学生数据
                  _this4.loadStudentDetail();

                  // 更新档案管理页面的本地缓存
                  _this4.updateArchiveCache();
                } else {
                  uni.showToast({
                    title: result.result.message || '保存失败',
                    icon: 'error'
                  });
                }
                _context4.next = 17;
                break;
              case 12:
                _context4.prev = 12;
                _context4.t0 = _context4["catch"](3);
                uni.hideLoading();
                console.error('保存学生信息失败:', _context4.t0);
                uni.showToast({
                  title: '保存失败，请重试',
                  icon: 'error'
                });
              case 17:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[3, 12]]);
      }))();
    },
    showClassModal: function showClassModal() {
      this.tempClasses = (0, _toConsumableArray2.default)(this.studentData.classes);
      this.showClassModalFlag = true;
      this.filteredClasses = this.availableClasses;
      this.classSearchKeyword = '';
    },
    closeClassModal: function closeClassModal() {
      this.showClassModalFlag = false;
    },
    isClassSelected: function isClassSelected(classItem) {
      return this.tempClasses.some(function (c) {
        return c._id === classItem._id;
      });
    },
    toggleClass: function toggleClass(classItem) {
      var index = this.tempClasses.findIndex(function (c) {
        return c._id === classItem._id;
      });
      if (index > -1) {
        this.tempClasses.splice(index, 1);
      } else {
        this.tempClasses.push(classItem);
      }
    },
    removeClass: function removeClass(index) {
      var _this5 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5() {
        var removedClass, result;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                removedClass = _this5.studentData.classes[index];
                _context5.prev = 1;
                _context5.next = 4;
                return uniCloud.callFunction({
                  name: 'class-management',
                  data: {
                    action: 'removeStudentFromClass',
                    classId: removedClass._id,
                    studentId: _this5.studentData.studentId // 使用学号字段
                  }
                });
              case 4:
                result = _context5.sent;
                if (!(result.result.code === 0)) {
                  _context5.next = 11;
                  break;
                }
                // 删除成功，更新本地数据
                _this5.studentData.classes.splice(index, 1);

                // 同步删除对应的学习课程
                _this5.removeCourseByClass(removedClass);
                uni.showToast({
                  title: '删除班级成功',
                  icon: 'success'
                });
                _context5.next = 12;
                break;
              case 11:
                throw new Error(result.result.message || '删除班级失败');
              case 12:
                _context5.next = 18;
                break;
              case 14:
                _context5.prev = 14;
                _context5.t0 = _context5["catch"](1);
                console.error('删除班级失败:', _context5.t0);
                uni.showToast({
                  title: '删除班级失败，请重试',
                  icon: 'error'
                });
              case 18:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[1, 14]]);
      }))();
    },
    confirmClasses: function confirmClasses() {
      var _this6 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6() {
        var originalClassIds, newClassIds, addedClasses, removedClasses, _iterator, _step, classItem, result, _iterator2, _step2, _classItem, _result;
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                // 找出新增的班级和删除的班级
                originalClassIds = _this6.studentData.classes.map(function (c) {
                  return c._id;
                });
                newClassIds = _this6.tempClasses.map(function (c) {
                  return c._id;
                });
                addedClasses = _this6.tempClasses.filter(function (c) {
                  return !originalClassIds.includes(c._id);
                });
                removedClasses = _this6.studentData.classes.filter(function (c) {
                  return !newClassIds.includes(c._id);
                }); // 添加新班级
                _iterator = _createForOfIteratorHelper(addedClasses);
                _context6.prev = 6;
                _iterator.s();
              case 8:
                if ((_step = _iterator.n()).done) {
                  _context6.next = 17;
                  break;
                }
                classItem = _step.value;
                _context6.next = 12;
                return uniCloud.callFunction({
                  name: 'class-management',
                  data: {
                    action: 'addStudentsToClass',
                    classId: classItem._id,
                    studentIds: [_this6.studentData.studentId] // 这里使用studentId，因为addStudentsToClass期望的是学号
                  }
                });
              case 12:
                result = _context6.sent;
                if (!(result.result.code !== 0)) {
                  _context6.next = 15;
                  break;
                }
                throw new Error(result.result.message || '添加班级失败');
              case 15:
                _context6.next = 8;
                break;
              case 17:
                _context6.next = 22;
                break;
              case 19:
                _context6.prev = 19;
                _context6.t0 = _context6["catch"](6);
                _iterator.e(_context6.t0);
              case 22:
                _context6.prev = 22;
                _iterator.f();
                return _context6.finish(22);
              case 25:
                // 删除班级
                _iterator2 = _createForOfIteratorHelper(removedClasses);
                _context6.prev = 26;
                _iterator2.s();
              case 28:
                if ((_step2 = _iterator2.n()).done) {
                  _context6.next = 37;
                  break;
                }
                _classItem = _step2.value;
                _context6.next = 32;
                return uniCloud.callFunction({
                  name: 'class-management',
                  data: {
                    action: 'removeStudentFromClass',
                    classId: _classItem._id,
                    studentId: _this6.studentData.studentId // 使用学号字段
                  }
                });
              case 32:
                _result = _context6.sent;
                if (!(_result.result.code !== 0)) {
                  _context6.next = 35;
                  break;
                }
                throw new Error(_result.result.message || '删除班级失败');
              case 35:
                _context6.next = 28;
                break;
              case 37:
                _context6.next = 42;
                break;
              case 39:
                _context6.prev = 39;
                _context6.t1 = _context6["catch"](26);
                _iterator2.e(_context6.t1);
              case 42:
                _context6.prev = 42;
                _iterator2.f();
                return _context6.finish(42);
              case 45:
                // 更新本地数据
                _this6.studentData.classes = (0, _toConsumableArray2.default)(_this6.tempClasses);
                _this6.showClassModalFlag = false;

                // 同步更新学习课程数据
                _this6.syncCoursesWithClasses();
                uni.showToast({
                  title: '班级更新成功',
                  icon: 'success'
                });
                _context6.next = 55;
                break;
              case 51:
                _context6.prev = 51;
                _context6.t2 = _context6["catch"](0);
                console.error('更新班级失败:', _context6.t2);
                uni.showToast({
                  title: '更新班级失败，请重试',
                  icon: 'error'
                });
              case 55:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[0, 51], [6, 19, 22, 25], [26, 39, 42, 45]]);
      }))();
    },
    onClassSearchInput: function onClassSearchInput() {
      if (!this.classSearchKeyword) {
        this.filteredClasses = this.availableClasses;
        return;
      }
      var keyword = this.classSearchKeyword.toLowerCase();
      this.filteredClasses = this.availableClasses.filter(function (classItem) {
        return classItem.className && classItem.className.toLowerCase().includes(keyword) || classItem.grade && classItem.grade.toLowerCase().includes(keyword);
      });
    },
    createNewClass: function createNewClass() {
      // 这里可以跳转到班级创建页面或者显示创建弹窗
      uni.showToast({
        title: '请到班级管理页面创建新班级',
        icon: 'none'
      });
    },
    // 同步学习课程与班级数据
    syncCoursesWithClasses: function syncCoursesWithClasses() {
      var _this7 = this;
      // 根据当前班级数据重新生成学习课程
      this.courses = this.studentData.classes.map(function (classItem) {
        // 从班级名称中提取科目信息
        var subject = _this7.extractSubjectFromClassName(classItem.className);
        return {
          courseName: subject,
          year: new Date().getFullYear(),
          semester: '秋季',
          status: '在学',
          enroll_date: new Date().toISOString(),
          completion_date: null,
          className: classItem.className
        };
      });
    },
    // 从班级名称中提取科目
    extractSubjectFromClassName: function extractSubjectFromClassName(className) {
      // 根据班级名称提取科目，例如："25秋三年级数学龙班" -> "数学"
      var subjects = ['语文', '数学', '英语', '物理', '化学'];
      for (var _i = 0, _subjects = subjects; _i < _subjects.length; _i++) {
        var subject = _subjects[_i];
        if (className.includes(subject)) {
          return subject;
        }
      }
      return '未知科目';
    },
    // 根据班级删除对应的学习课程
    removeCourseByClass: function removeCourseByClass(removedClass) {
      var subject = this.extractSubjectFromClassName(removedClass.className);
      this.courses = this.courses.filter(function (course) {
        return !(course.courseName === subject && course.className === removedClass.className);
      });
    },
    // 添加切换标签页的方法
    switchTab: function switchTab(tab) {
      this.activeTab = tab;
    },
    // 添加格式化日期的方法
    formatDate: function formatDate(date) {
      if (!date) return '';
      // 处理不同的日期格式
      if (typeof date === 'string') {
        return new Date(date).toLocaleDateString();
      } else if (date instanceof Date) {
        return date.toLocaleDateString();
      } else {
        return new Date(date).toLocaleDateString();
      }
    },
    // 根据课程ID获取科目名称
    getSubjectByCourseId: function getSubjectByCourseId(courseId) {
      // 如果courseId就是科目名称，直接返回
      if (this.allSubjects.includes(courseId)) {
        return courseId;
      }

      // 如果有学生科目信息，尝试匹配
      if (this.studentData && this.studentData.subjects) {
        // 简单匹配，实际项目中可能需要更复杂的逻辑
        return this.studentData.subjects.find(function (subject) {
          return subject === courseId;
        }) || '未知科目';
      }
      return '未知科目';
    },
    // 编辑成绩
    editScore: function editScore(score, index) {
      console.log('编辑成绩 - 原始数据:', score);
      this.editScoreIndex = index;

      // 尝试多种可能的ID字段
      var scoreId = score._id || score.id || score.examScoreId;
      console.log('成绩ID:', scoreId);
      this.editScoreData = {
        id: scoreId,
        subject: this.getSubjectByCourseId(score.course_id),
        subjectIndex: this.allSubjects.indexOf(this.getSubjectByCourseId(score.course_id)),
        examType: score.exam_name || score.examType,
        examTypeIndex: this.examTypeOptions.indexOf(score.exam_name || score.examType),
        score: score.score.toString(),
        examDate: this.formatDateForInput(score.exam_date),
        remark: score.remark || '',
        inputUser: score.inputUser || '系统用户'
      };
      console.log('编辑成绩 - 处理后的数据:', this.editScoreData);
      this.showScoreEditModal = true;
    },
    // 关闭成绩编辑弹窗
    closeScoreEditModal: function closeScoreEditModal() {
      this.showScoreEditModal = false;
      this.editScoreIndex = -1;
      this.editScoreData = {
        id: '',
        subject: '',
        subjectIndex: -1,
        examType: '',
        examTypeIndex: -1,
        score: '',
        examDate: '',
        remark: ''
      };
    },
    // 编辑科目变化
    onEditSubjectChange: function onEditSubjectChange(e) {
      this.editScoreData.subjectIndex = e.detail.value;
      this.editScoreData.subject = this.allSubjects[e.detail.value];
    },
    // 编辑考试类型变化
    onEditExamTypeChange: function onEditExamTypeChange(e) {
      this.editScoreData.examTypeIndex = e.detail.value;
      this.editScoreData.examType = this.examTypeOptions[e.detail.value];
    },
    // 保存成绩修改
    saveScore: function saveScore() {
      var _this8 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7() {
        var updateData, result;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (!(!_this8.editScoreData.subject || !_this8.editScoreData.examType || !_this8.editScoreData.score || !_this8.editScoreData.examDate)) {
                  _context7.next = 3;
                  break;
                }
                uni.showToast({
                  title: '请填写完整信息',
                  icon: 'none'
                });
                return _context7.abrupt("return");
              case 3:
                _context7.prev = 3;
                updateData = {
                  subject: _this8.editScoreData.subject,
                  examType: _this8.editScoreData.examType,
                  exam_name: _this8.editScoreData.examType,
                  // 兼容exam_name字段
                  score: Number(_this8.editScoreData.score),
                  examDate: _this8.editScoreData.examDate,
                  exam_date: _this8.editScoreData.examDate,
                  // 兼容exam_date字段
                  remark: _this8.editScoreData.remark,
                  inputUser: _this8.editScoreData.inputUser || '系统用户',
                  // 强制添加时间戳确保有变化
                  lastModified: Date.now(),
                  editTimestamp: new Date().toISOString()
                }; // 确保数据类型正确
                if (updateData.score && typeof updateData.score === 'string') {
                  updateData.score = Number(updateData.score);
                }
                console.log('保存成绩 - 发送数据:', {
                  action: 'updateScore',
                  id: _this8.editScoreData.id,
                  data: updateData
                });
                _context7.next = 9;
                return uniCloud.callFunction({
                  name: 'exam-scores',
                  data: {
                    action: 'updateScore',
                    id: _this8.editScoreData.id,
                    data: updateData
                  }
                });
              case 9:
                result = _context7.sent;
                console.log('保存成绩 - 云函数返回:', result);
                if (!(result.result.code === 200)) {
                  _context7.next = 17;
                  break;
                }
                // 更新本地数据
                _this8.scores[_this8.editScoreIndex] = _objectSpread(_objectSpread({}, _this8.scores[_this8.editScoreIndex]), {}, {
                  courseName: _this8.editScoreData.subject,
                  exam_name: _this8.editScoreData.examType,
                  score: Number(_this8.editScoreData.score),
                  exam_date: _this8.editScoreData.examDate,
                  remark: _this8.editScoreData.remark
                });
                uni.showToast({
                  title: '修改成功',
                  icon: 'success'
                });
                _this8.closeScoreEditModal();
                _context7.next = 19;
                break;
              case 17:
                console.error('云函数返回错误:', result.result);
                throw new Error(result.result.message || '修改失败');
              case 19:
                _context7.next = 25;
                break;
              case 21:
                _context7.prev = 21;
                _context7.t0 = _context7["catch"](3);
                console.error('修改成绩失败:', _context7.t0);
                uni.showToast({
                  title: '修改失败，请重试',
                  icon: 'error'
                });
              case 25:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[3, 21]]);
      }))();
    },
    // 删除成绩
    deleteScore: function deleteScore() {
      var _this9 = this;
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这条成绩记录吗？',
        success: function () {
          var _success = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee8(res) {
            var result;
            return _regenerator.default.wrap(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    if (!res.confirm) {
                      _context8.next = 20;
                      break;
                    }
                    _context8.prev = 1;
                    console.log('删除成绩 - ID:', _this9.editScoreData.id);
                    _context8.next = 5;
                    return uniCloud.callFunction({
                      name: 'exam-scores',
                      data: {
                        action: 'deleteScore',
                        id: _this9.editScoreData.id
                      }
                    });
                  case 5:
                    result = _context8.sent;
                    console.log('删除成绩 - 云函数返回:', result);
                    if (!(result.result.code === 200)) {
                      _context8.next = 13;
                      break;
                    }
                    // 从本地数据中删除
                    _this9.scores.splice(_this9.editScoreIndex, 1);
                    uni.showToast({
                      title: '删除成功',
                      icon: 'success'
                    });
                    _this9.closeScoreEditModal();
                    _context8.next = 14;
                    break;
                  case 13:
                    throw new Error(result.result.message || '删除失败');
                  case 14:
                    _context8.next = 20;
                    break;
                  case 16:
                    _context8.prev = 16;
                    _context8.t0 = _context8["catch"](1);
                    console.error('删除成绩失败:', _context8.t0);
                    uni.showToast({
                      title: '删除失败，请重试',
                      icon: 'error'
                    });
                  case 20:
                  case "end":
                    return _context8.stop();
                }
              }
            }, _callee8, null, [[1, 16]]);
          }));
          function success(_x) {
            return _success.apply(this, arguments);
          }
          return success;
        }()
      });
    },
    // 格式化日期为输入框格式
    formatDateForInput: function formatDateForInput(date) {
      if (!date) return '';
      var d = new Date(date);
      var year = d.getFullYear();
      var month = String(d.getMonth() + 1).padStart(2, '0');
      var day = String(d.getDate()).padStart(2, '0');
      return "".concat(year, "-").concat(month, "-").concat(day);
    },
    deleteStudent: function deleteStudent() {
      var _this10 = this;
      uni.showModal({
        title: '确认删除',
        content: "\u786E\u5B9A\u8981\u5220\u9664\u5B66\u751F ".concat(this.studentData.name, " \u5417\uFF1F"),
        success: function () {
          var _success2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee9(res) {
            var result;
            return _regenerator.default.wrap(function _callee9$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    if (!res.confirm) {
                      _context9.next = 17;
                      break;
                    }
                    _context9.prev = 1;
                    _context9.next = 4;
                    return uniCloud.callFunction({
                      name: 'archive-manager',
                      data: {
                        action: 'deleteStudent',
                        studentId: _this10.studentData.studentId
                      }
                    });
                  case 4:
                    result = _context9.sent;
                    if (!(result.result.code === 0)) {
                      _context9.next = 10;
                      break;
                    }
                    uni.showToast({
                      title: '删除成功',
                      icon: 'success'
                    });

                    // 返回档案管理页面并刷新
                    setTimeout(function () {
                      uni.navigateBack();
                    }, 1500);
                    _context9.next = 11;
                    break;
                  case 10:
                    throw new Error(result.result.message || '删除失败');
                  case 11:
                    _context9.next = 17;
                    break;
                  case 13:
                    _context9.prev = 13;
                    _context9.t0 = _context9["catch"](1);
                    console.error('删除学生失败:', _context9.t0);
                    uni.showToast({
                      title: '删除失败，请重试',
                      icon: 'error'
                    });
                  case 17:
                  case "end":
                    return _context9.stop();
                }
              }
            }, _callee9, null, [[1, 13]]);
          }));
          function success(_x2) {
            return _success2.apply(this, arguments);
          }
          return success;
        }()
      });
    },
    // 更新档案管理页面的本地缓存
    updateArchiveCache: function updateArchiveCache() {
      try {
        var app = getApp();
        if (app.globalData && app.globalData.updateArchiveCache) {
          app.globalData.updateArchiveCache();
          console.log('已通知档案管理页面更新缓存');
        } else {
          console.log('档案管理页面未加载，无法更新缓存');
        }
      } catch (error) {
        console.error('更新档案管理缓存失败:', error);
      }
    }
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/uni-cloud/dist/index.js */ 27)["uniCloud"]))

/***/ }),

/***/ 364:
/*!***********************************************************************************************************************!*\
  !*** D:/代码/小程序/新欣火1/pages/student-detail/student-detail.vue?vue&type=style&index=0&id=e4349334&scoped=true&lang=css& ***!
  \***********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_student_detail_vue_vue_type_style_index_0_id_e4349334_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--6-oneOf-1-3!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./student-detail.vue?vue&type=style&index=0&id=e4349334&scoped=true&lang=css& */ 365);
/* harmony import */ var _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_student_detail_vue_vue_type_style_index_0_id_e4349334_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_student_detail_vue_vue_type_style_index_0_id_e4349334_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_student_detail_vue_vue_type_style_index_0_id_e4349334_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_student_detail_vue_vue_type_style_index_0_id_e4349334_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_student_detail_vue_vue_type_style_index_0_id_e4349334_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 365:
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/代码/小程序/新欣火1/pages/student-detail/student-detail.vue?vue&type=style&index=0&id=e4349334&scoped=true&lang=css& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[358,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/student-detail/student-detail.js.map