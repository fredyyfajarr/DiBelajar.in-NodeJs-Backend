import Category from '../models/Category.js';
import escapeStringRegexp from 'escape-string-regexp'; // <-- Impor library baru

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

      let categorySlug = reqQuery.category;
      if (categorySlug) {
        delete reqQuery.category;
      }

      removeFields.forEach((param) => delete reqQuery[param]);

      let queryStr = JSON.stringify(reqQuery);
      queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
      );

      let findQuery = JSON.parse(queryStr);

      if (categorySlug) {
        const category = await Category.findOne({ slug: categorySlug });
        if (category) {
          findQuery.category = category._id;
        } else {
          findQuery.category = null;
        }
      }

      if (
        req.user &&
        req.user.role === 'instructor' &&
        model.modelName === 'Course'
      ) {
        findQuery.instructorId = req.user._id;
      }

      if (req.query.keyword && searchableFields.length > 0) {
        // PERBAIKAN: Sanitasi input untuk mencegah ReDoS
        const sanitizedKeyword = escapeStringRegexp(req.query.keyword);
        const keywordRegex = new RegExp(sanitizedKeyword, 'i');
        findQuery['$or'] = searchableFields.map((field) => ({
          [field]: keywordRegex,
        }));
      }

      query = model.find(findQuery);

      // PERBAIKAN: Tambahkan pengecekan tipe data
      if (req.query.select && typeof req.query.select === 'string') {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
      }

      // PERBAIKAN: Tambahkan pengecekan tipe data
      if (req.query.sort && typeof req.query.sort === 'string') {
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
