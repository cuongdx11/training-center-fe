import React, { useState, useEffect } from 'react';
// import { PlusCircle } from 'lucide-react';
import CategoryTable from '../../components/admin/categories/CategoryTable';
import SearchBar from '../../components/admin/categories/SearchBar';
import Header from '../../components/admin/categories/Header'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService';
import CategoryForm from '../../components/admin/categories/CategoryForm';
import Modal from '../../components/admin/categories/Modal';

const CategoryManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const[modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [categoryResponse] = await Promise.all([
        getCategories()
      ]);
      console.log(categoryResponse);
      setCategories(categoryResponse.data);
    } catch (err) {
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (categoryId) => {
    const isConfirmed = window.confirm('Bạn có muốn xóa không?');
    if (isConfirmed) {
      try {
        await deleteCategory(categoryId);
        setCategories(categories.filter((cat) => cat.id !== categoryId));
        alert("Xóa thành công!")
      } catch (error) {
        const retry = window.confirm('Không thể xóa danh mục. Bạn có muốn thử lại không?');
        if (retry) {
          handleDelete(categoryId);
        }
      }
    }
  };

  const handleEdit = async (categoryId) => {
    const category = categories.find((cate) => cate.id === categoryId);
    setEditingCategory(category);
    setModalOpen(true);
  }

  const handleSave = async(data) => {
    console.log('Data to save:', data);
    try {
      if(editingCategory) {
        const updatedCategory = await updateCategory(editingCategory.id, data);
        setCategories(
          categories.map((cate) => {
            return cate.id === editingCategory.id ? updatedCategory : cate;
          }
        ));
      } else {
        const newCategory = await createCategory(data);
        setCategories([...categories, newCategory]);
      }
      setModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      setError("có lỗi xảy ra, không thể thêm!");
    }
  }

  const handleAdd = async() => {
    setEditingCategory(null);
    setModalOpen(true);
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <Header 
        onAddClick={handleAdd}
      />
      <SearchBar value={searchTerm} onChange={handleSearch} />
      <CategoryTable
        categories={filteredCategories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <CategoryForm
          initialData={editingCategory}
          onSubmit={handleSave}
          onClose={() => setModalOpen(false)}
        />
      </Modal>

    </div>
  );
};

export default CategoryManagementPage;
