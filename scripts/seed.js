import dotenv from 'dotenv';
import mongoose from 'mongoose';

import AssignmentSubmission from '../models/AssignmentSubmission.js';
import Category from '../models/Category.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import ForumPost from '../models/ForumPost.js';
import Material from '../models/Material.js';
import Notification from '../models/Notification.js';
import Review from '../models/Review.js';
import TestResult from '../models/TestResult.js';
import Token from '../models/Token.js';
import User from '../models/User.js';

dotenv.config();

const DEMO_PASSWORD = 'Password123!';

const thumbnail = (text, color = '7c3aed') =>
  `https://placehold.co/800x450/${color}/ffffff?text=${encodeURIComponent(text)}`;

const connect = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required to run the seed script.');
  }

  await mongoose.connect(process.env.MONGODB_URI);
};

const clearDatabase = async () => {
  await Promise.all([
    Token.deleteMany({}),
    Notification.deleteMany({}),
    Review.deleteMany({}),
    ForumPost.deleteMany({}),
    TestResult.deleteMany({}),
    AssignmentSubmission.deleteMany({}),
    Enrollment.deleteMany({}),
    Material.deleteMany({}),
    Course.deleteMany({}),
    Category.deleteMany({}),
    User.deleteMany({}),
  ]);
};

const createUsers = async () => {
  const [admin, instructorAndi, instructorMaya, studentRaka, studentSinta, studentBimo] =
    await User.create([
      {
        name: 'Admin DiBelajar',
        email: 'admin@dibelajarin.test',
        password: DEMO_PASSWORD,
        role: 'admin',
        bio: 'Mengelola operasional LMS dan kualitas konten.',
      },
      {
        name: 'Andi Pratama',
        email: 'andi.instructor@dibelajarin.test',
        password: DEMO_PASSWORD,
        role: 'instructor',
        bio: 'Instruktur web development dan cloud fundamentals.',
      },
      {
        name: 'Maya Lestari',
        email: 'maya.instructor@dibelajarin.test',
        password: DEMO_PASSWORD,
        role: 'instructor',
        bio: 'Instruktur data, produktivitas, dan komunikasi digital.',
      },
      {
        name: 'Raka Saputra',
        email: 'raka.student@dibelajarin.test',
        password: DEMO_PASSWORD,
        role: 'student',
        bio: 'Siswa aktif yang sedang belajar web development.',
      },
      {
        name: 'Sinta Amelia',
        email: 'sinta.student@dibelajarin.test',
        password: DEMO_PASSWORD,
        role: 'student',
        bio: 'Siswa yang sudah menyelesaikan satu kursus demo.',
      },
      {
        name: 'Bimo Nugroho',
        email: 'bimo.student@dibelajarin.test',
        password: DEMO_PASSWORD,
        role: 'student',
        bio: 'Siswa baru yang belum mengikuti kursus.',
      },
    ]);

  return {
    admin,
    instructors: { andi: instructorAndi, maya: instructorMaya },
    students: { raka: studentRaka, sinta: studentSinta, bimo: studentBimo },
  };
};

const createCategories = async () => {
  const [web, cloud, data, career] = await Category.create([
    { name: 'Web Development' },
    { name: 'Cloud Computing' },
    { name: 'Data & Analytics' },
    { name: 'Career Skills' },
  ]);

  return { web, cloud, data, career };
};

const createCourses = async ({ categories, instructors }) => {
  const [mern, cloud, analytics, communication] = await Course.create([
    {
      title: 'MERN Stack dari Nol',
      description:
        '<p>Bangun aplikasi full-stack modern dengan MongoDB, Express, React, dan Node.js.</p>',
      thumbnail: thumbnail('MERN Stack', '2563eb'),
      instructorId: instructors.andi._id,
      category: categories.web._id,
      averageRating: 4.8,
      reviewCount: 2,
    },
    {
      title: 'Cloud Deployment Praktis',
      description:
        '<p>Pelajari deployment aplikasi Node.js, environment variable, logging, dan monitoring dasar.</p>',
      thumbnail: thumbnail('Cloud Deployment', '0f766e'),
      instructorId: instructors.andi._id,
      category: categories.cloud._id,
      averageRating: 4.5,
      reviewCount: 1,
    },
    {
      title: 'Dasar Data Analytics',
      description:
        '<p>Pahami spreadsheet, visualisasi data, dan cara membaca metrik produk secara praktis.</p>',
      thumbnail: thumbnail('Data Analytics', '9333ea'),
      instructorId: instructors.maya._id,
      category: categories.data._id,
      averageRating: 0,
      reviewCount: 0,
    },
    {
      title: 'Komunikasi Profesional',
      description:
        '<p>Latihan komunikasi kerja, feedback, dan presentasi singkat untuk lingkungan profesional.</p>',
      thumbnail: thumbnail('Career Skills', 'ea580c'),
      instructorId: instructors.maya._id,
      category: categories.career._id,
      averageRating: 0,
      reviewCount: 0,
    },
  ]);

  return { mern, cloud, analytics, communication };
};

const question = (questionText, correct, wrong) => ({
  questionText,
  options: [
    { optionText: correct, isCorrect: true },
    { optionText: wrong, isCorrect: false },
  ],
});

const createMaterials = async ({ courses }) => {
  const [
    mernIntro,
    mernApi,
    mernReact,
    cloudIntro,
    cloudEnv,
    analyticsMetric,
    analyticsChart,
    communicationFeedback,
  ] = await Material.create([
    {
      title: 'MERN Overview',
      description:
        '<p>Kenali peran MongoDB, Express, React, dan Node.js dalam satu aplikasi full-stack.</p>',
      courseId: courses.mern._id,
      testContent: [
        question('Apa fungsi Express dalam MERN?', 'Membuat API server', 'Membuat database'),
      ],
    },
    {
      title: 'REST API dengan Express',
      description:
        '<p>Buat endpoint, middleware, controller, dan response API yang konsisten.</p>',
      courseId: courses.mern._id,
      testContent: [
        question('HTTP method untuk update data biasanya?', 'PUT atau PATCH', 'GET'),
      ],
    },
    {
      title: 'React Query untuk Data Fetching',
      description:
        '<p>Gunakan query, mutation, cache invalidation, dan loading state di React.</p>',
      courseId: courses.mern._id,
      testContent: [
        question('Apa fungsi query invalidation?', 'Meminta data fresh setelah mutation', 'Menghapus komponen React'),
      ],
    },
    {
      title: 'Cloud Deployment Checklist',
      description:
        '<p>Siapkan build command, environment variable, health check, dan domain deploy.</p>',
      courseId: courses.cloud._id,
      testContent: [
        question('Kenapa environment variable tidak ditulis di source code?', 'Untuk menjaga konfigurasi dan secret', 'Supaya build selalu gagal'),
      ],
    },
    {
      title: 'Logging dan Monitoring Dasar',
      description:
        '<p>Gunakan log, error tracking, dan status endpoint untuk memantau aplikasi.</p>',
      courseId: courses.cloud._id,
      testContent: [],
    },
    {
      title: 'Membaca KPI Produk',
      description:
        '<p>Bedakan metric utama, driver metric, dan guardrail metric untuk pengambilan keputusan.</p>',
      courseId: courses.analytics._id,
      testContent: [
        question('Apa fungsi guardrail metric?', 'Menjaga dampak negatif tidak terlewat', 'Mengganti semua metric utama'),
      ],
    },
    {
      title: 'Visualisasi Data Sederhana',
      description:
        '<p>Pilih chart yang tepat untuk tren, perbandingan, dan komposisi.</p>',
      courseId: courses.analytics._id,
      testContent: [],
    },
    {
      title: 'Memberi Feedback yang Jelas',
      description:
        '<p>Latihan memberi feedback yang spesifik, objektif, dan bisa ditindaklanjuti.</p>',
      courseId: courses.communication._id,
      testContent: [],
    },
  ]);

  return {
    mernIntro,
    mernApi,
    mernReact,
    cloudIntro,
    cloudEnv,
    analyticsMetric,
    analyticsChart,
    communicationFeedback,
  };
};

const materialProgress = ({
  material,
  test = false,
  assignment = false,
  forum = 0,
  completed = false,
}) => ({
  materialId: material._id,
  hasCompletedTest: test,
  hasSubmittedAssignment: assignment,
  forumPostCount: forum,
  isCompleted: completed,
});

const createLearningActivity = async ({ users, courses, materials }) => {
  const now = new Date();

  await Enrollment.create([
    {
      userId: users.students.raka._id,
      courseId: courses.mern._id,
      progress: [
        materialProgress({
          material: materials.mernIntro,
          test: true,
          assignment: true,
          forum: 2,
          completed: true,
        }),
        materialProgress({
          material: materials.mernApi,
          test: true,
          assignment: true,
          forum: 1,
          completed: false,
        }),
        materialProgress({ material: materials.mernReact }),
      ],
    },
    {
      userId: users.students.raka._id,
      courseId: courses.cloud._id,
      progress: [
        materialProgress({
          material: materials.cloudIntro,
          test: true,
          assignment: false,
          forum: 0,
          completed: false,
        }),
      ],
    },
    {
      userId: users.students.sinta._id,
      courseId: courses.mern._id,
      completedAt: now,
      progress: [
        materialProgress({
          material: materials.mernIntro,
          test: true,
          assignment: true,
          forum: 2,
          completed: true,
        }),
        materialProgress({
          material: materials.mernApi,
          test: true,
          assignment: true,
          forum: 2,
          completed: true,
        }),
        materialProgress({
          material: materials.mernReact,
          test: true,
          assignment: true,
          forum: 2,
          completed: true,
        }),
      ],
    },
    {
      userId: users.students.sinta._id,
      courseId: courses.analytics._id,
      progress: [
        materialProgress({
          material: materials.analyticsMetric,
          test: true,
          assignment: true,
          forum: 2,
          completed: true,
        }),
        materialProgress({ material: materials.analyticsChart }),
      ],
    },
  ]);

  await TestResult.create([
    {
      userId: users.students.raka._id,
      materialId: materials.mernIntro._id,
      score: 100,
      answers: [{ questionId: 'seed-q-mern-overview', answer: 'Membuat API server' }],
    },
    {
      userId: users.students.raka._id,
      materialId: materials.mernApi._id,
      score: 80,
      answers: [{ questionId: 'seed-q-rest-api', answer: 'PUT atau PATCH' }],
    },
    {
      userId: users.students.sinta._id,
      materialId: materials.mernIntro._id,
      score: 100,
      answers: [{ questionId: 'seed-q-mern-overview', answer: 'Membuat API server' }],
    },
    {
      userId: users.students.sinta._id,
      materialId: materials.mernApi._id,
      score: 90,
      answers: [{ questionId: 'seed-q-rest-api', answer: 'PUT atau PATCH' }],
    },
    {
      userId: users.students.sinta._id,
      materialId: materials.analyticsMetric._id,
      score: 85,
      answers: [{ questionId: 'seed-q-kpi', answer: 'Menjaga dampak negatif tidak terlewat' }],
    },
  ]);

  await AssignmentSubmission.create([
    {
      userId: users.students.raka._id,
      materialId: materials.mernIntro._id,
      submissionFileUrl: 'https://example.com/demo/raka-mern-overview.pdf',
      grade: 92,
      feedback: 'Struktur jawaban sudah jelas. Tambahkan contoh endpoint.',
      status: 'graded',
      gradedAt: now,
      gradedBy: users.instructors.andi._id,
    },
    {
      userId: users.students.raka._id,
      materialId: materials.mernApi._id,
      submissionFileUrl: 'https://example.com/demo/raka-rest-api.zip',
      status: 'submitted',
    },
    {
      userId: users.students.sinta._id,
      materialId: materials.mernReact._id,
      submissionFileUrl: 'https://example.com/demo/sinta-react-query.pdf',
      grade: 95,
      feedback: 'Implementasi cache invalidation sudah tepat.',
      status: 'graded',
      gradedAt: now,
      gradedBy: users.instructors.andi._id,
    },
    {
      userId: users.students.sinta._id,
      materialId: materials.analyticsMetric._id,
      submissionFileUrl: 'https://example.com/demo/sinta-kpi.pdf',
      grade: 88,
      feedback: 'Metric tree sudah masuk akal, guardrail perlu diperjelas.',
      status: 'graded',
      gradedAt: now,
      gradedBy: users.instructors.maya._id,
    },
  ]);

  const [rakaPost, sintaPost] = await ForumPost.create([
    {
      userId: users.students.raka._id,
      materialId: materials.mernIntro._id,
      text: 'Saya mulai paham kenapa backend dan frontend dipisahkan.',
    },
    {
      userId: users.students.sinta._id,
      materialId: materials.mernIntro._id,
      text: 'Contoh API response yang konsisten sangat membantu debugging.',
    },
  ]);

  const [instructorReply] = await ForumPost.create([
    {
      userId: users.instructors.andi._id,
      materialId: materials.mernIntro._id,
      text: 'Betul. Konsistensi response akan memudahkan frontend dan testing.',
      parentPostId: rakaPost._id,
    },
  ]);
  rakaPost.replies.push(instructorReply._id);
  await rakaPost.save();

  await ForumPost.create([
    {
      userId: users.students.sinta._id,
      materialId: materials.analyticsMetric._id,
      text: 'Apakah conversion rate termasuk KPI utama atau driver metric?',
    },
  ]);

  await Review.create([
    {
      userId: users.students.sinta._id,
      courseId: courses.mern._id,
      rating: 5,
      comment: 'Materinya runtut dan flow praktiknya terasa nyata.',
    },
    {
      userId: users.students.raka._id,
      courseId: courses.mern._id,
      rating: 4,
      comment: 'Cocok untuk mulai memahami full-stack JavaScript.',
    },
    {
      userId: users.students.raka._id,
      courseId: courses.cloud._id,
      rating: 5,
      comment: 'Checklist deployment-nya praktis untuk project kecil.',
    },
  ]);

  await Notification.create([
    {
      userId: users.students.raka._id,
      message: 'Tugas Anda pada materi "MERN Overview" sudah dinilai.',
      link: '/student-activity',
    },
    {
      userId: users.instructors.andi._id,
      message: 'Raka Saputra mengumpulkan tugas REST API dengan Express.',
      link: `/instructor/courses/${courses.mern.slug}/materials/${materials.mernApi.slug}`,
    },
    {
      userId: users.students.sinta._id,
      message: 'Selamat, Anda sudah menyelesaikan kursus MERN Stack dari Nol.',
      link: `/learn/${courses.mern.slug}/certificate`,
      isRead: true,
    },
  ]);

  await Promise.all([
    Course.findByIdAndUpdate(courses.mern._id, {
      averageRating: 4.5,
      reviewCount: 2,
    }),
    Course.findByIdAndUpdate(courses.cloud._id, {
      averageRating: 5,
      reviewCount: 1,
    }),
  ]);
};

const seed = async () => {
  await connect();
  await clearDatabase();

  const users = await createUsers();
  const categories = await createCategories();
  const courses = await createCourses({ categories, instructors: users.instructors });
  const materials = await createMaterials({ courses });
  await createLearningActivity({ users, courses, materials });

  console.log('Seed completed.');
  console.log('Demo accounts:');
  console.log(`- admin@dibelajarin.test / ${DEMO_PASSWORD}`);
  console.log(`- andi.instructor@dibelajarin.test / ${DEMO_PASSWORD}`);
  console.log(`- maya.instructor@dibelajarin.test / ${DEMO_PASSWORD}`);
  console.log(`- raka.student@dibelajarin.test / ${DEMO_PASSWORD}`);
  console.log(`- sinta.student@dibelajarin.test / ${DEMO_PASSWORD}`);
  console.log(`- bimo.student@dibelajarin.test / ${DEMO_PASSWORD}`);
};

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
