import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { socket } from "../../connection/socket";
import { useDispatch, useSelector } from "react-redux";
import { createLot } from "../../redux/clientStore";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const baseLotData = { name: null, userId: null, rows: [] };

const icoBtnProps = {
  variant: "contained",
  sx: {
    minWidth: "45px",
    height: "35px",
    padding: "1px",
  },
};

export const NewLotModal = () => {
  const [open, setOpen] = useState(false);

  const [lotData, setLot] = useState(baseLotData);
  const [newRow, setNewRow] = useState("");

  const userId = useSelector((state) => state.client.data.id);

  function onChangeRow(e) {
    setNewRow(e.target.value);
  }

  function addNewRow() {
    if (newRow !== "") {
      onChange({
        rows: [...lotData.rows, { id: lotData.rows.length + 1, name: newRow }],
      });
    }
  }
  function deleteRow(id) {
    onChange({
      rows: lotData.rows.filter((row) => row.id !== id),
    });
  }
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setLot(baseLotData);
    setOpen(false);
  };

  function onChange(data) {
    setLot({ ...lotData, ...data });
  }

  function createLotHandle() {
    socket.emit("create-room", { ...lotData, userId: userId });
  }

  useEffect(() => {
    function lotCreatedHandle(res) {
      if (res.message) {
        console.log(res);
      } else {
        dispatch(createLot(res));
        handleClose();
      }
    }
    socket.on("room-created", lotCreatedHandle);

    return () => {
      socket.off("room-created", lotCreatedHandle);
    };
  }, []);

  return (
    <>
      <Button onClick={handleClickOpen} variant="contained">
        Создать лот
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          <TextField
            onChange={(e) => {
              onChange({ name: e.target.value });
            }}
            label="Название лота"
          />
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            <Typography>Параметры</Typography>
            {lotData.rows.map((row) => {
              return (
                <Stack
                  key={row.id}
                  spacing={2}
                  alignItems={"center"}
                  direction={"row"}
                >
                  <Paper sx={{ p: 2, width: 300 }} elevation={2}>
                    <Typography variant="body2">{row.name}</Typography>
                  </Paper>
                  <Button onClick={() => deleteRow(row.id)} {...icoBtnProps}>
                    <DeleteIcon />
                  </Button>
                </Stack>
              );
            })}
            <Stack
              sx={{ paddingTop: 1 }}
              alignItems={"center"}
              spacing={2}
              direction={"row"}
            >
              <TextField multiline onChange={onChangeRow} label="Параметр" />
              <Button onClick={addNewRow} {...icoBtnProps}>
                <AddIcon />
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "flex-start" }}>
          <Button
            variant="contained"
            color={"success"}
            onClick={createLotHandle}
          >
            Создать
          </Button>
          <Button
            variant="contained"
            color={"error"}
            onClick={handleClose}
            autoFocus
          >
            Отменить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
