import Category from '../models/Category.js'; // <-- 1. Pastikan model Category di-import

export const advancedResults =
  (model, populate, searchableFields = []) =>
  async (req, res, next) => {
    try {
      let query;
      const reqQuery = { ...req.query };

      // Hapus properti 'category' jika nilainya kosong (dari tombol "Semua")
      if (reqQuery.category === '') {
        delete reqQuery.category;
      }

      const removeFields = ['select', 'sort', 'page', 'limit', 'keyword'];

      // --- PERUBAHAN LOGIKA UTAMA ADA DI SINI ---

      let categorySlug = reqQuery.category;
      if (categorySlug) {
        delete reqQuery.category; // Hapus dari reqQuery agar tidak diproses sebagai string biasa
      }

      removeFields.forEach((param) => delete reqQuery[param]);

      let queryStr = JSON.stringify(reqQuery);
      queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
      );

      let findQuery = JSON.parse(queryStr);

      // Jika ada slug kategori, cari ID-nya dan tambahkan ke query
      if (categorySlug) {
        const category = await Category.findOne({ slug: categorySlug });
        if (category) {
          findQuery.category = category._id;
        } else {
          // Jika slug kategori tidak ditemukan, buat query yang tidak akan mengembalikan hasil
          findQuery.category = null;
        }
      }
      // --- AKHIR PERUBAHAN ---

      if (
        req.user &&
        req.user.role === 'instructor' &&
        model.modelName === 'Course'
      ) {
        findQuery.instructorId = req.user._id;
      }

      if (req.query.keyword && searchableFields.length > 0) {
        const keywordRegex = new RegExp(req.query.keyword, 'i');
        findQuery['$or'] = searchableFields.map((field) => ({
          [field]: keywordRegex,
        }));
      }

      query = model.find(findQuery);

      if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
      }

      if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
      } else {
        query = query.sort('-createdAt');
      }

      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const total = await model.countDocuments(findQuery);

      query = query.skip(startIndex).limit(limit);

      if (populate) {
        query = query.populate(populate);
      }

      const results = await query;

      const pagination = {};
      if (endIndex < total) {
        pagination.next = { page: page + 1, limit };
      }
      if (startIndex > 0) {
        pagination.prev = { page: page - 1, limit };
      }

      res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        total,
        data: results,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
