import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "nanoid";
import AsyncSelect from "react-select/async";
import SubmitBtn from "../SubmitBtn";
import { unsetLeadId, unsetShowModal } from "../../features/masters/teamSlice";
import { splitErrors } from "../../../utils/showErrors";
import customFetch from "../../../utils/customFetch";

const AssignTeam = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const { showModal, listTeam, leadId } = useSelector((store) => store.teams);

  const fetchAvailable = async () => {
    try {
    } catch (error) {
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  const handleClose = () => {
    dispatch(unsetShowModal());
    dispatch(unsetLeadId());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const leadName = listTeam?.find((i) => i.id === leadId);

  const roles = [];

  useEffect(() => {
    fetchAvailable;
  }, []);

  return (
    <Modal show={showModal} size="lg" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          Update details of{" "}
          <span className="text-success ms-1">
            {leadName?.name?.toUpperCase()}
          </span>
        </Modal.Title>
      </Modal.Header>
      <form method="post" autoComplete="off" onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <label htmlFor="role" className="form-label required">
                Manager / Lead :{" "}
              </label>
              <label>{leadName?.name?.toUpperCase()}</label>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-12 col-sm-12">
              <label htmlFor="members" className="form-label required">
                Members :{" "}
              </label>
              <AsyncSelect
                id="members"
                name="members"
                // options={options}
                // onChange={handleChange}
                // value={selectedPermissions[0]?.value ? selectedPermissions : ""}
                isMulti
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <SubmitBtn text={`Update team`} isLoading={isLoading} />
          <button
            type="button"
            className="btn btn-default"
            onClick={handleClose}
          >
            Close
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default AssignTeam;
