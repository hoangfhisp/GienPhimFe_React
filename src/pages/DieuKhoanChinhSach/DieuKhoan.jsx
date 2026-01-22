import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./DieuKhoanChinhSach.scss";

export default function DieuKhoan() {
  const [content, setContent] = useState("");
  const [updatedDate, setUpdatedDate] = useState("");

  useEffect(() => {
    fetch("/dieukhoan.md")
      .then(res => res.text())
      .then(text => {
        // Tách front-matter
        const match = text.match(/---([\s\S]*?)---/);

        if (match) {
          const meta = match[1];
          const dateMatch = meta.match(/updated:\s*(.*)/);
          if (dateMatch) {
            setUpdatedDate(dateMatch[1]);
          }

          // Xóa front-matter khỏi markdown
          setContent(text.replace(match[0], ""));
        } else {
          setContent(text);
        }
      });
  }, []);

  return (
    <div className="policy-term-container-main">
      <div className="policy-term-wrapper">
        <div className="policy-term-header">
          <h1>Điều khoản sử dụng</h1>
          {updatedDate && (
            <span className="policy-term-badge">
              Cập nhật {updatedDate}
            </span>
          )}
        </div>

        <div className="policy-term-content">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
