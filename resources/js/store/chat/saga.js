import { takeEvery, put, call } from "redux-saga/effects";

// Chat Redux States
import {
  DELETE_MESSAGE,
  GET_CHATS,
  GET_CONTACTS,
  GET_GROUPS,
  GET_MESSAGES,
  POST_ADD_MESSAGE,
} from "./actionTypes";
import {
  getChatsSuccess,
  getChatsFail,
  getGroupsSuccess,
  getGroupsFail,
  getContactsSuccess,
  getContactsFail,
  getMessagesSuccess,
  getMessagesFail,
  addMessageSuccess,
  addMessageFail,
  deleteMessageSuccess,
  deleteMessageFail,
} from "./actions";

import api from "../api";
import { logisticsEndpoints } from "../../services/api";
import { groups, contacts, messages } from "../../common/data/chat";

function* onGetChats() {
  try {
    const res = yield call(api.get, logisticsEndpoints.chatRooms());
    const body = res?.data ?? {};
    const data = body?.data ?? body;
    const list = Array.isArray(data) ? data : (data?.data ?? []);
    const chats = list.map((r) => ({
      id: r.id ?? r.roomId,
      roomId: r.roomId ?? r.id ?? r.chat_room_id,
      name: r.name ?? r.user_name ?? "Unknown",
      status: r.status ?? "online",
      image: r.image,
      description: r.description ?? "",
      time: r.time ?? "",
    }));
    yield put(getChatsSuccess(chats));
  } catch (error) {
    yield put(getChatsSuccess([]));
  }
}

function* onGetGroups() {
  yield put(getGroupsSuccess(groups));
}

function* onGetContacts() {
  yield put(getContactsSuccess(contacts));
}

function* onGetMessages({ roomId }) {
  try {
    const res = yield call(api.get, logisticsEndpoints.chatMessages(), {
      params: { chat_room_id: roomId },
    });
    const msgData = res?.data?.data?.messages ?? res?.data?.messages ?? res?.data ?? {};
    const list = msgData?.data ?? (Array.isArray(msgData) ? msgData : []);
    const items = Array.isArray(list) ? list : [];
    const userMessages = items.map((m) => {
      const timeStr = m.created_at
        ? (typeof m.created_at === "string"
          ? (m.created_at.includes("T") ? m.created_at.slice(11, 16) : m.created_at)
          : "")
        : "";
      return {
        id: m.id,
        to_id: m.is_mine === true ? 2 : 1,
        msg: m.message ?? "",
        time: timeStr,
        isImages: m.is_image ?? false,
      };
    });
    const transformed = [
      {
        id: roomId,
        roomId,
        sender: items[0]?.sender_name ?? "User",
        userMessages,
      },
    ];
    yield put(getMessagesSuccess(transformed));
  } catch (error) {
    const filtered = messages.filter((msg) => Number(msg.roomId) === Number(roomId));
    yield put(getMessagesSuccess(filtered.length ? filtered : [{ roomId, sender: "", userMessages: [] }]));
  }
}

function* onAddMessage({ message }) {
  try {
    const res = yield call(api.post, logisticsEndpoints.chatSendMessage(), {
      msg: message?.msg ?? message?.message ?? "",
      chat_room_id: message?.chat_room_id ?? message?.roomId,
      receiver_id: message?.receiver_id,
    });
    const data = res?.data?.data ?? res?.data ?? res;
    const roomId = message?.chat_room_id ?? message?.roomId;
    const msgPayload = {
      id: data?.id ?? Date.now(),
      to_id: 2,
      msg: data?.msg ?? message?.msg ?? message?.message ?? "",
      time: data?.time ?? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isImages: false,
    };
    yield put(addMessageSuccess(msgPayload, roomId));
  } catch (error) {
    const roomId = message?.chat_room_id ?? message?.roomId;
    const demoPayload = {
      id: Date.now(),
      to_id: 2,
      msg: message?.msg ?? message?.message ?? "",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isImages: false,
    };
    yield put(addMessageSuccess(demoPayload, roomId));
  }
}

function* OnDeleteMessage({ payload: data }) {
  yield put(deleteMessageSuccess(data));
}

function* chatSaga() {
  yield takeEvery(GET_CHATS, onGetChats);
  yield takeEvery(GET_GROUPS, onGetGroups);
  yield takeEvery(GET_CONTACTS, onGetContacts);
  yield takeEvery(GET_MESSAGES, onGetMessages);
  yield takeEvery(POST_ADD_MESSAGE, onAddMessage);
  yield takeEvery(DELETE_MESSAGE, OnDeleteMessage);
}




export default chatSaga;
