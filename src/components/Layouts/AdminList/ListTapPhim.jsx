import { useEffect, useState, useCallback } from "react";
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
    const [selectedMovie, setSelectedMovie] = useState(null);

    // Episode management states
    const [episodeOptions, setEpisodeOptions] = useState([]);
    const [selectedEpisodeId, setSelectedEpisodeId] = useState(null);

    const normalizeEpisodeForForm = useCallback((episode) => {
        return {
            ...episode,
            phimId: episode.phimId?.toString() || "",
        };
    }, []);

    const mapToFormData = useCallback((data) => {
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
    }, []);

    const fetchApi = useCallback(async () => {
        setLoading(true);
        try {
            const result = await movieServices.fetchEpisodes(page, limit);
            setListTapPhimResult(result.data);
            onPageChange(result.pagination);
        } catch (error) {
            console.error("Lỗi khi tải tập phim:", error);
        } finally {
            setLoading(false);
        }
    }, [page, limit, onPageChange]);

    const fetchEpisodesByMovieId = useCallback(async (phimId) => {
        if (!phimId) return [];
        try {
            const result = await movieServices.fetchEpisodesByMovieId(phimId);
            return result.data || [];
        } catch (error) {
            console.error("Lỗi khi tải tập phim theo phimId:", error);
            return [];
        }
    }, []);

    const fetchEpisodeDetail = useCallback(async (phimId, tapPhimId) => {
        console.log('--- fetchEpisodeDetail called ---');
        console.log('phimId:', phimId, 'tapPhimId:', tapPhimId);

        if (!phimId || !tapPhimId) {
            console.error('Missing phimId or tapPhimId in fetchEpisodeDetail', { phimId, tapPhimId });
            return;
        }

        setLoading(true);
        try {
            console.log('Calling API to fetch episode detail...');
            const result = await movieServices.fetchEpisodeDetail(phimId, tapPhimId);
            console.log('API response:', result);

            const normalizedData = normalizeEpisodeForForm(result.data);
            console.log('Normalized episode data:', normalizedData);

            setCurrentEpisode({ ...normalizedData, phimId });
            setSelectedEpisodeId(tapPhimId);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết tập phim:", error);
        } finally {
            setLoading(false);
        }
    }, [normalizeEpisodeForForm]);

    // Format episodes thành options cho Select component
    const formatEpisodeOptions = useCallback((episodes, phimId) => {
        return episodes
            .filter(ep => String(ep.phimId) === String(phimId))
            .map(ep => ({
                value: String(ep.tapId),
                label: ep.tenTap || 'Không rõ tên tập'
            }));
    }, []);

    const handleEpisodeSelect = useCallback(async (tapPhimId) => {
        console.log('--- handleEpisodeSelect called ---');
        const phimId = currentEpisode?.phimId || selectedMovie;
        console.log('Current phimId:', phimId);
        console.log('Selected tapPhimId:', tapPhimId);

        if (!phimId || !tapPhimId) {
            console.error("handleEpisodeSelect missing phimId or tapPhimId", { phimId, tapPhimId });
            return;
        }

        await fetchEpisodeDetail(phimId, tapPhimId);
    }, [currentEpisode?.phimId, selectedMovie, fetchEpisodeDetail]);

    const prepareEpisodeOptionsForMovie = useCallback(async (phimId) => {
        if (!phimId) return [];

        console.log('Fetching episodes for phimId:', phimId);
        const episodes = await fetchEpisodesByMovieId(phimId);
        console.log('Fetched episodes:', episodes);

        const options = formatEpisodeOptions(episodes, phimId);
        console.log('Formatted episode options:', options);

        setEpisodeOptions(options);
        return episodes;
    }, [fetchEpisodesByMovieId, formatEpisodeOptions]);

    useEffect(() => {
        if (data && data.length > 0) {
            setListTapPhimResult(data);
        } else {
            fetchApi();
        }
    }, [data, fetchApi]);

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

    const handleAction = useCallback(async (action, episodeOrMovie) => {
        console.log('--- handleAction triggered ---');
        console.log('Action type:', action);
        console.log('Received data:', episodeOrMovie);

        setCardAction(action);
        if (action === 'view') setViewFull(true);

        let phimId = "";

        if (action === 'edit') {
            // Nếu episodeOrMovie là tập phim (edit tập phim)
            phimId = episodeOrMovie.phimId || selectedMovie;
        } else {
            // Trường hợp khác (view hoặc create)
            phimId = episodeOrMovie.phimId || episodeOrMovie?.tapPhims?.[0]?.phimId || selectedMovie;
        }

        if (!phimId) {
            console.error("Không tìm thấy phimId trong handleAction", episodeOrMovie);
            return;
        }

        // Prepare episode options cho movie này
        await prepareEpisodeOptionsForMovie(phimId);

        const normalizedData = normalizeEpisodeForForm(
            episodeOrMovie.tapPhims?.[0] ? { ...episodeOrMovie.tapPhims[0], phimId } : episodeOrMovie
        );

        setSelectedMovie(phimId);
        setCurrentEpisode(normalizedData);

        // Set selected episode ID cho Card component
        const currentEpisodeId = normalizedData.tapPhimId || normalizedData.tapId;
        setSelectedEpisodeId(currentEpisodeId ? String(currentEpisodeId) : null);
    }, [prepareEpisodeOptionsForMovie, normalizeEpisodeForForm, selectedMovie]);

    const handleCloseCard = useCallback(() => {
        setViewFull(false);
        setCardAction(null);
        setCurrentEpisode(null);
        setEpisodeOptions([]);
        setSelectedEpisodeId(null);
        setSelectedMovie(null);
    }, []);

    const handleSave = useCallback(async (episodeData) => {
        try {
            setLoading(true);
            const formData = mapToFormData(episodeData);

            if (cardAction === 'create') {
                await movieServices.createEpisode(formData);
            } else {
                const realTapPhimId = currentEpisode?.tapPhimId || currentEpisode?.id;
                if (!realTapPhimId) throw new Error("Không tìm thấy ID tập phim để cập nhật");
                formData.append("tapPhimId", realTapPhimId);
                await movieServices.updateEpisode(formData);
            }

            fetchApi(pagination.currentPage);
            handleCloseCard();
        } catch (error) {
            console.error("Lỗi khi lưu tập phim:", error);
            alert(`Lỗi: ${error.response?.data?.Msg || error.message}`);
        } finally {
            setLoading(false);
        }
    }, [cardAction, currentEpisode, fetchApi, handleCloseCard, mapToFormData, pagination.currentPage]);

    // FIX: Hàm xóa riêng biệt cho tập phim
    const handleDeleteEpisode = useCallback(async (episode) => {
        console.log('--- handleDeleteEpisode called ---');
        console.log('Episode to delete:', episode);

        if (!window.confirm(`Bạn chắc chắn muốn xóa tập phim "${episode.tenTap}"?`)) return;

        try {
            setLoading(true);
            const tapPhimId = episode.tapPhimId || episode.id;
            console.log('Deleting episode with ID:', tapPhimId);

            await movieServices.deleteEpisode(tapPhimId);
            handleCloseCard();
            await fetchApi(pagination.currentPage);
        } catch (error) {
            console.error("Lỗi khi xóa tập phim:", error);
            alert(`Lỗi khi xóa: ${error.response?.data?.Msg || error.message}`);
        } finally {
            setLoading(false);
        }
    }, [fetchApi, handleCloseCard, pagination.currentPage]);

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
            render: row => row.tapPhims?.[0]?.tenTap || "Không có tập"
        },
        {
            header: "Slug tập đầu tiên",
            accessor: "tapPhims[0].slugTap",
            render: row => row.tapPhims?.[0]?.slugTap || "-"
        },
        {
            header: "Link chính video",
            accessor: "tapPhims[0].linkChinh",
            render: row => {
                const link = row.tapPhims?.[0]?.linkChinh;
                return link && link.endsWith('.mp4') ? (
                    <video width={200} height={120} controls>
                        <source src={link} type="video/mp4" />
                        Trình duyệt của bạn không hỗ trợ thẻ video.
                    </video>
                ) : "Không có video";
            }
        },
        {
            header: "Link phụ",
            accessor: "tapPhims[0].linkPhu",
            render: row => row.tapPhims?.[0]?.linkPhu || "-"
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
                    formFields={formFields}
                    episodeOptions={episodeOptions}
                    selectedEpisodeId={selectedEpisodeId}
                    onClose={handleCloseCard}
                    onSave={handleSave}
                    onDelete={handleDeleteEpisode}
                    onEpisodeSelect={handleEpisodeSelect}
                />
            )}
        </>
    );
}