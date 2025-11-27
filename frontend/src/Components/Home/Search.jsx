import React, { useState } from "react";
import { DatePicker, Space } from "antd";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
import { propertyActions } from "../../store/Property/property-slice";
import { getAllProperties } from "../../store/Property/property-actions";

const Search = () => {
  const { RangePicker } = DatePicker;

  const [keyword, setKeyword] = useState({});
  const [value, setValue] = useState([]);

  const dispatch = useDispatch();
  // city:"", dateIn:"", dateOut:"", guests:0

  const searchHandler = (e) => {
    e.preventDefault();
    dispatch(propertyActions.updateSearchParams(keyword));
    dispatch(getAllProperties());

    setKeyword({
      city: "",
      dateIn: "",
      dateOut: "",
      guests: "",
    });
    setValue([]);
  };

  const updateKeyword = (field, value) => {
    setKeyword((prevKeyword) => ({
      ...prevKeyword,
      [field]: value,
    }));
  };

  const returnDates = (date, dateString) => {
    setValue(date[0], date[1]);
    updateKeyword("dateIn", dateString[0]);
    updateKeyword("dateOut", dateString[1]);
  };

  return (
    <>
      <div className="searchbar">
        <input
          className="search"
          id="search_destination"
          placeholder="Search destinations"
          type="text"
          value={keyword.city}
          onChange={(e) => updateKeyword("city", e.target.value)}
        />
        <Space direction="vertical" size={12} className="search">
          <RangePicker
            format="DD-MM-YYYY"
            picker="date"
            className="date_picker"
            value={value}
            disabledDate={(current) => {
              return current & current.isBefore(Date.now(), "day");
            }}
            onChange={returnDates}
          />
        </Space>
        <input
          type="number"
          className="search"
          id="addguest"
          placeholder="Add guests"
          value={keyword.guests}
          onChange={(e) => updateKeyword("guests", +e.target.value)}
        />
        <span
          className="material-symbols-outlined searchicon"
          onClick={searchHandler}
        >
          search
        </span>
      </div>
    </>
  );
};

export default Search;
