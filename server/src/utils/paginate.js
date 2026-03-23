const paginate = async (model, query, sortField, page, pageSize) => {
  const skip = (page - 1) * pageSize;

  const [results, total] = await Promise.all([
    model.find(query).sort(sortField).skip(skip).limit(pageSize),
    model.countDocuments(query)
  ]);

  return {
    results,
    currentPage: page,
    totalPages: Math.ceil(total / pageSize),
    totalResults: total,
    hasNextPage: page < Math.ceil(total / pageSize),
    hasPrevPage: page > 1
  };
};

export default paginate;