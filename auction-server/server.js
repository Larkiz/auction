import moment from "moment/moment.js";
import { initServer } from "./initServer.js";

import { v4 as uuid } from "uuid";
import { stopAuction } from "./function/stopAuction.js";

const roomsDataDump = {};
let roomsDump = [];

let timers = {};

let usersDump = {};

initServer((socket, io) => {
  socket.on("create-room", (req) => {
    const { name, userId, rows } = req;
    console.log(name === null || !rows.length);

    if (name === null || !rows.length) {
      console.log(123);

      return socket.emit("room-created", {
        message: "Не указано имя комнаты или поля",
      });
    }

    if (!!userId && !!name) {
      const id = uuid();
      const timeStamp = moment().format("D.M.YYYY H:mm");

      // иницилизация комнаты
      const newRoom = {
        id: id,
        active: false,
        ownerId: userId,
        name: name,
        rows: rows,
        members: [],
        turnIndex: 0,
        turnId: null,
        end: false,
        turnTime: 30,
        auctionTime: 30 * 60,
        timeStamp,
      };

      roomsDataDump[id] = newRoom;
      roomsDump.push({
        id: id,
        name: name,
        timeStamp,
        ownerName: usersDump[userId].name,
      });

      usersDump[userId].lots.push(newRoom);

      socket.emit("room-created", newRoom);
      return io.emit("rooms", roomsDump);
    }
  });
  // все комнаты
  socket.on("rooms", (req) => {
    return socket.emit("rooms", roomsDump);
  });

  // просмотр комнаты
  socket.on("room-check", (req) => {
    const { id } = req;

    if (!!id) {
      socket.join(id);

      return socket.emit("room-check", roomsDataDump[id]);
    }
  });

  // выход из комнаты
  socket.on("room-leave", (req) => {
    const { id } = req;

    if (!!id) {
      return socket.leave(id);
    }
  });

  // Изменения в комнате
  socket.on("room-change", (req) => {
    const { id, userId, rows } = req;

    if (!!id & !!userId & !!rows) {
      for (let index = 0; index < roomsDataDump[id].members.length; index++) {
        let member = roomsDataDump[id].members[index];
        if (member.userId === userId) {
          roomsDataDump[id].members[index].rows = rows;
        }
      }

      io.to(id).emit("room-change", roomsDataDump[id]);
    }
  });
  // конец аукциона
  socket.on("stop-auction", (req) => {
    const { id } = req;

    if (!!id) {
      roomsDataDump[id] = stopAuction(roomsDataDump[id], timers[id]);

      io.to(id).emit("room-change", roomsDataDump[id]);
    }
  });

  // Присоединение к аукциону
  socket.on("join-auction", (req) => {
    const { id, userId } = req;

    if (!!id) {
      socket.join(id);
      let userRows = [];
      for (let index = 0; index < roomsDataDump[id].rows.length; index++) {
        userRows.push({ rowId: index, value: "" });
      }

      roomsDataDump[id].members = [
        ...roomsDataDump[id].members,
        { userId: userId, name: usersDump[userId].name, rows: userRows },
      ];
      io.to(id).emit("room-change", roomsDataDump[id]);
    }
  });

  // авторизация
  socket.on("userAuth", (req) => {
    let { name, id } = req;
    // Проверка на существование юзера с помощью id(береься из sessionStorage с клиента) и если его нет то добавить в дамп
    if (!usersDump.hasOwnProperty(id) && name) {
      id = uuid();
      usersDump[id] = { id, name: name, lots: [] };
    }

    const user = usersDump.hasOwnProperty(id) ? usersDump[id] : null;

    return socket.emit("userAuth", user);
  });

  // старт аукциона
  socket.on("start-auction", (req) => {
    const { id } = req;

    if (roomsDataDump[id].members.length < 2) {
      return socket.emit("auction-started", {
        status: false,
        message: "Минимум 2 пользователя",
      });
    }
    if (id && !roomsDataDump[id].active) {
      roomsDataDump[id].active = true;
      roomsDataDump[id].turnIndex = 0;

      // интервал аукциона и отправка таймеров на клиент
      timers[id] = setInterval(function () {
        roomsDataDump[id].auctionTime = roomsDataDump[id].auctionTime - 1;

        roomsDataDump[id].turnId =
          roomsDataDump[id].members[roomsDataDump[id].turnIndex].userId;

        io.to(id).emit("room-change", roomsDataDump[id]);

        if (roomsDataDump[id].turnTime === 0) {
          // проверка последнего пользователя в списке
          if (
            roomsDataDump[id].members.length - 1 ===
            roomsDataDump[id].turnIndex
          ) {
            roomsDataDump[id].turnIndex = 0;
          } else {
            roomsDataDump[id].turnIndex = roomsDataDump[id].turnIndex + 1;
          }
          roomsDataDump[id].turnTime = 31;
        }
        roomsDataDump[id].turnTime -= 1;
        // Остановка по истечению времени
        if (roomsDataDump[id].auctionTime === 0) {
          roomsDataDump[id] = stopAuction(roomsDataDump[id], timers[id]);
          io.to(id).emit("room-change", roomsDataDump[id]);
        }
      }, 1000);

      return socket.emit("auction-started", {
        status: true,
        message: "Аукцион начат",
      });
    }
  });
});
