import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CourseCard from '../components/home/CourseCard';
import { searchCourse } from '../services/coursesService';

const SearchResults = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const searchQuery = searchParams.get('q');
        
        if (searchQuery) {
            fetchSearchResults(searchQuery);
        } else {
            // Redirect to home if no search query
            navigate('/');
        }
    }, [searchParams, navigate]); // React to URL parameter changes

    const fetchSearchResults = async (searchQuery) => {
        setLoading(true);
        try {
            const response = await searchCourse(searchQuery);
            setCourses(response);
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">
                    Kết quả tìm kiếm cho "{searchParams.get('q')}"
                </h1>
                <p className="text-gray-600 mt-2">
                    Tìm thấy {courses.length} khóa học
                </p>
            </div>

            {courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <CourseCard
                            key={course.id}
                            id={course.id}
                            thumbnail={course.thumbnail}
                            title={course.title}
                            description={course.description}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-600">
                        Không tìm thấy khóa học nào phù hợp với từ khóa "{searchParams.get('q')}"
                    </p>
                </div>
            )}
        </div>
    );
};

export default SearchResults;