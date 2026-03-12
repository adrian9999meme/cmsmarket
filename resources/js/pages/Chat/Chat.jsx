import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Col, Container, Row, } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import ChatList from "./ChatList";
import UserChat from "./UserChat";

import { getMessages as onGetMessages } from "../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

const Chat = () => {

  //meta title
  document.title = "Messages | LEKIT Ltd";

  const dispatch = useDispatch();
  const chatSelector = createSelector(
    state => state.chat,
    chat => ({
      chats: chat.chats,
      messages: chat.messages,
      loading: chat.loading
    })
  );

  const { chats, messages, loading } = useSelector(chatSelector);

  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [Chat_Box_Username, setChat_Box_Username] = useState("");
  const [Chat_Box_User_Status, setChat_Box_User_Status] = useState("online");

  useEffect(() => {
    if (currentRoomId) {
      dispatch(onGetMessages(currentRoomId));
    }
  }, [dispatch, currentRoomId]);

  // Auto-select first chat when chats load
  React.useEffect(() => {
    if (!currentRoomId && Array.isArray(chats) && chats.length > 0) {
      const first = chats[0];
      setCurrentRoomId(first.roomId ?? first.id);
      setChat_Box_Username(first.name ?? "");
      setChat_Box_User_Status(first.status ?? "online");
      dispatch(onGetMessages(first.roomId ?? first.id));
    }
  }, [chats, currentRoomId, dispatch]);

  //Use For Chat Box
  const userChatOpen = (chat) => {
    setChat_Box_Username(chat.name ?? "");
    setChat_Box_User_Status(chat.status ?? "online");
    setCurrentRoomId(chat.roomId ?? chat.id);
    dispatch(onGetMessages(chat.roomId ?? chat.id));
  };


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="Messages" breadcrumbItem="Chat" />

          <Row>
            <Col lg="12">
              <div className="d-lg-flex">
                <ChatList
                  userChatOpen={userChatOpen}
                  currentRoomId={currentRoomId} />

                <UserChat
                  Chat_Box_Username={Chat_Box_Username}
                  Chat_Box_User_Status={Chat_Box_User_Status}
                  messages={messages}
                  loading={loading}
                  currentRoomId={currentRoomId}
                />
              </div>
            </Col>
          </Row >
        </Container>
      </div>
    </React.Fragment>
  );
};

Chat.propTypes = {
  chats: PropTypes.array,
  groups: PropTypes.array,
  contacts: PropTypes.array,
  messages: PropTypes.array,
  onGetChats: PropTypes.func,
  onGetGroups: PropTypes.func,
  onGetContacts: PropTypes.func,
  onGetMessages: PropTypes.func,
  onAddMessage: PropTypes.func,
};

export default Chat;
