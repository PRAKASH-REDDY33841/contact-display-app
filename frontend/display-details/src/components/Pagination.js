// src/components/Pagination.js
import React from "react";

function Pagination({ page, total, limit, onPageChange }) {
  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ marginTop: "20px" }}>
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>
      <span style={{ margin: "0 10px" }}>
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;