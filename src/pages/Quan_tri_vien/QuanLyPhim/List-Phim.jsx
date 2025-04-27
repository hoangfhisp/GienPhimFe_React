import React, { useEffect, useState } from 'react';
import AdminBoard from '../../../components/Admin-board/Admin-board';
import Table from '../../../components/Table/Table';
import CrudForm from '../../../components/Table/CrudForm';  // Import CrudForm
import Overlay from '../../../components/Table/Overlay';   // Import Overlay
import '../../../components/Admin-board/Admin-board.scss';
import { Link } from 'react-router-dom';

const PhimList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overlayVisible, setOverlayVisible] = useState(false);  // Quản lý Overlay
  const [currentMovie, setCurrentMovie] = useState(null);      // Lưu phim hiện tại khi click

  const [theLoaiList, setTheLoaiList] = useState([]);
  const [quocGiaList, setQuocGiaList] = useState([]);
  const [ngonNguList, setNgonNguList] = useState([]);

  const [selectedTheLoai, setSelectedTheLoai] = useState('');
  const [selectedQuocGia, setSelectedQuocGia] = useState('');
  const [selectedNgonNgu, setSelectedNgonNgu] = useState('');
  const [tenPhim, setTenPhim] = useState('');
  const [apiLink, setApiLink] = useState('');

  // Load tất cả dữ liệu
  const fetchData = () => {
    setLoading(true);
    fetch('/api/phimapi')
      .then(res => res.json())
      .then(data => {
        setMovies(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi tải phim:", err);
        setLoading(false);
      });
  };

  // Lọc phim theo tiêu chí
  const handleLocPhim = e => {
    e.preventDefault();
    const query = `?theLoai=${selectedTheLoai}&quocGia=${selectedQuocGia}&ngonNgu=${selectedNgonNgu}`;
    fetch(`/api/phimapi/loc${query}`)
      .then(res => res.json())
      .then(setMovies);
  };

  // Tìm kiếm theo tên phim
  const handleTimKiem = e => {
    e.preventDefault();
    fetch(`/api/phimapi/timkiem?tenPhim=${tenPhim}`)
      .then(res => res.json())
      .then(setMovies);
  };

  // Thêm phim thông qua API
  const handleInputAPI = e => {
    e.preventDefault();
    fetch('/api/phimapi/inputapi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: apiLink })
    }).then(() => {
      return fetch('/api/phimapi').then(res => res.json()).then(setMovies);
    });
  };

  // Cập nhật dữ liệu tự động mỗi 30s
  useEffect(() => {
    fetchData();
    const refreshInterval = setInterval(() => {
      fetchData();
    }, 30000);
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  const columns = [
    { header: "Tên phim", accessor: "TenP" },
    { header: "Thời lượng", accessor: "ThuoiLuongP" },
    {
      header: "Avatar",
      render: row => <img src={row.AvatarP} width={100} alt="avatar" />
    },
    {
      header: "Poster",
      render: row => <img src={row.AvatarPoster} width={100} alt="poster" />
    },
    {
      header: "Tạo lúc",
      render: row => new Date(row.ThoiGianTao).toLocaleString()
    },
    {
      header: "Cập nhật",
      render: row => new Date(row.ThoiGianCapNhat).toLocaleString()
    },
    {
      header: "Thao tác",
      render: row => (
        <>
          <button onClick={() => handleOverlayOpen(row, 'view')}>Xem chi tiết</button> |{' '}
          <button onClick={() => handleOverlayOpen(row, 'edit')}>Chỉnh sửa</button> |{' '}
          <button onClick={() => handleOverlayOpen(row, 'delete')}>Xóa</button>
        </>
      )
    }
  ];

  // Hiển thị Overlay khi click vào phim
  const handleOverlayOpen = (movie, action) => {
    setCurrentMovie({ ...movie, action });
    setOverlayVisible(true);
  };

  // Hiển thị Overlay để thêm phim mới
  const handleAddNewMovie = () => {
    setCurrentMovie(null); // Không truyền phim hiện tại
    setOverlayVisible(true);
  };

  // Đóng Overlay
  const handleOverlayClose = () => {
    setOverlayVisible(false);
    setCurrentMovie(null);
  };

  return (
    <div className="wrapper d-flex">
      <AdminBoard username="Admin" />
      <div id="content" className="content p-4 p-md-5 pt-5">
        <h1>Danh sách phim</h1>
        <hr />

        {/* Các link điều hướng */}
        <div className="mb-4">
          <button onClick={handleAddNewMovie} className="title me-3">
            Thêm phim mới
          </button>
          <Link to="/quanly/daodien" className="title me-3">Quản lý đạo diễn phim</Link>
          <Link to="/quanly/dienvien" className="title me-3">Quản lý diễn viên phim</Link>
          <Link to="/quanly/theloai" className="title">Quản lý thể loại phim</Link>
        </div>

        {/* Bộ lọc & Tìm kiếm */}
        <div className="d-flex flex-wrap justify-content-between align-items-center filter-container mb-4">
          <form className="d-flex timkiemA mb-2" onSubmit={handleInputAPI}>
            <input
              className="form-control searchbar me-2"
              name="query"
              type="search"
              placeholder="Nhập link API phim..."
              value={apiLink}
              onChange={e => setApiLink(e.target.value)}
            />
            <button className="title" type="submit">Thêm</button>
          </form>

          <form className="d-flex locPhim mb-2" onSubmit={handleLocPhim}>
            <select className="form-control searchbar me-2" name="theLoai" value={selectedTheLoai} onChange={e => setSelectedTheLoai(e.target.value)}>
              <option value="">Chọn thể loại</option>
              {theLoaiList.map(item => (
                <option key={item.value} value={item.value}>{item.text}</option>
              ))}
            </select>

            <select className="form-control searchbar me-2" name="quocGia" value={selectedQuocGia} onChange={e => setSelectedQuocGia(e.target.value)}>
              <option value="">Chọn quốc gia</option>
              {quocGiaList.map(item => (
                <option key={item.value} value={item.value}>{item.text}</option>
              ))}
            </select>

            <select className="form-control searchbar me-2" name="ngonNgu" value={selectedNgonNgu} onChange={e => setSelectedNgonNgu(e.target.value)}>
              <option value="">Chọn ngôn ngữ</option>
              {ngonNguList.map(item => (
                <option key={item.value} value={item.value}>{item.text}</option>
              ))}
            </select>

            <button className="title" type="submit">Lọc</button>
          </form>

          <form className="d-flex timkiemB mb-2" onSubmit={handleTimKiem}>
            <input
              className="form-control searchbar me-2"
              name="tenPhim"
              type="search"
              placeholder="Nhập tên phim..."
              value={tenPhim}
              onChange={e => setTenPhim(e.target.value)}
            />
            <button className="title" type="submit">Tìm</button>
          </form>
        </div>

        {/* Hiển thị bảng */}
        <Table columns={columns} data={movies} loading={loading} />

        {/* Hiển thị spinner nếu đang tải dữ liệu */}
        {loading && (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        )}

        {/* Nút làm mới bảng */}
        <button className="btn btn-primary" onClick={fetchData}>Làm mới bảng</button>
      </div>

      {/* Hiển thị Overlay nếu trạng thái overlayVisible là true */}
      {overlayVisible && (
        <Overlay onClose={handleOverlayClose}>
          <CrudForm 
            movie={currentMovie} 
            columns={columns}  // Truyền columns từ Table
            onClose={handleOverlayClose} 
            formMode={currentMovie ? currentMovie.action : 'create'} 
          />
        </Overlay>
      )}
    </div>
  );
};

export default PhimList;
