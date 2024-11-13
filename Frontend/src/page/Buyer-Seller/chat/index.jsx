import React, { useState, useEffect, useRef } from "react";
import Header from "../../../component/header";
import { Avatar } from "antd";
import { Link, useParams } from "react-router-dom";
import api from "../../../config/axios";
import dayjs from "dayjs";

function Chat_Page() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const { emailReceiver } = useParams();
  const emailSender = sessionStorage.getItem("email");
  const [accountDataReceiver, setAccountDataReceiver] = useState(null);
  const [accountDataSender, setAccountDataSender] = useState(null);
  const [chatList, setChatList] = useState([]);

  const idSender = accountDataSender?.id;

  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [matchedIndexes, setMatchedIndexes] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setMatchedIndexes([]);
      setHighlightedIndex(0);
      return;
    }

    // Tìm tất cả các vị trí khớp với từ khóa
    const indexes = [];
    messages.forEach((msg, index) => {
      if (msg.contents.toLowerCase().includes(value.toLowerCase())) {
        indexes.push(index);
      }
    });

    setMatchedIndexes(indexes);
    setHighlightedIndex(0); // Reset index khi có từ khóa mới
  };

  const handleArrowNavigation = (direction) => {
    if (matchedIndexes.length === 0) return;

    if (direction === "up") {
      setHighlightedIndex((prev) =>
        prev === 0 ? matchedIndexes.length - 1 : prev - 1
      );
    } else {
      setHighlightedIndex((prev) =>
        prev === matchedIndexes.length - 1 ? 0 : prev + 1
      );
    }

    // Cuộn đến tin nhắn được highlight
    const indexToScroll = matchedIndexes[highlightedIndex];
    document
      .getElementById(`message-${indexToScroll}`)
      ?.scrollIntoView({ behavior: "smooth" });
  };
  //------------------------------------------------------

  // Hàm cuộn đến cuối tin nhắn
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Cuộn xuống cuối khi tin nhắn được tải lần đầu
  useEffect(() => {
    if (initialLoad && messages.length > 0) {
      scrollToBottom();
      setInitialLoad(false);
    }
  }, [messages, initialLoad]);

  // Fetch thông tin người nhận
  useEffect(() => {
    const fetchAccountDataReceiver = async () => {
      try {
        const response = await api.get(
          `Account/GetAccountByEmail/${encodeURIComponent(emailReceiver)}`
        );
        setAccountDataReceiver(response.data);
      } catch (error) {
        console.error("Error fetching account data:", error);
      }
    };
    if (emailReceiver) fetchAccountDataReceiver();
  }, [emailReceiver]);

  // Fetch thông tin người gửi
  useEffect(() => {
    const fetchAccountDataSender = async () => {
      try {
        const response = await api.get(
          `Account/GetAccountByEmail/${encodeURIComponent(emailSender)}`
        );
        setAccountDataSender(response.data);
      } catch (error) {
        console.error("Error fetching account data:", error);
      }
    };
    if (emailSender) fetchAccountDataSender();
  }, [emailSender]);

  const sortMessagesByDate = (messages) => {
    return messages.sort(
      (a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf()
    );
  };

  // Fetch tin nhắn từ API và sắp xếp
  const fetchMessages = async () => {
    if (!accountDataSender || !accountDataReceiver) return;

    try {
      const [senderToReceiver, receiverToSender] = await Promise.all([
        api.get(`Message/GetMessages`, {
          params: {
            senderEmail: emailSender,
            receiverEmail: emailReceiver,
          },
        }),
        api.get(`Message/GetMessages`, {
          params: {
            senderEmail: emailReceiver,
            receiverEmail: emailSender,
          },
        }),
      ]);

      const combinedMessages = [
        ...senderToReceiver.data,
        ...receiverToSender.data,
      ];

      // Sắp xếp tin nhắn theo `createdAt`
      const sortedMessages = sortMessagesByDate(combinedMessages);
      setMessages(sortedMessages);
      console.log("sortedMessages", sortedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Gọi hàm fetch tin nhắn mỗi khi có thay đổi
  useEffect(() => {
    if (
      emailSender &&
      emailReceiver &&
      accountDataSender &&
      accountDataReceiver
    ) {
      fetchMessages();
    }
  }, [emailSender, emailReceiver, accountDataSender, accountDataReceiver]);

  // Hàm gửi tin nhắn
  const handleSendMessage = async () => {
    if (message.trim() !== "") {
      const newMessage = {
        senderEmail: emailSender,
        reveiverEmail: emailReceiver,
        contents: message,
        createdAt: new Date().toISOString(),
      };

      try {
        await api.post("Message/CreateMessage", newMessage);
        setMessage(""); // Reset ô input
        fetchMessages();
        scrollToBottom(); // Cuộn xuống cuối sau khi gửi tin nhắn
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (
        emailSender &&
        emailReceiver &&
        accountDataSender &&
        accountDataReceiver
      ) {
        fetchMessages();
        handleGetListChat();
      }
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [emailSender, emailReceiver, accountDataSender, accountDataReceiver]);

  // Cuộn đến tin nhắn được highlight
  useEffect(() => {
    if (matchedIndexes.length > 0) {
      const indexToScroll = matchedIndexes[highlightedIndex];
      document
        .getElementById(`message-${indexToScroll}`)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [highlightedIndex, matchedIndexes]);

  const handleGetListChat = async () => {
    try {
      const response = await api.get(`Message/GetChatListByAccountEmail`, {
        params: { receiverEmail: emailSender },
      });

      const Ids = response.data;

      // Lấy thông tin chi tiết của từng người dùng trong danh sách
      const chatListDetails = await Promise.all(
        Ids.map(async (Id) => {
          const accountResponse = await api.get(`Account/GetAccountById/${Id}`);
          const accountData = accountResponse.data;

          // Lấy tin nhắn cuối cùng giữa người dùng hiện tại và người này
          const lastMessage = await fetchLastMessage(
            emailSender,
            accountData.email
          );

          return {
            ...accountData,
            lastMessage,
          };
        })
      );

      // Sắp xếp chatList theo thời gian của lastMessage
      const sortedChatList = chatListDetails.sort((a, b) => {
        const dateA = a.lastMessage
          ? new Date(a.lastMessage.createdAt).getTime()
          : 0;
        const dateB = b.lastMessage
          ? new Date(b.lastMessage.createdAt).getTime()
          : 0;
        return dateB - dateA; // Sắp xếp giảm dần (mới nhất trước)
      });

      setChatList(sortedChatList);
      console.log("Sorted chat list:", sortedChatList);
    } catch (error) {
      console.error("Error fetching chat list:", error);
    }
  };

  useEffect(() => {
    if (emailSender) handleGetListChat();
  }, [emailSender]);

  const fetchLastMessage = async (senderEmail, receiverEmail) => {
    try {
      const [senderToReceiver, receiverToSender] = await Promise.all([
        api.get(`Message/GetMessages`, {
          params: {
            senderEmail,
            receiverEmail,
          },
        }),
        api.get(`Message/GetMessages`, {
          params: {
            senderEmail: receiverEmail,
            receiverEmail: senderEmail,
          },
        }),
      ]);

      const combinedMessages = [
        ...senderToReceiver.data,
        ...receiverToSender.data,
      ];
      const sortedMessages = sortMessagesByDate(combinedMessages);

      // Lấy tin nhắn cuối cùng (nếu có)
      return sortedMessages.length > 0
        ? sortedMessages[sortedMessages.length - 1]
        : null;
    } catch (error) {
      console.error("Error fetching last message:", error);
      return null;
    }
  };

  const formatDateLastMessage = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);

    // Nếu cách dưới 1 phút
    if (diffInSeconds < 60) return `Now`;

    // Nếu cách dưới 1 giờ
    if (diffInMinutes < 60)
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;

    // Nếu cách dưới 24 giờ
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

    // Nếu cách dưới 7 ngày
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

    // Nếu cách dưới 4 tuần
    if (diffInWeeks < 4)
      return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;

    // Hiển thị số tuần cho bất kỳ khoảng thời gian nào trên 1 tuần
    return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
  };

  return (
    <>
      <Header />
      <div className="container mx-auto shadow-lg rounded-lg mt-[30px]">
        <div className="px-5 py-5 flex justify-between items-center bg-white border-b-2">
          <div className="flex flex-row items-center">
            <Avatar src={accountDataSender?.picture} />
            <div className="font-semibold text-2xl ml-[10px]">
              {" "}
              {accountDataSender?.name}
            </div>
          </div>

          <div className="w-1/2 relative">
            <input
              type="text"
              placeholder="Search IRL"
              className="rounded-2xl bg-gray-100 py-3 px-5 w-full"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {matchedIndexes.length > 0 && (
              <div className="absolute right-3 top-3 flex space-x-2">
                <button onClick={() => handleArrowNavigation("up")}>
                  &uarr;
                </button>
                <button onClick={() => handleArrowNavigation("down")}>
                  &darr;
                </button>
                <span>
                  {highlightedIndex + 1}/{matchedIndexes.length}
                </span>
              </div>
            )}
          </div>

          <div className="h-12 w-12 p-2  rounded-full text-white font-semibold flex items-center justify-center"></div>
        </div>

        <div className="flex flex-row justify-between bg-white">
          {/* Chat list */}
          <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto ">
            <Link to={"/chat"}>
              <div className="flex flex-row py-4 px-2 justify-center items-center hover:bg-gray-100 cursor-pointer">
                <Avatar
                  className="w-[60px] h-12"
                  src={"https://i.etsystatic.com/29488153/r/il/e0f22b/3860244894/il_fullxfull.3860244894_p9az.jpg"}
                />
                <div className="w-full ml-[20px]">
                  <div className="text-lg font-semibold">Hello</div>
                  <div className="flex justify-between">
                    <span className="text-gray-500"></span>
                    <span className="text-gray-500"></span>
                  </div>
                </div>
              </div>
            </Link>
            {chatList.map((chat) => (
              <Link to={`/chat/${chat.email}`} key={chat.id}>
                <div
                  className="flex flex-row py-4 px-2 justify-center items-center  hover:bg-gray-100 cursor-pointer"
                  key={chat.id}
                >
                  <Avatar
                    className="w-[60px] h-12"
                    src={
                      chat.picture ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                  />
                  <div className="w-full ml-[20px]">
                    <div className="text-lg font-semibold">{chat.name}</div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        {chat.lastMessage
                          ? chat.lastMessage.senderId === idSender
                            ? `You: ${chat.lastMessage.contents}`
                            : chat.lastMessage.contents
                          : "No messages yet"}
                      </span>
                      <span className="text-gray-500">
                        {chat.lastMessage
                          ? formatDateLastMessage(chat.lastMessage.createdAt)
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="w-full px-5 flex flex-col justify-between">
            <div
              className="h-[500px] overflow-y-auto
                  [&::-webkit-scrollbar]:w-2
                  [&::-webkit-scrollbar-track]:rounded-full
                  [&::-webkit-scrollbar-track]:bg-gray-100
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  [&::-webkit-scrollbar-thumb]:bg-gray-100
                  dark:[&::-webkit-scrollbar-track]:bg-neutral-100
                  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-300"
            >
              {messages.map((msg, index) => {
                const isHighlighted =
                  matchedIndexes.includes(index) &&
                  index === matchedIndexes[highlightedIndex];

                const parts = msg.contents.split(
                  new RegExp(`(${searchTerm})`, "gi")
                );

                return (
                  <div
                    key={index}
                    id={`message-${index}`}
                    className={`flex mt-[20px] ${
                      msg.senderId === idSender
                        ? "justify-end"
                        : "justify-start"
                    } mb-4`}
                  >
                    {msg.senderId !== idSender && (
                      <Avatar
                        className="w-[35px] h-8"
                        src={
                          accountDataReceiver?.picture ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                      />
                    )}
                    <div
                      className={`ml-2 py-3 px-4 ${
                        msg.senderId === idSender
                          ? "bg-blue-400 text-white"
                          : "bg-gray-200 text-black"
                      } rounded-br-3xl rounded-tl-3xl rounded-tr-xl`}
                    >
                      {parts.map((part, i) =>
                        part.toLowerCase() === searchTerm.toLowerCase() &&
                        isHighlighted ? (
                          <mark key={i}>{part}</mark>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center py-5">
              <input
                className="w-full bg-gray-300 py-3 px-3 rounded-xl mr-2"
                type="text"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white py-3 px-5 rounded-xl"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>
          <div className="w-2/5 border-l-2 px-5">
            <div className="flex flex-col">
              <div className="font-semibold text-xl py-4">
                {accountDataReceiver?.name}
              </div>

              <div className="font-semibold py-4">
                Join: {formatDate(accountDataReceiver?.createdAt)}
              </div>
              <div className="font-light">
                Address: {accountDataReceiver?.address}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat_Page;
