import React, { useState, useEffect } from "react";
import "../../CSS/Accomodation.css";
import ProgressSteps from "../ProgressSteps";

import AccomodationForm from "./AccomodationForm";
import MyAccomodation from "./MyAccomdation";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllAccomodations } from "../../store/Accomodation/accomodation-actions";
import LoadingSpinner from "../LoadingSpinner";

const Accomodation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accomodation, loading } = useSelector(state => state.accomodation);

  useEffect(() => {
    dispatch(getAllAccomodations());
  }, [dispatch]);



  return (
    <>
      <ProgressSteps accomodation />
      <div className="accom-container">
        <Link to="/accomodation">
          <button className="add-new-place">+ Add new place</button>
        </Link>
        {loading && <LoadingSpinner />}
        {accomodation.length > 0 && !loading && (
          <MyAccomodation accomodation={accomodation} loading={loading} />
        )}
      </div>
    </>
  );
};

export default Accomodation;
