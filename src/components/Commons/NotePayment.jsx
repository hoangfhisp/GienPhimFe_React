
function NotePayMent(){
    return(
        <div className="note-container">
            <div className="note-header">
                <div className="note-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 20 20" fill="none">
                        <path d="M10 8.333h.008m-.842 2.5h.833v3.334h.834" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M8.533 3.297 1.515 15.014A1.658 1.658 0 0 0 2.932 17.5h14.037a1.658 1.658 0 0 0 1.417-2.486l-7.02-11.717a1.658 1.658 0 0 0-2.833 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </div>
                <h2 className="note-title">Lưu ý</h2>
            </div>
            <div className="note-body">
                <p className="note-text">Vui lòng chuyển tới tài khoản ngân hàng của chúng tôi bằng Internet Banking hoặc Ví điện tử.</p>
                <p className="note-text">Chi tiết chuyển khoản sẽ được hướng dẫn sau khi bạn xác nhận số tiền. Thời gian chuyển khoản tối đa 60 phút.</p>
            </div>
        </div>
    );
}

export default NotePayMent;