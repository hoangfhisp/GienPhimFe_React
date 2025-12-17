import React from "react";
import ActionCard from "../../../components/Layouts/ActionCard/ActionCard";

export default function TongQuan() {
    return (
        <div className="TongQuan">
            <div className="TongQuan__card">
                <div>
                    <ActionCard
                        title="Tổng đang có:"
                        value="350,897"
                        subtitle="Quốc gia hiện tại"
                        onAdd={() => alert("Thêm mới")}
                        onDelete={() => alert("Xoá")}
                    />
                </div>
            </div>
        </div >
    );
}
