import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { socket } from "../../connection/socket";
import { useDispatch, useSelector } from "react-redux";
import { UserActions } from "./UserActions";
import { UserCell } from "./UserCell";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { alreadyMember } from "./functions/alreadyMember";
import { AuctionTitle } from "./AuctionTitle";
import { OwnerActions } from "./OwnerActions";
import { lotModalClose } from "../../redux/clientStore";

const tableCellSx = { height: 90, width: 300, textAlign: "center" };
const headCellSx = { textAlign: "center" };

export const Lot = () => {
  const [lotData, setLotData] = useState({ active: false });
  const [myRows, setMyRows] = useState([]);

  const client = useSelector((state) => state.client.data);

  function joinAuction() {
    socket.emit("join-auction", { id: lotData.id, userId: client.id });
  }

  function onRowChange(rowIndex, value) {
    setMyRows(
      myRows.map((row) => {
        if (row.rowId === rowIndex) {
          row.value = value;
        }
        return row;
      })
    );
  }

  function submitChange() {
    socket.emit("room-change", {
      id: lotData.id,
      userId: client.id,
      rows: myRows,
    });
  }

  function auctionStarted(res) {
    console.log(res);
  }

  function startAuction() {
    socket.emit("start-auction", {
      id: lotData.id,
    });
  }
  function stopAuction() {
    socket.emit("stop-auction", {
      id: lotData.id,
    });
  }
  function lotChangeHandle(res) {
    setLotData(res);
  }

  const modalOpened = useSelector((state) => state.client.modals.lot);

  const dispatch = useDispatch();
  function lotClose(id) {
    dispatch(lotModalClose(id));
  }

  useEffect(() => {
    socket.on("room-check", lotChangeHandle);
    socket.on("room-change", lotChangeHandle);

    socket.on("auction-started", auctionStarted);

    return () => {
      socket.off("auction-started", auctionStarted);
      socket.off("room-check", lotChangeHandle);
      socket.off("room-change", lotChangeHandle);
    };
  }, [modalOpened]);

  const currentTurn = useRef(null);

  // проверка на смену хода пользователя
  useEffect(() => {
    if (
      lotData?.members &&
      currentTurn.current !== lotData.turnId &&
      alreadyMember(lotData.members, client.id)
    ) {
      setMyRows(lotData?.members?.find((mem) => mem.userId === client.id).rows);

      currentTurn.current = lotData.turnId;
    }
  }, [lotData]);

  return (
    <Dialog
      open={modalOpened}
      onClose={() => lotClose(lotData.id)}
      aria-labelledby="lot-dialog-title"
      aria-describedby="lot-dialog-description"
      fullScreen
    >
      <AuctionTitle name={lotData?.name} time={lotData?.auctionTime} />

      <DialogContent>
        <TableContainer sx={{ maxWidth: "100%" }}>
          <Table sx={{ minWidth: 1200, minHeight: 100 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 300 }} key={"blank"}></TableCell>

                {lotData.active &&
                  lotData.members.map((member) => {
                    return (
                      <TableCell key={member.userId}>
                        {lotData.turnTime !== null &&
                          member.userId === lotData.turnId && (
                            <Stack
                              alignItems={"center"}
                              gap={2}
                              justifyContent={"center"}
                              sx={{
                                backgroundColor: "#ff8080",
                                p: 2,
                              }}
                              direction={"row"}
                            >
                              {lotData.turnTime}
                              <AccessTimeIcon />
                            </Stack>
                          )}
                      </TableCell>
                    );
                  })}
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: 300 }} key={"params"}>
                  Параметры и требования
                </TableCell>

                {lotData.members &&
                  lotData.members.map((member) => {
                    return (
                      <TableCell sx={headCellSx} key={member.userId}>
                        <Stack>
                          <Typography>{member.name}</Typography>
                        </Stack>
                      </TableCell>
                    );
                  })}
              </TableRow>
            </TableHead>
            <TableBody>
              {lotData.rows &&
                lotData.rows.map((row, rowIndex) => {
                  return (
                    <TableRow key={rowIndex}>
                      <TableCell>{row.name}</TableCell>
                      {lotData.members.map((member, colIndex) => {
                        const isInput =
                          member.userId === client.id &&
                          lotData.turnId === client.id;

                        return (
                          <UserCell
                            key={colIndex}
                            isInput={isInput}
                            sx={tableCellSx}
                            inputValue={myRows.length && myRows[rowIndex].value}
                            value={member.rows[rowIndex].value}
                            onChange={(value) => {
                              onRowChange(rowIndex, value);
                            }}
                          />
                        );
                      })}
                    </TableRow>
                  );
                })}
              <TableRow key={"actions"}>
                <TableCell></TableCell>
                {lotData?.members &&
                  lotData.members.map((member, colIndex) => (
                    <TableCell key={colIndex}>
                      {member.userId === client.id &&
                        lotData.turnId === client.id && (
                          <UserActions submitChange={submitChange} />
                        )}
                    </TableCell>
                  ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        {lotData?.members &&
          lotData.ownerId !== client.id &&
          !lotData.end &&
          !alreadyMember(lotData.members, client.id) && (
            <Button variant="contained" onClick={joinAuction}>
              Присоединиться
            </Button>
          )}
        {!lotData.end && lotData?.ownerId && lotData.ownerId === client.id && (
          <OwnerActions
            active={lotData.active}
            startAuction={startAuction}
            stopAuction={stopAuction}
          />
        )}

        <Button variant="outlined" onClick={() => lotClose(lotData.id)}>
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
};
