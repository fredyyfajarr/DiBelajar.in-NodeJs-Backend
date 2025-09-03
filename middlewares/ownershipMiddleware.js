// Memastikan instruktur hanya bisa mengakses kursus miliknya
export const authorizeCourseOwner = (req, res, next) => {
  // Middleware ini harus dijalankan setelah loadCourse dan protect
  const courseInstructorId = req.course.instructorId._id.toString();
  const loggedInUserId = req.user._id.toString();

  // Jika pengguna adalah admin, izinkan akses
  if (req.user.role === 'admin') {
    return next();
  }

  // Jika pengguna adalah instruktur, cek apakah dia pemilik kursus
  if (req.user.role === 'instructor' && courseInstructorId === loggedInUserId) {
    return next();
  }

  // Jika tidak, tolak akses
  return res.status(403).json({
    message: 'Anda tidak memiliki izin untuk mengakses sumber daya ini',
  });
};
