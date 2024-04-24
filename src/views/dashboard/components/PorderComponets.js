import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Button,
  Checkbox,
  Pagination,
  TableFooter,
  Dialog,
  DialogTitle,
  TableContainer,
  Paper,
  styled,
} from '@mui/material';
import { IconHammer } from "@tabler/icons";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import PageviewOutlinedIcon from "@mui/icons-material/PageviewOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { tableCellClasses } from "@mui/material/TableCell";
import DashboardCard from '../../../components/shared/DashboardCard';
import swal from 'sweetalert2';
import { Edit, Delete, Save } from '@mui/icons-material';
import PorderComponets2 from './PorderComponents2';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_SELECTED_PRODUCT, REMOVE_SELECTED_PRODUCT, REMOVE_ALL_SELECTED_PRODUCTS } from '../../../redux/slices/selectedProductsReducer';
import pOrderDeleteAxios from '../../../axios/pOrderDeleteAxios';
import { open_Modal } from '../../../redux/slices/porderModalDuck';
import { seletedPOrderList } from '../../../redux/thunks/SelectedPOrderList';
import { fetchProducts } from '../../../redux/thunks/fetchProduct'; // fetchProducts 함수 임포트
import PorderModal from './modal/PorderModal';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { searchPOrderList } from '../../../redux/thunks/searchPOrderList';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import { removePOrderInfo } from '../../../redux/slices/pOrderInfoCheckboxReducer';
import pOrderItemsDeleteAxios from 'src/axios/pOrderItemsDeleteAxios';
import { useLocation } from 'react-router';
import { resetRecentPOrderNumber } from '../../../redux/slices/searchRecentPOrderNumber';
import { format } from 'date-fns';
import { reload } from '../../../redux/slices/pOrderListReducer';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { REMOVE_ALL_SELECTED_PORDER_LIST } from '../../../redux/slices/SelectedPOrderListReducer'

const PorderComponets = () => {
  const dispatch = useDispatch();
  const [selectAll, setSelectAll] = useState(false);
  const porderModalState = useSelector((state) => state.porderModal.openModal);
  const location = useLocation();
  useEffect(() => {
    if (!porderModalState) {
      dispatch(fetchProducts());
    }
    dispatch(resetRecentPOrderNumber());
  }, [porderModalState, dispatch, fetchProducts]);

  useEffect(() => {
    dispatch(resetRecentPOrderNumber());
  }, [location])

  const selectedProducts = useSelector((state) => state.selectedProduct.selectedProduct);
  const productsData = useSelector((state) => state.pOrderList.products);
  const products = JSON.parse(JSON.stringify(productsData));
  const realProducts = products?.data || [];;
  const recentPOrderNumber = useSelector((state) =>
    state.recentPOrderNumber && state.recentPOrderNumber.recentPOrderNumber
      ? state.recentPOrderNumber.recentPOrderNumber
      : []
  );
  const [porderCodeState, setPorderCodeState] = useState("");
  useEffect(() => {
    if (recentPOrderNumber.data) {
      // console.log("Setting porderCodeState with", recentPOrderNumber.data[0].porderCode); // for debugging
      setPorderCodeState(recentPOrderNumber.data[0].porderCode);
      const totalPages = Math.ceil(realProducts.length / ITEMS_PER_PAGE);
      setCurrentPage(totalPages - 1);
    }
  }, [recentPOrderNumber]);



  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#505e82",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 40,
      minWidth: 100,
    },
  }));

  const StyledTableRow = styled(TableRow)(() => ({
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));


  const handleInsert = () => {
    dispatch(open_Modal());
  };
  const underSelectedPOrder = useSelector((state) => state.pOrderInfoCheckbox.selectedCheckBox);// 밑에 selectbox값
  const selectedPOrderNumbers = useSelector((state) => state.selectedPOrderList.selectedPOrderList)


  const selectedPOrderNumber = selectedPOrderNumbers.data ? selectedPOrderNumbers.data[0]?.porderCode || [] : [];

  const handleCheckboxChange = (event, productId) => {
    if (event.target.checked) {
      if (selectedPOrderNumber) {
        dispatch(removePOrderInfo());
        dispatch(dispatch(ADD_SELECTED_PRODUCT(productId)));
      } else {
        dispatch(dispatch(ADD_SELECTED_PRODUCT(productId)));
      }
    } else {
      dispatch(REMOVE_SELECTED_PRODUCT(productId));
    }
  };

  const handleDelete = () => {
    swal
      .fire({
        title: '정말로 삭제하시겠습니까?',
        text: '삭제된 데이터는 복구할 수 없습니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085',
        confirmButtonText: '삭제',
        cancelButtonText: '취소',
      })
      .then(async (result) => {

        if (result.isConfirmed) { // 사용자가 확인 버튼을 눌렀을 때
          if (selectedProducts.length >= 0 && underSelectedPOrder.length === 0) {
            await pOrderDeleteAxios(selectedProducts);
            dispatch(REMOVE_ALL_SELECTED_PRODUCTS());
            dispatch(fetchProducts());
            dispatch(REMOVE_ALL_SELECTED_PORDER_LIST([]));
            dispatch(reload(true));
          } else if (selectedProducts.length === 0 && underSelectedPOrder.length >= 0) {
            pOrderItemsDeleteAxios(selectedPOrderNumber, underSelectedPOrder);
            dispatch(removePOrderInfo());
            dispatch(reload(true));
          }
        } else {
          swal.fire({
            title: "삭제 실패",
            text: "값을 수정해주세요",
            icon: "error",
          });
        }
      })

  };


  // const hadldEidt = () =>{
  //   swal.fire
  // }

  const [tableRowClickValue, setTableRowClickValue] = useState("");
  // 여기에 수정
  useEffect(() => {
    if (tableRowClickValue) {
      dispatch(seletedPOrderList(tableRowClickValue));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableRowClickValue]);


  const [pOrderCode, setPOrderCode] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');


  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage - 1);
  };
  function formatDate(receiveDeadline) {
    if (!receiveDeadline) {
      return '';
    }
    try {
      const { format } = require('date-fns');
      const formattedDate = format(receiveDeadline, 'yyyy-MM-dd');
      return formattedDate;
    } catch (error) {
      return;
    }

  }
  const handleClick = () => {
    const formatedStartDate = formatDate(startDate);
    const formatedEndDate = formatDate(endDate);
    let timerInterval;
    dispatch(searchPOrderList(accountNo, pOrderCode, formatedStartDate, formatedEndDate))
    swal.fire({
      title: '발주물품 조회중',
      html: '잠시만 기다려주세요',
      timer: 1000,
      timerProgressBar: true,
      didOpen: () => {
        swal.showLoading();
        const b = swal.getHtmlContainer().querySelector('b');
        timerInterval = setInterval(() => {
          b.textContent = swal.getTimerLeft();
        }, 1000);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }

    });
  };

  const [editingProduct, setEditingProduct] = useState(null);

  const handleEditStart = (product) => {
    setEditingProduct(product);
  };

  const handleFieldChange = (field, value) => {
    setEditingProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditEnd = () => {
    try {
      const pOrderCode = editingProduct.porderCode
      const pOrderModifyDto =
      {
        manager: editingProduct.manager,
        accountNo: editingProduct.accountNo,
      }
      axios.patch(`http://localhost:8888/api/porder/modify?pOrderCode=${pOrderCode}`, pOrderModifyDto)
        .then(() => {
          window.location.reload();
        })
      setEditingProduct(null);
    } catch (error) {
      swal.fire({
        title: "수정 실패",
        text: "값을 수정해주세요",
        icon: "error",
      });
    }

  };

  function formattedDate(dateString) {
    // dateString은 ISO 8601 형식의 날짜 문자열이라고 가정합니다.
    const date = new Date(dateString);
    const formattedDate = format(date, 'yyyy-MM-dd'); // 원하는 형식으로 포맷
    return formattedDate;
  }

  // 거래처모달
  const [accountList, setAccountList] = useState([]);
  const [currentAccountPage, setCurrentAccountPage] = useState(1);
  const [accountsPerPage] = useState(6);
  const indexOfLastAccount = currentAccountPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccountList = accountList.slice(indexOfFirstAccount, indexOfLastAccount);
  const [accountModal, setAccountModal] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("")
  useEffect(() => {
    axios.get('http://localhost:8888/api/account/list')
      .then(response => {
        const accountList = response.data.data;
        setAccountList(accountList);
      })
      .catch(error => {
        console.error('에러발생', error);
      });
  }, []);
  const handleAccountRowClick = (accountNo) => {
    setEditingProduct(prev => ({
      ...prev,
      accountNo,
    }));
    setAccountModal(false);

  };
  const handleAccountSearchClick = (searchData) => {

    axios.get(`http://localhost:8888/api/account/list?accountName=${searchData}`)
      .then(response => {
        const AccountSearchData = response.data.data;
        setAccountList(AccountSearchData);
      })
  }

  return (
    <Box style={{ width: '100%' }}>
      <DashboardCard variant="poster" sx={{ Width: '100%' }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2, // 하단 간격 조절
            padding: "10px",
          }}
        >
          <AssignmentIcon />
          <Typography variant="h4" component="div" sx={{ ml: 1 }} >
            발주 관리
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            padding: "10px",
            flexWrap: "nowrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" sx={{ mr: 1 }}>
              발주 코드
            </Typography>
            <TextField
              label="발주 코드를 입력해주세요"
              variant="outlined"
              size="small"
              sx={{ mr: 2 }}
              value={pOrderCode}
              onChange={(e) => setPOrderCode(e.target.value)}
            />
            <Typography variant="h6" sx={{ mr: 1 }}>
              거래처코드
            </Typography>
            <TextField
              label="거래처코드를 입력해주세요"
              variant="outlined"
              size="small"
              sx={{ mr: 2 }}
              value={accountNo}
              onChange={(e) => setAccountNo(e.target.value)}
            />
            <Typography variant="h6" sx={{ mr: 1 }}>
              발주생성일
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label={`시작일`}
                value={startDate}
                onChange={(newDate) => setStartDate(newDate)}
                views={['year', 'month', 'day']}
                format='yyyy-MM-dd'
                slotProps={{ textField: { variant: 'outlined', size: "small" } }}
                minDate={new Date('2000-01-01')}
                maxDate={new Date('2100-12-31')}
              />
              &nbsp;
              <Typography sx={{ fontSize: '1rem', marginRight: '1rem' }}>~</Typography>
              <DatePicker
                label={`마지막일`}
                value={endDate}
                onChange={(newDate) => setEndDate(newDate)}
                views={['year', 'month', 'day']}
                format='yyyy-MM-dd'
                slotProps={{ textField: { variant: 'outlined', size: "small" } }}
                minDate={startDate}
                maxDate={new Date('2100-12-31')}
              />
            </LocalizationProvider>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              variant="contained"
              color="success"
              size="large"
              startIcon={<PageviewOutlinedIcon />}
              sx={{ mr: 2 }}
              onClick={handleClick}
            >
              검색
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<AddCircleOutlineOutlinedIcon />}
              sx={{ mr: 2 }}
              onClick={handleInsert}
            >
              발주생성
            </Button>
            <Button
              variant="contained"
              color="error"
              size="large"
              startIcon={<DeleteIcon />}
              sx={{ mr: 2 }}
              onClick={() => { handleDelete() }}
              disabled={selectedProducts.length === 0 && selectedPOrderNumber.length === 0}
            >
              삭제
            </Button>
          </Box>
        </Box>

        <br />
        <Box sx={{ overflow: "auto", Maxheight: "30%", height: "calc(35vh)" }}>
          <TableContainer component={Paper}>
            <Table
              aria-label="customized table"
              sx={{
                minWidth: 700,

              }}
            >

              <TableHead sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#fff' }}>
                <StyledTableRow sx={{
                  height: '10px'
                  , '&:hover': {
                    backgroundColor: "#c7d4e8",
                        cursor: "pointer",
                  }
                }} >
                  <StyledTableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      선택
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      발주번호
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      거래처번호
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      생성일
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      상태
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Typography variant="subtitle2" fontWeight={600}>
                      담당자
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Typography variant="subtitle2" fontWeight={600}>
                      수정
                    </Typography>
                  </StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {realProducts.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE).map((realProduct, index) => (
                  <TableRow key={realProduct.porderCode} sx={{
                    backgroundColor: realProduct.porderCode === porderCodeState
                      ? 'lightyellow'
                      : (index % 2 !== 0 ? "#f3f3f3" : "white"),
                    '&:hover': {
                      backgroundColor: "#c7d4e8",
                      cursor: "pointer",
                    }
                  }}
                    onClick={() => { setTableRowClickValue(realProduct.porderCode) }}
                  >
                    <TableCell sx={{ padding: 0 }}>
                      <Checkbox
                        checked={selectedProducts.includes(realProduct.porderCode)}
                        onChange={(event) => handleCheckboxChange(event, realProduct.porderCode)}

                      />
                    </TableCell>
                    <TableCell sx={{ padding: 0 }}>
                      <Typography sx={{ fontSize: '15px', fontWeight: '500' }}>{realProduct.porderCode}</Typography>
                    </TableCell>
                    <TableCell sx={{ padding: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box>
                          {editingProduct && editingProduct.porderCode === realProduct.porderCode ? (
                            <TextField
                              value={editingProduct.accountNo}
                              onClick={() => setAccountModal(true)}
                              onChange={(e) => handleFieldChange('accountNo', e.target.value)}
                              size='small'
                            />
                          ) : (
                            <Typography variant="subtitle2" fontWeight={600}>
                              {realProduct.accountNo}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ padding: 0 }}>
                      <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                        {formattedDate(realProduct.createDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={realProduct.state}
                        sx={{
                          px: '4px',
                          color: 'white', // 텍스트 색상
                          backgroundColor: (theme) => {
                            switch (realProduct.state) {
                              case '준비':
                                return theme.palette.primary.main;
                              case '진행 중':
                                return theme.palette.warning.main;
                              case '완료':
                                return theme.palette.error.main;
                              default:
                                return 'defaultColor'; // 기본 색상
                            }
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ padding: 0 }}>
                      {editingProduct && editingProduct.porderCode === realProduct.porderCode ? (
                        <TextField
                          value={editingProduct.manager}
                          onChange={(e) => { handleFieldChange('manager', e.target.value); }}
                          size='small'
                        />
                      ) : (
                        <Typography variant="h6">{realProduct.manager}</Typography>
                      )}
                    </TableCell>

                    <TableCell align="right" sx={{ padding: 0 }}>
                      {realProduct.state === "준비" ? (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={editingProduct && editingProduct.porderCode === realProduct.porderCode ? <Save /> : <Edit />}
                          color="primary"
                          onClick={() => {
                            if (editingProduct && editingProduct.porderCode === realProduct.porderCode) {
                              handleEditEnd();
                            } else {
                              handleEditStart(realProduct);
                            }
                          }}
                        >
                          {editingProduct && editingProduct.porderCode === realProduct.porderCode ? '저장' : '수정'}
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Edit />}
                          color="error"
                          disabled
                        >
                          수정
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
            {realProducts.length ? (
              <Pagination
                count={Math.ceil(realProducts.length / ITEMS_PER_PAGE)}
                page={currentPage + 1}
                variant="outlined"
                color="primary"
                onChange={handlePageChange}
              />
            ) : (
              <div>해당 데이터가 없습니다</div>
            )}
          </Box>
      
      </DashboardCard>
      <PorderModal></PorderModal>
      <Dialog open={accountModal}>
        <DialogTitle>거래처 찾기</DialogTitle>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '16px', justifyContent: 'flex-end' }}>
          <p style={{ marginRight: '8px' }}>거래처명:</p>
          <TextField sx={{ width: '150px', marginRight: '16px' }} variant="outlined" size="small"
            value={selectedCompanyName} onChange={(e) => setSelectedCompanyName(e.target.value)} />
          <Button Icon={<SearchIcon />} onClick={() => handleAccountSearchClick(selectedCompanyName)}>거래처 조회</Button>
        </Box>

        <Table title="거래처선택" style={{ textAlign: 'center' }}>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>거래처명</StyledTableCell>
              <StyledTableCell>거래처코드</StyledTableCell>
              <StyledTableCell>대표자</StyledTableCell>
              <StyledTableCell>거래처번호</StyledTableCell>
              <StyledTableCell>사업자번호</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {currentAccountList.map((accountList, index) => (
              <StyledTableRow key={index} sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
                onClick={() => {
                  handleAccountRowClick(accountList.accountNo);
                  setAccountModal(false);
                }}
              >
                <TableCell>{accountList.accountName}</TableCell>
                <TableCell>{accountList.accountNo}</TableCell>
                <TableCell >{accountList.representative}</TableCell>
                <TableCell >{accountList.contactNumber}</TableCell>
                <TableCell >{accountList.businessNumber}</TableCell>
              </StyledTableRow>
            ))}

          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>
                <Pagination
                  count={Math.ceil(accountList.length / accountsPerPage)}
                  variant="outlined"
                  color="primary"
                  page={currentAccountPage}
                  onChange={(event, value) => setCurrentAccountPage(value)}
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Dialog>
      <PorderComponets2 />
    </Box>
  );
};

export default PorderComponets;
