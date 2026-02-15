// @flow
import { all, call, fork, takeEvery, put } from "redux-saga/effects"

import {
  CHANGE_LAYOUT,
  CHANGE_LAYOUT_WIDTH,
  CHANGE_SIDEBAR_THEME,
  CHANGE_SIDEBAR_THEME_IMAGE,
  CHANGE_SIDEBAR_TYPE,
  CHANGE_TOPBAR_THEME,
  SHOW_RIGHT_SIDEBAR,
  CHANGE_LAYOUT_MODE,
  GET_SERVER_TIME
} from "./actionTypes"

import {
  changeSidebarType as changeSidebarTypeAction,
  changeTopbarTheme as changeTopbarThemeAction,
  getServerTime,
} from "./actions"

/**
 * Changes the body attribute
 */
function changeBodyAttribute(attribute, value) {
  if (document.body) document.body.setAttribute(attribute, value)
  return true
}

const changeHtmlAttribute = (attribute, value) => {
  if (document.documentElement) document.documentElement.setAttribute(attribute, value)
  return true;
}

/**
 * Toggle the class on body
 * @param {*} cssClass
 */
function manageBodyClass(cssClass, action = "toggle") {
  switch (action) {
    case "add":
      if (document.body) document.body.classList.add(cssClass)
      break
    case "remove":
      if (document.body) document.body.classList.remove(cssClass)
      break
    default:
      if (document.body) document.body.classList.toggle(cssClass)
      break
  }

  return true
}

/**
 * Changes the layout type
 * @param {*} param0
 */
function* changeLayout({ payload: layout }) {
  try {
    if (layout === "horizontal") {
      yield put(changeTopbarThemeAction("dark"))
      document.body.removeAttribute("data-sidebar")
      document.body.removeAttribute("data-sidebar-image")
      document.body.removeAttribute("data-sidebar-size")
    } else {
      yield put(changeTopbarThemeAction("light"))
    }
    yield call(changeBodyAttribute, "data-layout", layout)
  } catch (error) {}
}

/**
 * Changes the layout mode
 * @param {*} param0
 */
 function* changeLayoutMode({ payload: mode }) {
  try {
      yield call(changeHtmlAttribute, "data-bs-theme", mode);
  } catch (error) {
      // console.log(error);
  }
}
// હા, અમે હવે નીચેની લિંક આપી છે ઉદાહરણ તરીકે ગ્રીડ ડેટા ટેબલને સૉર્ટ કરવા.
/**
 * Changes the layout width
 * @param {*} param0
 */
function* changeLayoutWidth({ payload: width }) {
  try {
    if (width === "boxed") {
      yield put(changeSidebarTypeAction("icon"))
      yield call(changeBodyAttribute, "data-layout-size", width)
      yield call(changeBodyAttribute, "data-layout-scrollable", false)
    } else if (width === "scrollable") {
      yield put(changeSidebarTypeAction("default"))
      yield call(changeBodyAttribute, "data-layout-scrollable", true)
    } else {
      yield put(changeSidebarTypeAction("default"))
      yield call(changeBodyAttribute, "data-layout-size", width)
      yield call(changeBodyAttribute, "data-layout-scrollable", false)
    }
  } catch (error) {}
}

/**
 * Changes the left sidebar theme
 * @param {*} param0
 */
function* changeLeftSidebarTheme({ payload: theme }) {
  try {
    yield call(changeBodyAttribute, "data-sidebar", theme)
  } catch (error) {}
}

/**
 * Changes the left sidebar theme Image
 * @param {*} param0
 */
 function* changeLeftSidebarThemeImage({ payload: theme }) {
  try {
    yield call(changeBodyAttribute, "data-sidebar-image", theme)
  } catch (error) {}
}

/**
 * Changes the topbar theme
 * @param {*} param0
 */
function* changeTopbarTheme({ payload: theme }) {
  try {
    yield call(changeBodyAttribute, "data-topbar", theme)
  } catch (error) {}
}

/**
 * Changes the left sidebar type
 * @param {*} param0
 */
function* changeLeftSidebarType({ payload: { sidebarType, isMobile } }) {
  try {
    switch (sidebarType) {
      case "compact":
        yield call(changeBodyAttribute, "data-sidebar-size", "small")
        yield call(manageBodyClass, "sidebar-enable", "remove")
        yield call(manageBodyClass, "vertical-collpsed", "remove")
        break
      case "icon":
        yield call(changeBodyAttribute, "data-sidebar-size", "")
        yield call(changeBodyAttribute, "data-keep-enlarged", "true")
        yield call(manageBodyClass, "vertical-collpsed", "add")
        break
      case "condensed":
        yield call(manageBodyClass, "sidebar-enable", "add")
        if (window.screen.width >= 992) {
          yield call(manageBodyClass, "vertical-collpsed", "remove")
          yield call(manageBodyClass, "sidebar-enable", "remove")
          yield call(manageBodyClass, "vertical-collpsed", "add")
          yield call(manageBodyClass, "sidebar-enable", "add")
        } else {
          yield call(manageBodyClass, "sidebar-enable", "add")
          yield call(manageBodyClass, "vertical-collpsed", "add")
        }
        break
      default:
        yield call(changeBodyAttribute, "data-sidebar-size", "")
        yield call(manageBodyClass, "sidebar-enable", "remove")
        if (!isMobile)
          yield call(manageBodyClass, "vertical-collpsed", "remove")
        break
    }
  } catch (error) {}
}

/**
 * Show the rightsidebar
 */
function* showRightSidebar() {
  try {
    yield call(manageBodyClass, "right-bar-enabled", "add")
  } catch (error) {}
}
// get server time to async
function* AsyncServerTime() {
  try {
      const record_time_start = new Date();
      var response = yield axios.get("/api/auth/getservertime")
      if (response.data?.data) {
          // Get server time as JS Date object from response
          const { year, month, day, hour, minute, second } = response.data?.data;
          // month in JS Date constructor is 0-indexed, so subtract 1
          const serverDate = new Date(year, month, day, hour, minute, second);
          // Time difference in seconds (positive if client ahead)
          const timeDiffer = Math.floor((record_time_start.getTime() - serverDate.getTime()) / 1000);

          yield put(getServerTime(GET_SERVER_TIME, Math.abs(timeDiffer) < 60 ? 0 : timeDiffer));
      }
  }
  catch (error) {
      toast.error("Async Server Time failed.");
  }
}

/**
 * Watchers
 */
export function* watchChangeLayoutType() {
  yield takeEvery(CHANGE_LAYOUT, changeLayout)
}

export function* watchChangeLayoutWidth() {
  yield takeEvery(CHANGE_LAYOUT_WIDTH, changeLayoutWidth)
}

export function* watchChangeLeftSidebarTheme() {
  yield takeEvery(CHANGE_SIDEBAR_THEME, changeLeftSidebarTheme)
}

export function* watchChangeLeftSidebarThemeImage() {
  yield takeEvery(CHANGE_SIDEBAR_THEME_IMAGE, changeLeftSidebarThemeImage)
}

export function* watchChangeLeftSidebarType() {
  yield takeEvery(CHANGE_SIDEBAR_TYPE, changeLeftSidebarType)
}

export function* watchChangeTopbarTheme() {
  yield takeEvery(CHANGE_TOPBAR_THEME, changeTopbarTheme)
}

export function* watchShowRightSidebar() {
  yield takeEvery(SHOW_RIGHT_SIDEBAR, showRightSidebar)
}

export function* watchSChangeLayoutMode() {
  yield takeEvery(CHANGE_LAYOUT_MODE, changeLayoutMode)
}

export function* fetchServerTime() {
  yield takeEvery(GET_SERVER_TIME, AsyncServerTime)
}

function* LayoutSaga() {
  yield all([
    fork(watchSChangeLayoutMode),
    fork(watchChangeLayoutType),
    fork(watchChangeLayoutWidth),
    fork(watchChangeLeftSidebarTheme),
    fork(watchChangeLeftSidebarThemeImage),
    fork(watchChangeLeftSidebarType),
    fork(watchShowRightSidebar),
    fork(watchChangeTopbarTheme),
    fork(fetchServerTime)
  ])
}

export default LayoutSaga
