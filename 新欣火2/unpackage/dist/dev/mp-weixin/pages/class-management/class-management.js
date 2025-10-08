(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/class-management/class-management"],{

/***/ 334:
/*!*************************************************************************************!*\
  !*** D:/代码/小程序/新欣火1/main.js?{"page":"pages%2Fclass-management%2Fclass-management"} ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
__webpack_require__(/*! @dcloudio/vue-cli-plugin-uni/packages/uni-cloud/dist/index.js */ 27);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _classManagement = _interopRequireDefault(__webpack_require__(/*! ./pages/class-management/class-management.vue */ 335));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_classManagement.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 335:
/*!******************************************************************!*\
  !*** D:/代码/小程序/新欣火1/pages/class-management/class-management.vue ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _class_management_vue_vue_type_template_id_0b6f4086_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./class-management.vue?vue&type=template&id=0b6f4086&scoped=true& */ 336);
/* harmony import */ var _class_management_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./class-management.vue?vue&type=script&lang=js& */ 338);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _class_management_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _class_management_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _class_management_vue_vue_type_style_index_0_id_0b6f4086_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./class-management.vue?vue&type=style&index=0&id=0b6f4086&scoped=true&lang=css& */ 340);
/* harmony import */ var _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 44);

var renderjs





/* normalize component */

var component = Object(_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _class_management_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _class_management_vue_vue_type_template_id_0b6f4086_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _class_management_vue_vue_type_template_id_0b6f4086_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "0b6f4086",
  null,
  false,
  _class_management_vue_vue_type_template_id_0b6f4086_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages/class-management/class-management.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 336:
/*!*************************************************************************************************************!*\
  !*** D:/代码/小程序/新欣火1/pages/class-management/class-management.vue?vue&type=template&id=0b6f4086&scoped=true& ***!
  \*************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_class_management_vue_vue_type_template_id_0b6f4086_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./class-management.vue?vue&type=template&id=0b6f4086&scoped=true& */ 337);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_class_management_vue_vue_type_template_id_0b6f4086_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_class_management_vue_vue_type_template_id_0b6f4086_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_class_management_vue_vue_type_template_id_0b6f4086_scoped_true___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_class_management_vue_vue_type_template_id_0b6f4086_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 337:
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/代码/小程序/新欣火1/pages/class-management/class-management.vue?vue&type=template&id=0b6f4086&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
  var g0 = _vm.filteredClassList.length
  var l0 = _vm.__map(_vm.filteredClassList, function (item, index) {
    var $orig = _vm.__get_orig(item)
    var g1 = item.students ? item.students.length : null
    var g2 = item.teachers && item.teachers.length > 0
    var m0 = g2 ? _vm.getTeacherNames(item.teachers) : null
    return {
      $orig: $orig,
      g1: g1,
      g2: g2,
      m0: m0,
    }
  })
  var l1 = _vm.showAddClassModalFlag
    ? _vm.__map(_vm.filteredTeachers, function (teacher, index) {
        var $orig = _vm.__get_orig(teacher)
        var m1 = _vm.isSelectedTeacher(teacher)
        var m2 = _vm.getTeacherAvatarText(teacher)
        var m3 = _vm.isSelectedTeacher(teacher)
        return {
          $orig: $orig,
          m1: m1,
          m2: m2,
          m3: m3,
        }
      })
    : null
  var g3 = _vm.showAddClassModalFlag
    ? _vm.filteredTeachers.length === 0 && _vm.teacherSearchKeyword
    : null
  var l2 = _vm.showClassDetailModal
    ? _vm.__map(_vm.currentClass.teachers, function (teacher, index) {
        var $orig = _vm.__get_orig(teacher)
        var m4 = _vm.getTeacherAvatarText(teacher)
        return {
          $orig: $orig,
          m4: m4,
        }
      })
    : null
  var g4 = _vm.showClassDetailModal
    ? _vm.currentClass.teachers && _vm.currentClass.teachers.length > 0
    : null
  var l3 = _vm.showClassDetailModal
    ? _vm.__map(_vm.currentClass.students, function (student, index) {
        var $orig = _vm.__get_orig(student)
        var g5 = (student.name || "学").charAt(0)
        return {
          $orig: $orig,
          g5: g5,
        }
      })
    : null
  var g6 = _vm.showClassDetailModal
    ? !_vm.currentClass.students || _vm.currentClass.students.length === 0
    : null
  var l4 = _vm.showAddTeacherModalFlag
    ? _vm.__map(_vm.filteredTeacherList, function (teacher, index) {
        var $orig = _vm.__get_orig(teacher)
        var m5 = _vm.isTeacherToAddSelected(teacher)
        var m6 = _vm.getTeacherAvatarText(teacher)
        var m7 = _vm.isTeacherToAddSelected(teacher)
        return {
          $orig: $orig,
          m5: m5,
          m6: m6,
          m7: m7,
        }
      })
    : null
  var g7 = _vm.showAddTeacherModalFlag
    ? _vm.filteredTeacherList.length === 0 && _vm.teacherSearchKeyword
    : null
  var g8 = _vm.showAddTeacherModalFlag
    ? _vm.filteredTeacherList.length === 0 && !_vm.teacherSearchKeyword
    : null
  var l5 = _vm.showReplaceTeacherModalFlag
    ? _vm.__map(_vm.filteredTeacherList, function (teacher, index) {
        var $orig = _vm.__get_orig(teacher)
        var m8 = _vm.isTeacherToReplaceSelected(teacher)
        var m9 = _vm.getTeacherAvatarText(teacher)
        var m10 = _vm.isTeacherToReplaceSelected(teacher)
        return {
          $orig: $orig,
          m8: m8,
          m9: m9,
          m10: m10,
        }
      })
    : null
  var g9 = _vm.showReplaceTeacherModalFlag
    ? _vm.filteredTeacherList.length === 0 && _vm.teacherSearchKeyword
    : null
  var g10 = _vm.showReplaceTeacherModalFlag
    ? _vm.filteredTeacherList.length === 0 && !_vm.teacherSearchKeyword
    : null
  var l6 = _vm.showAddStudentModalFlag
    ? _vm.__map(_vm.filteredStudentList, function (student, __i0__) {
        var $orig = _vm.__get_orig(student)
        var m11 = _vm.isStudentSelected(student)
        var g11 = (student.name || "学").charAt(0)
        var m12 = _vm.isStudentSelected(student)
        return {
          $orig: $orig,
          m11: m11,
          g11: g11,
          m12: m12,
        }
      })
    : null
  var g12 = _vm.showAddStudentModalFlag
    ? _vm.filteredStudentList.length === 0 && _vm.studentSearchKeyword
    : null
  var g13 = _vm.showAddStudentModalFlag
    ? _vm.filteredStudentList.length === 0 && !_vm.studentSearchKeyword
    : null
  var g14 = _vm.showAddStudentModalFlag ? _vm.selectedStudents.length : null
  var g15 = _vm.showAddStudentModalFlag ? _vm.selectedStudents.length : null
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        g0: g0,
        l0: l0,
        l1: l1,
        g3: g3,
        l2: l2,
        g4: g4,
        l3: l3,
        g6: g6,
        l4: l4,
        g7: g7,
        g8: g8,
        l5: l5,
        g9: g9,
        g10: g10,
        l6: l6,
        g12: g12,
        g13: g13,
        g14: g14,
        g15: g15,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 338:
/*!*******************************************************************************************!*\
  !*** D:/代码/小程序/新欣火1/pages/class-management/class-management.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_class_management_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./class-management.vue?vue&type=script&lang=js& */ 339);
/* harmony import */ var _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_class_management_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_class_management_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_class_management_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_class_management_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_class_management_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 339:
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/代码/小程序/新欣火1/pages/class-management/class-management.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
      classList: [],
      filteredClassList: [],
      teacherList: [],
      showAddClassModalFlag: false,
      showClassDetailModal: false,
      showAddTeacherModalFlag: false,
      showReplaceTeacherModalFlag: false,
      showAddStudentModalFlag: false,
      showToast: false,
      toastMessage: '',
      newClass: {
        className: '',
        grade: '',
        teachers: []
      },
      currentClass: {
        className: '',
        teachers: [],
        students: []
      },
      newStudent: {
        studentName: '',
        grade: ''
      },
      selectedTeachers: [],
      teacherToAdd: null,
      teacherToReplace: null,
      studentList: [],
      filteredStudentList: [],
      studentSearchKeyword: '',
      selectedStudents: [],
      filteredTeacherList: [],
      teacherSearchKeyword: '',
      filteredTeachers: [],
      // 搜索和筛选相关
      searchKeyword: '',
      gradeIndex: 0,
      subjectIndex: 0,
      gradeOptions: ['全部年级', '一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级', '高一', '高二', '高三'],
      subjectOptions: ['全部科目', '语文', '数学', '英语', '物理', '化学']
    };
  },
  onLoad: function onLoad() {
    this.loadClassList();
    this.loadTeacherList();
    this.loadStudentList();
  },
  computed: {},
  watch: {
    // 监听筛选条件变化，自动重新筛选
    searchKeyword: function searchKeyword() {
      this.filterClassList();
    },
    gradeIndex: function gradeIndex() {
      this.filterClassList();
    },
    subjectIndex: function subjectIndex() {
      this.filterClassList();
    }
  },
  methods: {
    // 添加返回方法
    goBack: function goBack() {
      uni.navigateBack();
    },
    // 加载班级列表
    loadClassList: function loadClassList() {
      var _this = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var res;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                console.log('开始加载班级列表...');
                _context.next = 4;
                return uniCloud.callFunction({
                  name: 'class-management',
                  data: {
                    action: 'getClasses',
                    page: 1,
                    pageSize: 1000 // 获取所有班级
                  }
                });
              case 4:
                res = _context.sent;
                console.log('班级列表云函数返回结果:', res);
                if (res.result.code === 0) {
                  _this.classList = res.result.data || [];
                  console.log('班级列表加载成功，数量:', _this.classList.length);
                  console.log('班级列表数据:', _this.classList);

                  // 调试日志：显示第一个班级的teachers信息
                  if (_this.classList.length > 0) {
                    console.log('第一个班级的teachers信息:', _this.classList[0].teachers);
                    console.log('第一个班级的headTeacher:', _this.classList[0].headTeacher);
                  }
                  _this.filterClassList(); // 加载完成后立即筛选
                } else {
                  console.error('加载班级列表失败:', res.result.message);
                  _this.showToastMessage('加载班级列表失败: ' + res.result.message);
                }
                _context.next = 13;
                break;
              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](0);
                console.error('加载班级列表失败:', _context.t0);
                _this.showToastMessage('加载班级列表失败: ' + _context.t0.message);
              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 9]]);
      }))();
    },
    // 筛选班级列表
    filterClassList: function filterClassList() {
      var filtered = (0, _toConsumableArray2.default)(this.classList);

      // 按搜索关键词筛选
      if (this.searchKeyword.trim()) {
        var keyword = this.searchKeyword.toLowerCase().trim();
        filtered = filtered.filter(function (item) {
          return item.className && item.className.toLowerCase().includes(keyword);
        });
      }

      // 按年级筛选
      if (this.gradeIndex > 0) {
        var selectedGrade = this.gradeOptions[this.gradeIndex];
        filtered = filtered.filter(function (item) {
          return item.grade === selectedGrade;
        });
      }

      // 按科目筛选
      if (this.subjectIndex > 0) {
        var selectedSubject = this.subjectOptions[this.subjectIndex];
        filtered = filtered.filter(function (item) {
          return item.className && item.className.includes(selectedSubject);
        });
      }
      this.filteredClassList = filtered;
    },
    // 搜索输入处理
    onSearchInput: function onSearchInput() {
      // 搜索输入由watch自动处理
    },
    // 年级选择变化
    onGradeChange: function onGradeChange(e) {
      this.gradeIndex = e.detail.value;
    },
    // 科目选择变化
    onSubjectChange: function onSubjectChange(e) {
      this.subjectIndex = e.detail.value;
    },
    // 高亮显示搜索关键词
    highlightText: function highlightText(text, keyword) {
      if (!text) {
        return '';
      }
      if (!keyword || !keyword.trim()) {
        return text;
      }
      var regex = new RegExp("(".concat(keyword.trim(), ")"), 'gi');
      return text.replace(regex, '<span class="highlight">$1</span>');
    },
    // 加载老师列表
    loadTeacherList: function loadTeacherList() {
      var _this2 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var res, academicAccounts;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                console.log('开始加载教师列表...');
                _context2.next = 4;
                return uniCloud.callFunction({
                  name: 'class-management',
                  data: {
                    action: 'getTeacherList'
                  }
                });
              case 4:
                res = _context2.sent;
                console.log('教师列表云函数返回结果:', res);
                if (res.result.code === 0) {
                  _this2.teacherList = res.result.data;
                  _this2.filteredTeacherList = (0, _toConsumableArray2.default)(res.result.data);
                  _this2.filteredTeachers = (0, _toConsumableArray2.default)(res.result.data);
                  console.log('教师列表加载成功，数量:', _this2.teacherList.length);
                  console.log('教师列表数据:', _this2.teacherList);

                  // 检查是否包含教务账号
                  academicAccounts = _this2.teacherList.filter(function (teacher) {
                    return teacher.mobile === '18186191270' || teacher.username === '18186191270' || teacher.teacherName && teacher.teacherName.includes('教务') ||
                    // 检查手机号用户名且姓名只有1个字的账号
                    teacher.username && /^1\d{10}$/.test(teacher.username) && teacher.teacherName && teacher.teacherName.length === 1;
                  });
                  if (academicAccounts.length > 0) {
                    console.log('⚠️ 警告：教师列表中仍包含教务账号:', academicAccounts);
                    // 详细显示每个教务账号的信息
                    academicAccounts.forEach(function (account) {
                      console.log('📋 教务账号详细信息:', _objectSpread({
                        _id: account._id,
                        username: account.username,
                        teacherName: account.teacherName,
                        mobile: account.mobile
                      }, account));
                    });
                  } else {
                    console.log('✅ 教师列表已正确过滤，不包含教务账号');
                  }
                } else {
                  console.error('加载教师列表失败:', res.result.message);
                  _this2.showToastMessage('加载老师列表失败: ' + res.result.message);
                }
                _context2.next = 13;
                break;
              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2["catch"](0);
                console.error('加载老师列表失败:', _context2.t0);
                _this2.showToastMessage('加载老师列表失败: ' + _context2.t0.message);
              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 9]]);
      }))();
    },
    // 显示新建班级弹窗
    showAddClassModal: function showAddClassModal() {
      this.showAddClassModalFlag = true;
      this.newClass = {
        className: '',
        teachers: []
      };
      this.selectedTeachers = [];
      this.teacherSearchKeyword = '';
      this.filteredTeachers = (0, _toConsumableArray2.default)(this.teacherList);
    },
    // 关闭新建班级弹窗
    closeAddClassModal: function closeAddClassModal() {
      this.showAddClassModalFlag = false;
    },
    // 老师搜索输入处理
    onTeacherSearchInput: function onTeacherSearchInput() {
      console.log('老师搜索输入:', this.teacherSearchKeyword);
      console.log('当前教师列表长度:', this.teacherList.length);
      if (!this.teacherSearchKeyword.trim()) {
        this.filteredTeachers = (0, _toConsumableArray2.default)(this.teacherList);
        console.log('搜索关键词为空，显示所有教师:', this.filteredTeachers.length);
        return;
      }
      var keyword = this.teacherSearchKeyword.toLowerCase().trim();
      this.filteredTeachers = this.teacherList.filter(function (teacher) {
        var name = (teacher.teacherName || teacher.username || '').toLowerCase();
        var match = name.includes(keyword);
        console.log("\u6559\u5E08 ".concat(name, " \u5339\u914D\u5173\u952E\u8BCD ").concat(keyword, ":"), match);
        return match;
      });
      console.log('搜索后过滤的教师数量:', this.filteredTeachers.length);
    },
    // 切换老师选择状态
    toggleTeacherSelection: function toggleTeacherSelection(teacher) {
      var index = this.selectedTeachers.findIndex(function (t) {
        return t._id === teacher._id;
      });
      if (index > -1) {
        this.selectedTeachers.splice(index, 1);
      } else {
        this.selectedTeachers.push(teacher);
      }
    },
    // 判断老师是否被选中
    isSelectedTeacher: function isSelectedTeacher(teacher) {
      return this.selectedTeachers.some(function (t) {
        return t._id === teacher._id;
      });
    },
    // 新建班级
    addClass: function addClass() {
      var _this3 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var res;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (_this3.newClass.className) {
                  _context3.next = 3;
                  break;
                }
                _this3.showToastMessage('请输入班级名称');
                return _context3.abrupt("return");
              case 3:
                if (_this3.newClass.grade) {
                  _context3.next = 6;
                  break;
                }
                _this3.showToastMessage('请输入年级');
                return _context3.abrupt("return");
              case 6:
                _context3.prev = 6;
                _context3.next = 9;
                return uniCloud.callFunction({
                  name: 'class-management',
                  data: {
                    action: 'createClass',
                    className: _this3.newClass.className,
                    grade: _this3.newClass.grade,
                    teachers: _this3.selectedTeachers
                  }
                });
              case 9:
                res = _context3.sent;
                if (res.result.code === 0) {
                  _this3.showToastMessage('班级创建成功');
                  _this3.closeAddClassModal();
                  _this3.loadClassList();

                  // 班级创建成功，无需更新缓存
                } else {
                  _this3.showToastMessage(res.result.message || '班级创建失败');
                }
                _context3.next = 17;
                break;
              case 13:
                _context3.prev = 13;
                _context3.t0 = _context3["catch"](6);
                console.error('创建班级失败:', _context3.t0);
                _this3.showToastMessage('班级创建失败');
              case 17:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[6, 13]]);
      }))();
    },
    // 打开班级详情
    openClassDetail: function openClassDetail(classItem) {
      this.currentClass = JSON.parse(JSON.stringify(classItem));
      this.showClassDetailModal = true;
    },
    // 关闭班级详情弹窗
    closeClassDetailModal: function closeClassDetailModal() {
      this.showClassDetailModal = false;
    },
    // 获取老师姓名列表
    getTeacherNames: function getTeacherNames(teachers) {
      if (!teachers || teachers.length === 0) return '未设置';
      return teachers.map(function (t) {
        return t.teacherName || t.username;
      }).join(', ');
    },
    // 获取老师头像文字
    getTeacherAvatarText: function getTeacherAvatarText(teacher) {
      if (!teacher) return '师';

      // 优先使用老师姓名
      if (teacher.teacherName && teacher.teacherName.trim()) {
        return teacher.teacherName.trim().charAt(0);
      }

      // 其次使用用户名
      if (teacher.username && teacher.username.trim()) {
        return teacher.username.trim().charAt(0);
      }

      // 最后使用默认文字
      return '师';
    },
    // 显示添加老师弹窗
    showAddTeacherModal: function showAddTeacherModal() {
      this.showAddTeacherModalFlag = true;
      this.teacherToAdd = null;
      this.teacherSearchKeyword = '';
      this.filteredTeacherList = (0, _toConsumableArray2.default)(this.teacherList);
    },
    // 关闭添加老师弹窗
    closeAddTeacherModal: function closeAddTeacherModal() {
      this.showAddTeacherModalFlag = false;
      this.teacherSearchKeyword = '';
    },
    // 显示替换老师弹窗
    showReplaceTeacherModal: function showReplaceTeacherModal() {
      this.showReplaceTeacherModalFlag = true;
      this.teacherToReplace = null;
      this.teacherSearchKeyword = '';
      this.filteredTeacherList = (0, _toConsumableArray2.default)(this.teacherList);
    },
    // 关闭替换老师弹窗
    closeReplaceTeacherModal: function closeReplaceTeacherModal() {
      this.showReplaceTeacherModalFlag = false;
      this.teacherSearchKeyword = '';
    },
    // 过滤老师列表
    filterTeachers: function filterTeachers() {
      if (!this.teacherSearchKeyword.trim()) {
        this.filteredTeacherList = (0, _toConsumableArray2.default)(this.teacherList);
        return;
      }
      var keyword = this.teacherSearchKeyword.toLowerCase().trim();
      this.filteredTeacherList = this.teacherList.filter(function (teacher) {
        var teacherName = (teacher.teacherName || '').toLowerCase();
        var username = (teacher.username || '').toLowerCase();
        return teacherName.includes(keyword) || username.includes(keyword);
      });
    },
    // 选择要添加的老师
    selectTeacherToAdd: function selectTeacherToAdd(teacher) {
      this.teacherToAdd = teacher;
    },
    // 判断要添加的老师是否被选中
    isTeacherToAddSelected: function isTeacherToAddSelected(teacher) {
      return this.teacherToAdd && this.teacherToAdd._id === teacher._id;
    },
    // 选择要替换的老师
    selectTeacherToReplace: function selectTeacherToReplace(teacher) {
      this.teacherToReplace = teacher;
    },
    // 判断要替换的老师是否被选中
    isTeacherToReplaceSelected: function isTeacherToReplaceSelected(teacher) {
      return this.teacherToReplace && this.teacherToReplace._id === teacher._id;
    },
    // 添加老师到班级
    addTeacherToClass: function addTeacherToClass() {
      var _this4 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
        var res;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (_this4.teacherToAdd) {
                  _context4.next = 3;
                  break;
                }
                _this4.showToastMessage('请选择要添加的老师');
                return _context4.abrupt("return");
              case 3:
                _context4.prev = 3;
                _context4.next = 6;
                return uniCloud.callFunction({
                  name: 'class-management',
                  data: {
                    action: 'addTeacherToClass',
                    classId: _this4.currentClass._id,
                    teacher: _this4.teacherToAdd
                  }
                });
              case 6:
                res = _context4.sent;
                if (res.result.code === 0) {
                  _this4.showToastMessage('老师添加成功');
                  _this4.closeAddTeacherModal();
                  // 更新当前班级的老师列表
                  if (!_this4.currentClass.teachers) {
                    _this4.currentClass.teachers = [];
                  }
                  _this4.currentClass.teachers.push(_this4.teacherToAdd);
                  // 重新加载班级列表
                  _this4.loadClassList();
                } else {
                  _this4.showToastMessage(res.result.message || '添加老师失败');
                }
                _context4.next = 14;
                break;
              case 10:
                _context4.prev = 10;
                _context4.t0 = _context4["catch"](3);
                console.error('添加老师到班级失败:', _context4.t0);
                _this4.showToastMessage('添加老师失败');
              case 14:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[3, 10]]);
      }))();
    },
    // 替换老师
    replaceTeacher: function replaceTeacher() {
      var _this5 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5() {
        var res;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (_this5.teacherToReplace) {
                  _context5.next = 3;
                  break;
                }
                _this5.showToastMessage('请选择要替换的老师');
                return _context5.abrupt("return");
              case 3:
                _context5.prev = 3;
                _context5.next = 6;
                return uniCloud.callFunction({
                  name: 'class-management',
                  data: {
                    action: 'replaceTeacher',
                    classId: _this5.currentClass._id,
                    newTeacher: _this5.teacherToReplace
                  }
                });
              case 6:
                res = _context5.sent;
                if (res.result.code === 0) {
                  _this5.showToastMessage('老师替换成功');
                  _this5.closeReplaceTeacherModal();
                  // 更新当前班级的老师列表
                  _this5.currentClass.teachers = [_this5.teacherToReplace];
                  // 重新加载班级列表
                  _this5.loadClassList();
                } else {
                  _this5.showToastMessage(res.result.message || '替换老师失败');
                }
                _context5.next = 14;
                break;
              case 10:
                _context5.prev = 10;
                _context5.t0 = _context5["catch"](3);
                console.error('替换老师失败:', _context5.t0);
                _this5.showToastMessage('替换老师失败');
              case 14:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[3, 10]]);
      }))();
    },
    // 移除班级老师
    removeTeacher: function removeTeacher(teacher) {
      var _this6 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6() {
        var res, index;
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                _context6.next = 3;
                return uniCloud.callFunction({
                  name: 'class-management',
                  data: {
                    action: 'removeTeacherFromClass',
                    classId: _this6.currentClass._id,
                    teacherId: teacher._id
                  }
                });
              case 3:
                res = _context6.sent;
                if (res.result.code === 0) {
                  _this6.showToastMessage('老师移除成功');
                  // 更新当前班级的老师列表
                  index = _this6.currentClass.teachers.findIndex(function (t) {
                    return t._id === teacher._id;
                  });
                  if (index > -1) {
                    _this6.currentClass.teachers.splice(index, 1);
                  }
                  // 重新加载班级列表
                  _this6.loadClassList();
                } else {
                  _this6.showToastMessage(res.result.message || '移除老师失败');
                }
                _context6.next = 11;
                break;
              case 7:
                _context6.prev = 7;
                _context6.t0 = _context6["catch"](0);
                console.error('移除老师失败:', _context6.t0);
                _this6.showToastMessage('移除老师失败');
              case 11:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[0, 7]]);
      }))();
    },
    // 显示添加学生弹窗
    showAddStudentModal: function showAddStudentModal() {
      this.showAddStudentModalFlag = true;
      this.studentSearchKeyword = '';
      this.selectedStudents = [];
      this.filteredStudentList = (0, _toConsumableArray2.default)(this.studentList);
    },
    // 关闭添加学生弹窗
    closeAddStudentModal: function closeAddStudentModal() {
      this.showAddStudentModalFlag = false;
      this.studentSearchKeyword = '';
      this.selectedStudents = [];
    },
    // 过滤学生列表
    filterStudents: function filterStudents() {
      if (!this.studentSearchKeyword.trim()) {
        this.filteredStudentList = (0, _toConsumableArray2.default)(this.studentList);
        return;
      }
      var keyword = this.studentSearchKeyword.toLowerCase().trim();
      this.filteredStudentList = this.studentList.filter(function (student) {
        var name = (student.name || '').toLowerCase();
        var studentId = (student.studentId || '').toLowerCase();
        return name.includes(keyword) || studentId.includes(keyword);
      });
    },
    // 选择学生
    selectStudent: function selectStudent(student) {
      var index = this.selectedStudents.findIndex(function (s) {
        return s._id === student._id;
      });
      if (index > -1) {
        this.selectedStudents.splice(index, 1);
      } else {
        this.selectedStudents.push(student);
      }
    },
    // 判断学生是否被选中
    isStudentSelected: function isStudentSelected(student) {
      return this.selectedStudents.some(function (s) {
        return s._id === student._id;
      });
    },
    // 加载学生列表
    loadStudentList: function loadStudentList() {
      var _this7 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7() {
        var res;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                _context7.next = 3;
                return uniCloud.callFunction({
                  name: 'student-manager',
                  data: {
                    action: 'getStudents',
                    page: 1,
                    pageSize: 1000 // 获取所有学生
                  }
                });
              case 3:
                res = _context7.sent;
                if (res.result.code === 0) {
                  _this7.studentList = res.result.data.list;
                  _this7.filteredStudentList = (0, _toConsumableArray2.default)(res.result.data.list);
                } else {
                  _this7.showToastMessage('加载学生列表失败');
                }
                _context7.next = 11;
                break;
              case 7:
                _context7.prev = 7;
                _context7.t0 = _context7["catch"](0);
                console.error('加载学生列表失败:', _context7.t0);
                _this7.showToastMessage('加载学生列表失败');
              case 11:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[0, 7]]);
      }))();
    },
    // 添加选中的学生到班级
    addSelectedStudentsToClass: function addSelectedStudentsToClass() {
      var _this8 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee8() {
        var promises, results, successCount;
        return _regenerator.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (!(_this8.selectedStudents.length === 0)) {
                  _context8.next = 3;
                  break;
                }
                _this8.showToastMessage('请选择要添加的学生');
                return _context8.abrupt("return");
              case 3:
                _context8.prev = 3;
                promises = _this8.selectedStudents.map(function (student) {
                  return uniCloud.callFunction({
                    name: 'class-management',
                    data: {
                      action: 'addStudentToClass',
                      classId: _this8.currentClass._id,
                      studentId: student.studentId,
                      studentName: student.name,
                      grade: student.grade
                    }
                  });
                });
                _context8.next = 7;
                return Promise.all(promises);
              case 7:
                results = _context8.sent;
                successCount = results.filter(function (res) {
                  return res.result.code === 0;
                }).length;
                if (successCount > 0) {
                  _this8.showToastMessage("\u6210\u529F\u6DFB\u52A0 ".concat(successCount, " \u540D\u5B66\u751F"));
                  _this8.closeAddStudentModal();
                  // 重新加载班级列表
                  _this8.loadClassList();
                  // 重新加载学生列表
                  _this8.loadStudentList();
                } else {
                  _this8.showToastMessage('添加学生失败');
                }
                _context8.next = 16;
                break;
              case 12:
                _context8.prev = 12;
                _context8.t0 = _context8["catch"](3);
                console.error('添加学生失败:', _context8.t0);
                _this8.showToastMessage('添加学生失败');
              case 16:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, null, [[3, 12]]);
      }))();
    },
    // 移除班级学生
    removeStudent: function removeStudent(student) {
      var _this9 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee9() {
        var res, index;
        return _regenerator.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.prev = 0;
                _context9.next = 3;
                return uniCloud.callFunction({
                  name: 'class-management',
                  data: {
                    action: 'removeStudentFromClass',
                    classId: _this9.currentClass._id,
                    studentId: student._id
                  }
                });
              case 3:
                res = _context9.sent;
                if (res.result.code === 0) {
                  _this9.showToastMessage('学生移除成功');
                  // 更新当前班级的学生列表
                  index = _this9.currentClass.students.findIndex(function (s) {
                    return s._id === student._id;
                  });
                  if (index > -1) {
                    _this9.currentClass.students.splice(index, 1);
                  }
                  // 重新加载班级列表
                  _this9.loadClassList();
                } else {
                  _this9.showToastMessage(res.result.message || '移除学生失败');
                }
                _context9.next = 11;
                break;
              case 7:
                _context9.prev = 7;
                _context9.t0 = _context9["catch"](0);
                console.error('移除学生失败:', _context9.t0);
                _this9.showToastMessage('移除学生失败');
              case 11:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, null, [[0, 7]]);
      }))();
    },
    // 删除班级
    deleteClass: function deleteClass(classItem) {
      var _this10 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee11() {
        return _regenerator.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                // 确认删除
                uni.showModal({
                  title: '确认删除',
                  content: "\u786E\u5B9A\u8981\u5220\u9664\u73ED\u7EA7\"".concat(classItem.className, "\"\u5417\uFF1F\u6B64\u64CD\u4F5C\u5C06\u5220\u9664\u8BE5\u73ED\u7EA7\u53CA\u5176\u6240\u6709\u5B66\u751F\u548C\u8001\u5E08\u5173\u8054\u3002"),
                  success: function () {
                    var _success = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee10(res) {
                      var result;
                      return _regenerator.default.wrap(function _callee10$(_context10) {
                        while (1) {
                          switch (_context10.prev = _context10.next) {
                            case 0:
                              if (!res.confirm) {
                                _context10.next = 12;
                                break;
                              }
                              _context10.prev = 1;
                              _context10.next = 4;
                              return uniCloud.callFunction({
                                name: 'class-management',
                                data: {
                                  action: 'deleteClass',
                                  classId: classItem._id
                                }
                              });
                            case 4:
                              result = _context10.sent;
                              if (result.result.code === 0) {
                                _this10.showToastMessage('班级删除成功');
                                _this10.loadClassList();
                              } else {
                                console.error('删除班级失败:', result.result);
                                _this10.showToastMessage(result.result.message || '删除班级失败');
                              }
                              _context10.next = 12;
                              break;
                            case 8:
                              _context10.prev = 8;
                              _context10.t0 = _context10["catch"](1);
                              console.error('删除班级失败:', _context10.t0);
                              _this10.showToastMessage('删除班级失败: ' + _context10.t0.message);
                            case 12:
                            case "end":
                              return _context10.stop();
                          }
                        }
                      }, _callee10, null, [[1, 8]]);
                    }));
                    function success(_x) {
                      return _success.apply(this, arguments);
                    }
                    return success;
                  }()
                });
              case 1:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11);
      }))();
    },
    // 显示Toast提示
    showToastMessage: function showToastMessage(message) {
      var _this11 = this;
      this.toastMessage = message;
      this.showToast = true;
      setTimeout(function () {
        _this11.showToast = false;
      }, 2000);
    }
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/uni-cloud/dist/index.js */ 27)["uniCloud"]))

/***/ }),

/***/ 340:
/*!***************************************************************************************************************************!*\
  !*** D:/代码/小程序/新欣火1/pages/class-management/class-management.vue?vue&type=style&index=0&id=0b6f4086&scoped=true&lang=css& ***!
  \***************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_class_management_vue_vue_type_style_index_0_id_0b6f4086_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--6-oneOf-1-3!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../hbuilderx/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./class-management.vue?vue&type=style&index=0&id=0b6f4086&scoped=true&lang=css& */ 341);
/* harmony import */ var _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_class_management_vue_vue_type_style_index_0_id_0b6f4086_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_class_management_vue_vue_type_style_index_0_id_0b6f4086_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_class_management_vue_vue_type_style_index_0_id_0b6f4086_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_class_management_vue_vue_type_style_index_0_id_0b6f4086_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_hbuilderx_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_class_management_vue_vue_type_style_index_0_id_0b6f4086_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 341:
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/代码/小程序/新欣火1/pages/class-management/class-management.vue?vue&type=style&index=0&id=0b6f4086&scoped=true&lang=css& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[334,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/class-management/class-management.js.map