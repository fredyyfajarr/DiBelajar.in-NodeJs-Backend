export const advancedResults =
  (model, populate, searchableFields = []) =>
  async (req, res, next) => {
    let query;
    const reqQuery = { ...req.query };

    const removeFields = ['select', 'sort', 'page', 'limit', 'keyword'];
    removeFields.forEach((param) => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    let findQuery = JSON.parse(queryStr);

    if (
      req.user &&
      req.user.role === 'instructor' &&
      model.modelName === 'Course'
    ) {
      // Jika ya, paksa query untuk hanya mencari kursus dengan instructorId milik user tsb.
      findQuery.instructorId = req.user._id;
    }
    // --- LOGIKA PENCARIAN BARU (DINAMIS) ---
    if (req.query.keyword && searchableFields.length > 0) {
      const keywordRegex = new RegExp(req.query.keyword, 'i');

      // Bangun query $or secara dinamis berdasarkan field yang diberikan
      findQuery['$or'] = searchableFields.map((field) => ({
        [field]: keywordRegex,
      }));
    }
    // --- AKHIR LOGIKA PENCARIAN ---

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
  };
