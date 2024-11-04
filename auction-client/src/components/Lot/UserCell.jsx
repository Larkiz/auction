import { TableCell, TextField } from "@mui/material";

export const UserCell = ({ onChange, sx, inputValue, value, isInput }) => {
  return (
    <TableCell sx={sx}>
      {isInput ? (
        <TextField
          onChange={(e) => {
            onChange(e.target.value);
          }}
          value={inputValue}
        />
      ) : (
        value
      )}
    </TableCell>
  );
};
