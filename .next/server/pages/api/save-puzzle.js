"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/save-puzzle";
exports.ids = ["pages/api/save-puzzle"];
exports.modules = {

/***/ "(api-node)/./lib/savePuzzle.ts":
/*!***************************!*\
  !*** ./lib/savePuzzle.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   savePuzzleToDisk: () => (/* binding */ savePuzzleToDisk)\n/* harmony export */ });\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);\n\n\nfunction savePuzzleToDisk(puzzle, slug) {\n    const jsonPath = path__WEBPACK_IMPORTED_MODULE_1___default().join(process.cwd(), 'lib', \"puzzles\", `${slug}.json`);\n    if (fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(jsonPath)) return \"already-saved\";\n    fs__WEBPACK_IMPORTED_MODULE_0___default().writeFileSync(jsonPath, JSON.stringify(puzzle, null, 2), 'utf8');\n    const gameDataPath = path__WEBPACK_IMPORTED_MODULE_1___default().join(process.cwd(), 'lib', 'gameData.ts');\n    const importLine = `import ${slug.replace(/-/g, '_')} from './puzzles/${slug}.json';\\n`;\n    const exportLine = `  ${slug.replace(/-/g, '_')} as Puzzle,\\n`;\n    const fileContent = fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(gameDataPath, 'utf8');\n    const newContent = fileContent.replace('// END IMPORTS', `${importLine}// END IMPORTS`).replace('// END EXPORTS', `${exportLine}  // END EXPORTS`);\n    fs__WEBPACK_IMPORTED_MODULE_0___default().writeFileSync(gameDataPath, newContent, 'utf8');\n    return \"saved\";\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaS1ub2RlKS8uL2xpYi9zYXZlUHV6emxlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQW9CO0FBQ0k7QUFJakIsU0FBU0UsaUJBQWlCQyxNQUFjLEVBQUVDLElBQVk7SUFDM0QsTUFBTUMsV0FBV0osZ0RBQVMsQ0FBQ00sUUFBUUMsR0FBRyxJQUFJLE9BQU8sV0FBVyxHQUFHSixLQUFLLEtBQUssQ0FBQztJQUMxRSxJQUFJSixvREFBYSxDQUFDSyxXQUFXLE9BQU87SUFFcENMLHVEQUFnQixDQUFDSyxVQUFVTSxLQUFLQyxTQUFTLENBQUNULFFBQVEsTUFBTSxJQUFJO0lBRTVELE1BQU1VLGVBQWVaLGdEQUFTLENBQUNNLFFBQVFDLEdBQUcsSUFBSSxPQUFPO0lBQ3JELE1BQU1NLGFBQWEsQ0FBQyxPQUFPLEVBQUVWLEtBQUtXLE9BQU8sQ0FBQyxNQUFNLEtBQUssaUJBQWlCLEVBQUVYLEtBQUssU0FBUyxDQUFDO0lBQ3pGLE1BQU1ZLGFBQWEsQ0FBQyxFQUFFLEVBQUVaLEtBQUtXLE9BQU8sQ0FBQyxNQUFNLEtBQUssYUFBYSxDQUFDO0lBRTVELE1BQU1FLGNBQWNqQixzREFBZSxDQUFDYSxjQUFjO0lBQ2xELE1BQU1NLGFBQWFGLFlBQ2hCRixPQUFPLENBQUMsa0JBQWtCLEdBQUdELFdBQVcsY0FBYyxDQUFDLEVBQ3ZEQyxPQUFPLENBQUMsa0JBQWtCLEdBQUdDLFdBQVcsZ0JBQWdCLENBQUM7SUFFNURoQix1REFBZ0IsQ0FBQ2EsY0FBY00sWUFBWTtJQUMzQyxPQUFPO0FBQ1QiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcaXRzYW1cXERvY3VtZW50c1xcVGltZWxpbmVzXFxzYW5kYm94XFxsaWJcXHNhdmVQdXp6bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJztcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCB7IFB1enpsZSB9IGZyb20gJy4vZ2FtZURhdGEnO1xyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlUHV6emxlVG9EaXNrKHB1enpsZTogUHV6emxlLCBzbHVnOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIGNvbnN0IGpzb25QYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdsaWInLCBcInB1enpsZXNcIiwgYCR7c2x1Z30uanNvbmApO1xyXG4gIGlmIChmcy5leGlzdHNTeW5jKGpzb25QYXRoKSkgcmV0dXJuIFwiYWxyZWFkeS1zYXZlZFwiO1xyXG5cclxuICBmcy53cml0ZUZpbGVTeW5jKGpzb25QYXRoLCBKU09OLnN0cmluZ2lmeShwdXp6bGUsIG51bGwsIDIpLCAndXRmOCcpO1xyXG5cclxuICBjb25zdCBnYW1lRGF0YVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ2xpYicsICdnYW1lRGF0YS50cycpO1xyXG4gIGNvbnN0IGltcG9ydExpbmUgPSBgaW1wb3J0ICR7c2x1Zy5yZXBsYWNlKC8tL2csICdfJyl9IGZyb20gJy4vcHV6emxlcy8ke3NsdWd9Lmpzb24nO1xcbmA7XHJcbmNvbnN0IGV4cG9ydExpbmUgPSBgICAke3NsdWcucmVwbGFjZSgvLS9nLCAnXycpfSBhcyBQdXp6bGUsXFxuYDtcclxuXHJcbiAgY29uc3QgZmlsZUNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoZ2FtZURhdGFQYXRoLCAndXRmOCcpO1xyXG4gIGNvbnN0IG5ld0NvbnRlbnQgPSBmaWxlQ29udGVudFxyXG4gICAgLnJlcGxhY2UoJy8vIEVORCBJTVBPUlRTJywgYCR7aW1wb3J0TGluZX0vLyBFTkQgSU1QT1JUU2ApXHJcbiAgICAucmVwbGFjZSgnLy8gRU5EIEVYUE9SVFMnLCBgJHtleHBvcnRMaW5lfSAgLy8gRU5EIEVYUE9SVFNgKTtcclxuXHJcbiAgZnMud3JpdGVGaWxlU3luYyhnYW1lRGF0YVBhdGgsIG5ld0NvbnRlbnQsICd1dGY4Jyk7XHJcbiAgcmV0dXJuIFwic2F2ZWRcIjtcclxufVxyXG4iXSwibmFtZXMiOlsiZnMiLCJwYXRoIiwic2F2ZVB1enpsZVRvRGlzayIsInB1enpsZSIsInNsdWciLCJqc29uUGF0aCIsImpvaW4iLCJwcm9jZXNzIiwiY3dkIiwiZXhpc3RzU3luYyIsIndyaXRlRmlsZVN5bmMiLCJKU09OIiwic3RyaW5naWZ5IiwiZ2FtZURhdGFQYXRoIiwiaW1wb3J0TGluZSIsInJlcGxhY2UiLCJleHBvcnRMaW5lIiwiZmlsZUNvbnRlbnQiLCJyZWFkRmlsZVN5bmMiLCJuZXdDb250ZW50Il0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api-node)/./lib/savePuzzle.ts\n");

/***/ }),

/***/ "(api-node)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fsave-puzzle&preferredRegion=&absolutePagePath=.%2Fpages%5Capi%5Csave-puzzle.ts&middlewareConfigBase64=e30%3D!":
/*!****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fsave-puzzle&preferredRegion=&absolutePagePath=.%2Fpages%5Capi%5Csave-puzzle.ts&middlewareConfigBase64=e30%3D! ***!
  \****************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   routeModule: () => (/* binding */ routeModule)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/pages-api/module.compiled */ \"(api-node)/./node_modules/next/dist/server/route-modules/pages-api/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(api-node)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/build/templates/helpers */ \"(api-node)/./node_modules/next/dist/build/templates/helpers.js\");\n/* harmony import */ var _pages_api_save_puzzle_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages\\api\\save-puzzle.ts */ \"(api-node)/./pages/api/save-puzzle.ts\");\n\n\n\n// Import the userland code.\n\n// Re-export the handler (should be the default export).\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_pages_api_save_puzzle_ts__WEBPACK_IMPORTED_MODULE_3__, 'default'));\n// Re-export config.\nconst config = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_pages_api_save_puzzle_ts__WEBPACK_IMPORTED_MODULE_3__, 'config');\n// Create and export the route module that will be consumed.\nconst routeModule = new next_dist_server_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__.PagesAPIRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.PAGES_API,\n        page: \"/api/save-puzzle\",\n        pathname: \"/api/save-puzzle\",\n        // The following aren't used in production.\n        bundlePath: '',\n        filename: ''\n    },\n    userland: _pages_api_save_puzzle_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n\n//# sourceMappingURL=pages-api.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaS1ub2RlKS8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvYnVpbGQvd2VicGFjay9sb2FkZXJzL25leHQtcm91dGUtbG9hZGVyL2luZGV4LmpzP2tpbmQ9UEFHRVNfQVBJJnBhZ2U9JTJGYXBpJTJGc2F2ZS1wdXp6bGUmcHJlZmVycmVkUmVnaW9uPSZhYnNvbHV0ZVBhZ2VQYXRoPS4lMkZwYWdlcyU1Q2FwaSU1Q3NhdmUtcHV6emxlLnRzJm1pZGRsZXdhcmVDb25maWdCYXNlNjQ9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNFO0FBQzFEO0FBQ3lEO0FBQ3pEO0FBQ0EsaUVBQWUsd0VBQUssQ0FBQyxzREFBUSxZQUFZLEVBQUM7QUFDMUM7QUFDTyxlQUFlLHdFQUFLLENBQUMsc0RBQVE7QUFDcEM7QUFDTyx3QkFBd0IseUdBQW1CO0FBQ2xEO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLFlBQVk7QUFDWixDQUFDOztBQUVEIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGFnZXNBUElSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvcGFnZXMtYXBpL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgaG9pc3QgfSBmcm9tIFwibmV4dC9kaXN0L2J1aWxkL3RlbXBsYXRlcy9oZWxwZXJzXCI7XG4vLyBJbXBvcnQgdGhlIHVzZXJsYW5kIGNvZGUuXG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiLi9wYWdlc1xcXFxhcGlcXFxcc2F2ZS1wdXp6bGUudHNcIjtcbi8vIFJlLWV4cG9ydCB0aGUgaGFuZGxlciAoc2hvdWxkIGJlIHRoZSBkZWZhdWx0IGV4cG9ydCkuXG5leHBvcnQgZGVmYXVsdCBob2lzdCh1c2VybGFuZCwgJ2RlZmF1bHQnKTtcbi8vIFJlLWV4cG9ydCBjb25maWcuXG5leHBvcnQgY29uc3QgY29uZmlnID0gaG9pc3QodXNlcmxhbmQsICdjb25maWcnKTtcbi8vIENyZWF0ZSBhbmQgZXhwb3J0IHRoZSByb3V0ZSBtb2R1bGUgdGhhdCB3aWxsIGJlIGNvbnN1bWVkLlxuZXhwb3J0IGNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IFBhZ2VzQVBJUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLlBBR0VTX0FQSSxcbiAgICAgICAgcGFnZTogXCIvYXBpL3NhdmUtcHV6emxlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvc2F2ZS1wdXp6bGVcIixcbiAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBhcmVuJ3QgdXNlZCBpbiBwcm9kdWN0aW9uLlxuICAgICAgICBidW5kbGVQYXRoOiAnJyxcbiAgICAgICAgZmlsZW5hbWU6ICcnXG4gICAgfSxcbiAgICB1c2VybGFuZFxufSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhZ2VzLWFwaS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api-node)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fsave-puzzle&preferredRegion=&absolutePagePath=.%2Fpages%5Capi%5Csave-puzzle.ts&middlewareConfigBase64=e30%3D!\n");

/***/ }),

/***/ "(api-node)/./pages/api/save-puzzle.ts":
/*!**********************************!*\
  !*** ./pages/api/save-puzzle.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _lib_savePuzzle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/savePuzzle */ \"(api-node)/./lib/savePuzzle.ts\");\n\nfunction handler(req, res) {\n    if (req.method !== 'POST') return res.status(405).end();\n    const { puzzle, slug } = req.body;\n    if (!puzzle || !slug) return res.status(400).json({\n        error: \"Missing puzzle or slug\"\n    });\n    try {\n        const result = (0,_lib_savePuzzle__WEBPACK_IMPORTED_MODULE_0__.savePuzzleToDisk)(puzzle, slug);\n        res.status(200).json({\n            result\n        });\n    } catch (err) {\n        console.error(\"Save error:\", err);\n        res.status(500).json({\n            error: \"Failed to save puzzle.\"\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaS1ub2RlKS8uL3BhZ2VzL2FwaS9zYXZlLXB1enpsZS50cyIsIm1hcHBpbmdzIjoiOzs7OztBQUN3RDtBQUV6QyxTQUFTQyxRQUFRQyxHQUFtQixFQUFFQyxHQUFvQjtJQUN2RSxJQUFJRCxJQUFJRSxNQUFNLEtBQUssUUFBUSxPQUFPRCxJQUFJRSxNQUFNLENBQUMsS0FBS0MsR0FBRztJQUVyRCxNQUFNLEVBQUVDLE1BQU0sRUFBRUMsSUFBSSxFQUFFLEdBQUdOLElBQUlPLElBQUk7SUFDakMsSUFBSSxDQUFDRixVQUFVLENBQUNDLE1BQU0sT0FBT0wsSUFBSUUsTUFBTSxDQUFDLEtBQUtLLElBQUksQ0FBQztRQUFFQyxPQUFPO0lBQXlCO0lBRXBGLElBQUk7UUFDRixNQUFNQyxTQUFTWixpRUFBZ0JBLENBQUNPLFFBQVFDO1FBQ3hDTCxJQUFJRSxNQUFNLENBQUMsS0FBS0ssSUFBSSxDQUFDO1lBQUVFO1FBQU87SUFDaEMsRUFBRSxPQUFPQyxLQUFLO1FBQ1pDLFFBQVFILEtBQUssQ0FBQyxlQUFlRTtRQUM3QlYsSUFBSUUsTUFBTSxDQUFDLEtBQUtLLElBQUksQ0FBQztZQUFFQyxPQUFPO1FBQXlCO0lBQ3pEO0FBQ0YiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcaXRzYW1cXERvY3VtZW50c1xcVGltZWxpbmVzXFxzYW5kYm94XFxwYWdlc1xcYXBpXFxzYXZlLXB1enpsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE5leHRBcGlSZXF1ZXN0LCBOZXh0QXBpUmVzcG9uc2UgfSBmcm9tICduZXh0JztcclxuaW1wb3J0IHsgc2F2ZVB1enpsZVRvRGlzayB9IGZyb20gJy4uLy4uL2xpYi9zYXZlUHV6emxlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGhhbmRsZXIocmVxOiBOZXh0QXBpUmVxdWVzdCwgcmVzOiBOZXh0QXBpUmVzcG9uc2UpIHtcclxuICBpZiAocmVxLm1ldGhvZCAhPT0gJ1BPU1QnKSByZXR1cm4gcmVzLnN0YXR1cyg0MDUpLmVuZCgpO1xyXG5cclxuICBjb25zdCB7IHB1enpsZSwgc2x1ZyB9ID0gcmVxLmJvZHk7XHJcbiAgaWYgKCFwdXp6bGUgfHwgIXNsdWcpIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7IGVycm9yOiBcIk1pc3NpbmcgcHV6emxlIG9yIHNsdWdcIiB9KTtcclxuXHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IHNhdmVQdXp6bGVUb0Rpc2socHV6emxlLCBzbHVnKTtcclxuICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgcmVzdWx0IH0pO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIlNhdmUgZXJyb3I6XCIsIGVycik7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiBcIkZhaWxlZCB0byBzYXZlIHB1enpsZS5cIiB9KTtcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbInNhdmVQdXp6bGVUb0Rpc2siLCJoYW5kbGVyIiwicmVxIiwicmVzIiwibWV0aG9kIiwic3RhdHVzIiwiZW5kIiwicHV6emxlIiwic2x1ZyIsImJvZHkiLCJqc29uIiwiZXJyb3IiLCJyZXN1bHQiLCJlcnIiLCJjb25zb2xlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api-node)/./pages/api/save-puzzle.ts\n");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "next/dist/compiled/next-server/pages-api.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages-api.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/pages-api.runtime.dev.js");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(api-node)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fsave-puzzle&preferredRegion=&absolutePagePath=.%2Fpages%5Capi%5Csave-puzzle.ts&middlewareConfigBase64=e30%3D!")));
module.exports = __webpack_exports__;

})();