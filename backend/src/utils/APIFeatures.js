class APIFeautres {
  // constructor
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString; //req.query or params
  }

  // Methods
  filter() {
    let filterQuery = {};
    let queryObject = { ...this.queryString };

    // MIN and MAX prices or values
    if (queryObject.minPrice && queryObject.maxPrice) {
      if (queryObject.maxPrice.includes(">")) {
        filterQuery.price = { $gte: queryObject.minPrice };
      } else {
        filterQuery.price = {
          $gte: queryObject.minPrice,
          $lte: queryObject.maxPrice,
        };
      }
    }

    // Property Type
    if (queryObject.propertyType) {
      let propertyTypeArray = queryObject.propertyType
        .split(",")
        .map((value) => value.trim());

      filterQuery.propertyType = { $in: propertyTypeArray };
    }

    // Room Tpe
    if (queryObject.roomType) {
      filterQuery.roomType = queryObject.roomType;
    }

    // Amentities
    if (queryObject.amenities) {
      const amenitiesArray = Array.isArray(queryObject.amenities)
        ? queryObject.amenities
        : [queryObject.amenities];

      filterQuery["amenities.name"] = { $all: amenitiesArray };
    }

    // console.log("query: ", this.query);
    // console.log("queryString: ", this.queryString);
    // console.log("queryObj: ", queryObject);
    console.log("filterQuery: ", filterQuery);

    this.query = this.query.find(filterQuery);
    return this;
  }

  search() {
    let searchQuery = {};
    let queryObj = { ...this.queryString };

    // Search using cities
    searchQuery = queryObj.city
      ? {
          $or: [
            {
              "address.city": queryObj.city?.toLowerCase().replaceAll(" ", ""),
            },
            {
              "address.state": queryObj.city?.toLowerCase().replaceAll(" ", ""),
            },
            {
              "address.area": queryObj.city?.toLowerCase().replaceAll(" ", ""),
            },
          ],
        }
      : {};

    // search using guests
    if (queryObj.guests) {
      searchQuery.maximumGuest = { $gte: queryObj.guests };
    }

    // serach using dates
    if (queryObj.dateIn && queryObj.dateOut) {
      searchQuery.$and = [
        {
          currentBookings: {
            $not: {
              $elemMatch: {
                $or: [
                  {
                    fromDate: { $lt: queryObj.dateOut },
                    toDate: { $gt: queryObj.dateIn },
                  },
                  {
                    fromDate: { $lt: queryObj.dateIn },
                    toDate: { $gt: queryObj.dateOut },
                  },
                ],
              },
            },
          },
        },
      ];
    }

    this.query = this.query.find(searchQuery);
    return this;
  }

  pagination() {
    let page = this.queryString.page * 1 || 1;
    let limit = this.queryString.limit * 1 || 12;
    let skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export { APIFeautres };
