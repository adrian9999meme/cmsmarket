import {
  GET_GROUPS_SUCCESS,
  GET_CHATS_SUCCESS,
  GET_GROUPS_FAIL,
  GET_CHATS_FAIL,
  GET_CONTACTS_SUCCESS,
  GET_CONTACTS_FAIL,
  GET_MESSAGES_SUCCESS,
  GET_MESSAGES_FAIL,
  POST_ADD_MESSAGE_SUCCESS,
  POST_ADD_MESSAGE_FAIL,
  DELETE_MESSAGE_SUCCESS,
  DELETE_MESSAGE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  chats: [],
  groups: [],
  contacts: [],
  messages: [],
  error: {},
};

const Calendar = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CHATS_SUCCESS:
      return {
        ...state,
        chats: Array.isArray(action.payload) ? action.payload : [],
      };

    case GET_CHATS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_GROUPS_SUCCESS:
      return {
        ...state,
        groups: Array.isArray(action.payload) ? action.payload : [],
      };

    case GET_GROUPS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_CONTACTS_SUCCESS:
      return {
        ...state,
        contacts: Array.isArray(action.payload) ? action.payload : [],
      };

    case GET_CONTACTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_MESSAGES_SUCCESS:
      return {
        ...state,
        messages: Array.isArray(action.payload) ? action.payload : [],
      };

    case GET_MESSAGES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case POST_ADD_MESSAGE_SUCCESS: {
        const payload = action.payload;
        const isObj = payload && typeof payload === "object" && "message" in payload;
        const msg = isObj ? payload.message : payload;
        const targetRoomId = isObj ? payload.roomId : undefined;
        return {
          ...state,
          messages: (Array.isArray(state.messages) ? state.messages : []).map((item) => {
            const matches = targetRoomId == null || String(item.roomId) === String(targetRoomId) || String(item.id) === String(targetRoomId);
            return {
              ...item,
              userMessages: matches
                ? [...(Array.isArray(item.userMessages) ? item.userMessages : []), msg]
                : (item.userMessages || []),
            };
          }),
        };
      }

    case POST_ADD_MESSAGE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_MESSAGE_SUCCESS:
      return {
        ...state,
        messages: (Array.isArray(state.messages) ? state.messages : []).map((item) => ({
          ...item,
          userMessages: (Array.isArray(item.userMessages) ? item.userMessages : []).filter(data => data.id !== action.payload)
        }))
      };
    case DELETE_MESSAGE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default Calendar;
