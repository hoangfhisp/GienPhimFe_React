import { useEffect, useState } from "react";
import Table from "../../../components/Table/Table";
import * as movieServices from "../../../services/Admin/MovieService";
import Card from '../../../components/Table/Card';

export default function ListTapPhim({ page, limit, data, pagination, onPageChange }) {
    const [listTapPhimResult, setListTapPhimResult] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentEpisode, setCurrentEpisode] = useState(null);
    const [cardAction, setCardAction] = useState(null);
    const [formFields, setFormFields] = useState([]);
    const [viewFull, setViewFull] = useState(false);

    // Chuẩn hóa dữ liệu tập phim để hiển thị form (nếu cần)
    const normalizeEpisodeForForm = (episode) => {
        return {
            ...episode,
            phimId: episode.phimId?.toString() || "",
        };
    };

    // Chuyển data từ form về định dạng backend (JSON)
    const mapToBackendFormat = (data) => {
        if (data instanceof FormData) return data;

        return {
            TapPhimId: data.tapPhimId || null,
            PhimId: data.phimId || "",
            TenTap: data.tenTap || "",
            SlugTap: data.slugTap || "",
            TenFile: data.tenFile || "",
            LinkChinh: data.linkChinh || "",
            LinkPhu: data.linkPhu || "",
            ThoiGianTao: data.thoiGianTao || "",
            ThoiGianCapNhat: data.thoiGianCapNhat || ""
        };
    };

    // Chuyển dữ liệu sang FormData nếu cần (nếu có file upload)
    const mapToFormData = (data) => {
        const formData = new FormData();

        formData.append("TapPhimId", data.tapPhimId || "");
        formData.append("PhimId", data.phimId || "");
        formData.append("TenTap", data.tenTap || "");
        formData.append("SlugTap", data.slugTap || "");
        formData.append("TenFile", data.tenFile || "");
        formData.append("LinkChinh", data.linkChinh || "");
        formData.append("LinkPhu", data.linkPhu || "");
        formData.append("ThoiGianTao", data.thoiGianTao || "");
        formData.append("ThoiGianCapNhat", data.thoiGianCapNhat || "");

        return formData;
    };

    // Gọi API lấy danh sách tập phim
    const fetchApi = async (currentPage = page, currentLimit = limit) => {
        setLoading(true);
        try {
            const result = await movieServices.fetchEpisodes(currentPage, currentLimit);
            setListTapPhimResult(result.data);
            onPageChange(result.pagination);
        } catch (error) {
            console.error("Lỗi khi tải tập phim:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (data && data.length > 0) {
            setListTapPhimResult(data);
        } else {
            fetchApi();
        }
    }, [data, limit, page]);

    // Lấy metadata form tập phim
    useEffect(() => {
        const fetchFormFields = async () => {
            try {
                const fields = await movieServices.getTapPhimFormFields();
                setFormFields(fields);
            } catch (error) {
                console.error("Lỗi khi tải trường form:", error);
            }
        };
        fetchFormFields();
    }, []);

    const handleAction = (action, episodeOrMovie) => {
        if (action === 'view') {
            setViewFull(true);
        }

        let normalizedData;

        if (episodeOrMovie.tapPhims && episodeOrMovie.tapPhims.length > 0) {
            // Nếu là dữ liệu phim, lấy tập đầu tiên
            const firstEpisode = episodeOrMovie.tapPhims[0];
            normalizedData = normalizeEpisodeForForm({
                ...firstEpisode,
                phimId: episodeOrMovie.phimId,
                tenP: episodeOrMovie.tenP
            });
        } else {
            // Nếu là dữ liệu 1 tập phim độc lập
            normalizedData = normalizeEpisodeForForm(episodeOrMovie);
        }

        setCurrentEpisode(normalizedData);
        setCardAction(action);
    };

    const handleCloseCard = () => {
        setViewFull(false);
        setCardAction(null);
        setCurrentEpisode(null);
    };

    const handleSave = async (episodeData) => {
        try {
            setLoading(true);

            const formData = new FormData();

            if (cardAction === 'create') {
                formData.append("PhimId", episodeData.phimId || "");
                formData.append("TenTap", episodeData.tenTap || "");
                formData.append("SlugTap", episodeData.slugTap || "");
                formData.append("TenFile", episodeData.tenFile || "");
                formData.append("LinkPhu", episodeData.linkPhu || "");

                if (episodeData.linkChinh instanceof File) {
                    formData.append("LinkChinh", episodeData.linkChinh);
                }

                await movieServices.createEpisode(formData);
            } else {
                // Update - sử dụng ID thật của tập phim
                const realTapPhimId = currentEpisode?.tapPhimId || currentEpisode?.id;

                if (!realTapPhimId) {
                    throw new Error("Không tìm thấy ID tập phim để cập nhật");
                }

                formData.append("tapPhimId", realTapPhimId);
                formData.append("PhimId", episodeData.phimId || "");
                formData.append("TenTap", episodeData.tenTap || "");
                formData.append("SlugTap", episodeData.slugTap || "");
                formData.append("TenFile", episodeData.tenFile || "");
                formData.append("LinkPhu", episodeData.linkPhu || "");

                if (episodeData.linkChinh instanceof File) {
                    formData.append("LinkChinh", episodeData.linkChinh);
                }

                await movieServices.updateEpisode(formData);
            }

            fetchApi(pagination.currentPage);
            handleCloseCard();
        } catch (error) {
            console.error("Lỗi khi lưu tập phim:", error.response?.data || error.message);
            alert(`Lỗi: ${error.response?.data?.Msg || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (episode) => {
        if (!window.confirm(`Bạn chắc chắn muốn xóa tập phim "${episode.tenTap}"?`)) return;

        try {
            setLoading(true);
            const tapPhimId = episode.tapPhimId || episode.id;
            await movieServices.deleteEpisode(tapPhimId);
            handleCloseCard();
            await fetchApi(pagination.currentPage);
        } catch (error) {
            console.error("Lỗi khi xóa tập phim:", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            header: "Tên phim",
            accessor: "tenP",
            render: row => <div className="ten-phim-cell">{row.tenP}</div>
        },
        {
            header: "Thời lượng",
            accessor: "thoiLuongP",
            render: row => row.thoiLuongP
        },
        {
            header: "Avatar",
            accessor: "avatarP",
            render: row => <img src={row.avatarP} width={100} alt="avatar" />
        },
        {
            header: "Poster",
            accessor: "avatarPoster",
            render: row => <img src={row.avatarPoster} width={100} alt="poster" />
        },
        {
            header: "Tên tập đầu tiên",
            accessor: "tapPhims[0].tenTap",
            render: row =>
                row.tapPhims && row.tapPhims.length > 0
                    ? row.tapPhims[0].tenTap
                    : "Không có tập"
        },
        {
            header: "Slug tập đầu tiên",
            accessor: "tapPhims[0].slugTap",
            render: row =>
                row.tapPhims && row.tapPhims.length > 0
                    ? row.tapPhims[0].slugTap
                    : "-"
        },
        {
            header: "Link chính video",
            accessor: "tapPhims[0].linkChinh",
            render: row =>
                row.tapPhims && row.tapPhims.length > 0 && row.tapPhims[0].linkChinh.endsWith('.mp4') ? (
                    <video width={200} height={120} controls>
                        <source src={row.tapPhims[0].linkChinh} type="video/mp4" />
                        Trình duyệt của bạn không hỗ trợ thẻ video.
                    </video>
                ) : (
                    "Không có video"
                )
        }
        ,
        {
            header: "Link phụ",
            accessor: "tapPhims[0].linkPhu",
            render: row =>
                row.tapPhims && row.tapPhims.length > 0 ? row.tapPhims[0].linkPhu : "-"
        }
    ];

    return (
        <>
            <div className="mb-4">
                <button
                    onClick={() => handleAction('create', {})}
                    className="btn btn-primary"
                >
                    <i className="fas fa-plus me-2"></i>Thêm tập phim mới
                </button>
            </div>
            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="card-title mb-0">Danh sách tập phim</h5>
                        <button
                            onClick={fetchApi}
                            className="btn btn-sm btn-outline-primary"
                            disabled={loading}
                        >
                            <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''} me-2`}></i>
                            {loading ? 'Đang tải...' : 'Làm mới'}
                        </button>
                    </div>
                    <Table
                        columns={columns}
                        data={listTapPhimResult}
                        loading={loading}
                        actions={['view', 'edit', 'delete']}
                        onAction={handleAction}
                        onPageChange={onPageChange}
                    />
                </div>
            </div>

            {cardAction && (
                <Card
                    action={cardAction}
                    data={currentEpisode}
                    columns={columns}
                    formFields={formFields}
                    onClose={handleCloseCard}
                    onSave={handleSave}
                    onDelete={handleDelete}
                />
            )}
        </>
    );
}
