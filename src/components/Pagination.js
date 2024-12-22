const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // Số lượng nút hiển thị xung quanh trang hiện tại
    const maxPageLinks = 5;
  
    // Tính toán các trang xung quanh trang hiện tại
    const startPage = Math.max(0, currentPage - Math.floor(maxPageLinks / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxPageLinks - 1);
  
    return (
      <div className="flex justify-center mt-4">
        {/* Nút quay về trang đầu */}
        {currentPage > 0 && (
          <button
            onClick={() => onPageChange(0)}
            className="px-4 py-2 mx-1 rounded bg-gray-200"
          >
            &laquo;
          </button>
        )}
  
        {/* Nút quay về trang trước */}
        {currentPage > 0 && (
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="px-4 py-2 mx-1 rounded bg-gray-200"
          >
            &lt;
          </button>
        )}
  
        {/* Hiển thị các số trang */}
        {Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index).map(
          (page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 mx-1 rounded ${
                currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              {page + 1}
            </button>
          )
        )}
  
        {/* Nút chuyển sang trang sau */}
        {currentPage < totalPages - 1 && (
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="px-4 py-2 mx-1 rounded bg-gray-200"
          >
            &gt;
          </button>
        )}
  
        {/* Nút chuyển đến trang cuối */}
        {currentPage < totalPages - 1 && (
          <button
            onClick={() => onPageChange(totalPages - 1)}
            className="px-4 py-2 mx-1 rounded bg-gray-200"
          >
            &raquo;
          </button>
        )}
      </div>
    );
  };
export default Pagination;  