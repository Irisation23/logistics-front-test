import axios from "axios";
import swal from "sweetalert2";
import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Paper,
  TextField,
} from "@mui/material";

const ItemModifyModal = (props) => {
  const [itemModifyDto, setItemModifyDto] = useState({
    itemName: null,
    spec: null,
    unit: null,
    itemPrice: null,
  });

  const [errorMessage, setErrorMessage] = useState("");

  const { open, onClose, selectedItem, isSuccessCallback } = props;

  const closeModal = () => {
    setItemModifyDto({
      itemName: null,
      spec: null,
      unit: null,
      itemPrice: null,
    });
    onClose(true);
  };

  const handleModifyItem = async () => {
    if (itemModifyDto.itemName === null) {
      itemModifyDto.itemName = selectedItem[0].itemName;
    }
  
    if (itemModifyDto.spec === null) {
      itemModifyDto.spec = selectedItem[0].spec;
    }
  
    if (itemModifyDto.unit === null) {
      itemModifyDto.unit = selectedItem[0].unit;
    }
  
    if (itemModifyDto.itemPrice === null) {
      itemModifyDto.itemPrice = selectedItem[0].itemPrice;
    }
  
    let timerInterval;
  
    try {
      const response = await axios.patch(
        `http://localhost:8888/api/item/modify/${selectedItem[0].itemCode}`,
        itemModifyDto
      );
  
      onClose(true);
      await swal
        .fire({
          title: "수정 완료",
          text: "데이터가 수정되었습니다.",
          icon: "success",
          timer: 1000,
          timerProgressBar: true,
  
          didOpen: () => {
            swal.showLoading();
            const b = swal.getHtmlContainer().querySelector("b");
            timerInterval = setInterval(() => {
              b.textContent = swal.getTimerLeft();
            }, 1000);
          },
          willClose: () => {
            clearInterval(timerInterval);
          },
        });
  
      isSuccessCallback(response.data.data);
    } catch (error) {
      swal.fire({
        title: "수정 실패",
        text: `${error}`,
        icon: "error",
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        className="modal-paper"
        style={{ padding: "30px", margin: "20px" }}
      >
        <div style={{ width: "400px" }}>
          <Typography
            variant="h6"
            style={{ fontSize: "18px", marginBottom: "20px" }}
          >
            물품 수정
          </Typography>
          <TextField
            label="물품명"
            variant="outlined"
            type="text"
            value={
              itemModifyDto.itemName === null
                ? selectedItem[0]?.itemName
                : itemModifyDto.itemName
            }
            onChange={(e) =>
              setItemModifyDto({
                ...itemModifyDto,
                itemName: e.currentTarget.value,
              })
            }
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="규격"
            variant="outlined"
            type="text"
            value={
              itemModifyDto.spec === null
                ? selectedItem[0]?.spec
                : itemModifyDto.spec
            }
            onChange={(e) =>
              setItemModifyDto({
                ...itemModifyDto,
                spec: e.currentTarget.value,
              })
            }
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="단위"
            variant="outlined"
            type="text"
            value={
              itemModifyDto.unit === null
                ? selectedItem[0]?.unit
                : itemModifyDto.unit
            }
            onChange={(e) =>
              setItemModifyDto({
                ...itemModifyDto,
                unit: e.currentTarget.value,
              })
            }
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="단가"
            variant="outlined"
            type="text"
            onInput={(e) => {
              const re = /^[0-9\b]*$/; // 숫자만 허용하는 정규 표현식
              if (!re.test(e.target.value)) {
                // 숫자가 아닌 값이 입력되었을 때, 입력 값을 지웁니다.
                setErrorMessage("숫자만 입력해주세요.");
                e.target.value = "";
              } else {
                setErrorMessage("");
              }
            }}
            value={
              itemModifyDto.itemPrice === null
                ? selectedItem[0]?.itemPrice
                : itemModifyDto.itemPrice
            }
            onChange={(e) =>
              setItemModifyDto({
                ...itemModifyDto,
                itemPrice: e.currentTarget.value,
              })
            }
            fullWidth
            margin="normal"
            required
            error={!!errorMessage}
            helperText={errorMessage}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleModifyItem}
            >
              수정
            </Button>
            <Button variant="contained" color="error" onClick={closeModal}>
              취소
            </Button>
          </Box>
        </div>
      </Paper>
    </Modal>
  );
};

export default ItemModifyModal;
