import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Users,
  Calendar,
  BookOpen,
  BarChart,
  DollarSign,
  CheckCircle,
  PlayCircle,
  ChevronDown,
  Mail,
  Phone,
  Star,
  StarHalf,
} from "lucide-react";
import { createReview, listReviewByCourse } from "../services/courseReview";

const CourseDetail = ({ course }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const learningOutcomes = [
    "Hiểu rõ các nguyên lý cơ bản của lập trình Fullstack",
    "Phát triển website hoàn chỉnh sử dụng NodeJS, ExpressJS, ReactJS, NextJS",
    "Sử dụng Typescript và các công nghệ liên quan",
    "Xây dựng API RESTful với Node.js",
    "Phát triển ứng dụng web tương tác với ReactJS",
  ];

  const [openSections, setOpenSections] = useState({});
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    review: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const fetchReviews = useCallback(async () => {
    try {
      const data = await listReviewByCourse(course.id);
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, [course.id]);
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await createReview({
        courseId: course.id,
        rating: newReview.rating,
        review: newReview.review,
      });

      await fetchReviews();
      setNewReview({ rating: 5, review: "" });
    } catch (error) {
      setError(error.response?.data?.message || "Error submitting review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="w-5 h-5 fill-yellow-400 text-yellow-400"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="w-5 h-5 fill-yellow-400 text-yellow-400"
        />
      );
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 mb-8 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block bg-blue-500/20 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-500/30 mb-4">
                {course.category ? course.category.name : "Khóa học lập trình"}
              </span>
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-blue-100 mb-6">{course.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{course.duration} giờ</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  <span>{course.studentCount} học viên</span>
                </div>
                <div className="flex items-center">
                  <BarChart className="w-5 h-5 mr-2" />
                  <span>{course.level}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{formatDate(course.createdAt)}</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-300">
                  Nhận tư vấn
                </button>
                <button className="bg-blue-500/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-500/30 transition duration-300 flex items-center">
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Xem giới thiệu
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="aspect-video rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt="Course thumbnail"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <span className="text-white">No Thumbnail Available</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* Instructors Section */}
            <div className="bg-white rounded-xl shadow-sm mb-8">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Giảng viên</h2>
                <div className="space-y-6">
                  {course.instructorList &&
                    course.instructorList.map((instructor) => (
                      <div
                        key={instructor.id}
                        className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex-shrink-0">
                          <img
                            src={
                              instructor.profilePicture ||
                              "/api/placeholder/64/64"
                            }
                            alt={instructor.fullName}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {instructor.fullName}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {instructor.bio}
                          </p>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="w-4 h-4 mr-2" />
                              {instructor.email}
                            </div>
                            {instructor.phoneNumber && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="w-4 h-4 mr-2" />
                                {instructor.phoneNumber}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Learning Outcomes */}
            <div className="bg-white rounded-xl shadow-sm mb-8">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Bạn sẽ học được gì?</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {learningOutcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                      <span className="text-gray-600">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Course Sections */}
            <div className="bg-white rounded-xl shadow-sm mb-8">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Nội dung khóa học</h2>
                <div className="space-y-4">
                  {course.sectionList && course.sectionList.length > 0 ? (
                    course.sectionList.map((section, index) => {
                      const isOpen = openSections[section.id] || false;

                      return (
                        <div
                          key={section.id}
                          className={`border border-gray-100 rounded-xl transition-all duration-300 ${
                            isOpen
                              ? "bg-blue-50/50"
                              : "bg-white hover:bg-gray-50"
                          }`}
                        >
                          <button
                            onClick={() => toggleSection(section.id)}
                            className="w-full px-6 py-4 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-4">
                              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 font-semibold">
                                {index + 1}
                              </span>
                              <div className="text-left">
                                <h3 className="font-semibold text-gray-900">
                                  {section.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {section.description}
                                </p>
                              </div>
                            </div>
                            <ChevronDown
                              className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {/* Lessons List */}
                          <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              isOpen ? "opacity-100" : "opacity-0 max-h-0"
                            }`}
                            style={{
                              maxHeight: isOpen ? "2000px" : "0",
                              marginTop: isOpen ? "0.5rem" : "0",
                              marginBottom: isOpen ? "1rem" : "0",
                            }}
                          >
                            {section.lessons && section.lessons.length > 0 ? (
                              <div className="px-6 space-y-3">
                                {section.lessons.map((lesson) => (
                                  <div
                                    key={lesson.id}
                                    className="p-4 rounded-lg bg-white border border-gray-100 hover:border-blue-200 transition-all duration-200"
                                  >
                                    <div className="flex items-start gap-3">
                                      <PlayCircle className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-gray-900 truncate">
                                          {lesson.title}
                                        </h4>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                          {lesson.content}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                          <Clock className="w-4 h-4 text-gray-400" />
                                          <span className="text-sm text-gray-500">
                                            {lesson.duration} phút
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="px-6 text-gray-600 text-sm">
                                Không có bài học nào trong phần này.
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-600">
                      Không có nội dung nào được tìm thấy.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Đánh giá khóa học</h2>

                {/* Review Form */}
                <form
                  onSubmit={handleSubmitReview}
                  className="mb-8 border-b pb-8"
                >
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Đánh giá của bạn
                    </label>
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setNewReview((prev) => ({ ...prev, rating: star }))
                          }
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= newReview.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nhận xét của bạn
                    </label>
                    <textarea
                      value={newReview.review}
                      onChange={(e) =>
                        setNewReview((prev) => ({
                          ...prev,
                          review: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="4"
                      placeholder="Chia sẻ trải nghiệm của bạn về khóa học..."
                      required
                    />
                  </div>

                  {error && (
                    <div className="mb-4 text-red-600 text-sm">{error}</div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-300 disabled:opacity-50"
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                  </button>
                </form>

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={
                              review.user?.profilePicture ||
                              "/api/placeholder/40/40"
                            }
                            alt={review.user?.fullName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900">
                                {review.user?.fullName || "Anonymous User"}
                              </h4>
                              <span className="text-sm text-gray-500">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                            <div className="flex gap-1 my-1">
                              {renderStars(review.rating)}
                            </div>
                            <p className="text-gray-600 mt-2">
                              {review.review}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-center py-8">
                      Chưa có đánh giá nào cho khóa học này.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm sticky top-8">
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-blue-600">
                    {formatPrice(course.price)}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <BookOpen className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">
                      {course.lessonCount} bài học
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() =>
                      navigate(`/checkout/${course.id}`)
                    }
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                  >
                    Đăng ký ngay
                  </button>

                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Khóa học bao gồm:
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-gray-600">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span>Thời lượng {course.duration} giờ</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-600">
                      <BookOpen className="w-5 h-5 text-gray-400" />
                      <span>{course.lessonCount} bài học</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-600">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <span>Truy cập trọn đời</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-600">
                      <CheckCircle className="w-5 h-5 text-gray-400" />
                      <span>Chứng chỉ hoàn thành</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
