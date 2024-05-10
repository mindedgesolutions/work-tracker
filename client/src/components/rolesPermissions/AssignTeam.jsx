import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import SubmitBtn from "../SubmitBtn";
import {
  setAvailableMembers,
  unsetLeadId,
  unsetShowModal,
} from "../../features/masters/teamSlice";
import { splitErrors } from "../../../utils/showErrors";
import customFetch from "../../../utils/customFetch";
import { toast } from "react-toastify";
import { updateChangeCount } from "../../features/common/commonSlice";

const AssignTeam = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState([]);

  const { showModal, listTeam, leadId, availableMembers } = useSelector(
    (store) => store.teams
  );

  const fetchAvailable = async () => {
    setIsLoading(true);
    try {
      const response = await customFetch.get(`/masters/available-users`);
      dispatch(setAvailableMembers(response.data.data.rows));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  const leadName = listTeam?.find((i) => i.id === leadId);

  // ------
  const dbTeam = [];
  leadName?.members?.map((p) => {
    const element = { value: p.id, label: p.name };
    dbTeam.push(element);
  });

  let avails = [];
  availableMembers?.map((u) => {
    const element = { value: u.id, label: u.name };
    avails.push(element);
  });
  const options = avails;

  const handleChange = async (selected) => {
    setSelectedTeam(selected);
  };
  // ------

  const handleClose = () => {
    dispatch(unsetShowModal());
    dispatch(unsetLeadId());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    let data = Object.fromEntries(formData);
    data = { ...data, lead: leadId, members: selectedTeam };
    try {
      await customFetch.post(`/masters/teams`, data);

      dispatch(unsetShowModal());
      dispatch(unsetLeadId());
      dispatch(updateChangeCount());
      setSelectedTeam([]);

      toast.success(`Team updated`);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  useEffect(() => {
    fetchAvailable();
    setSelectedTeam(dbTeam || []);
  }, [leadName]);

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
              <Select
                id="members"
                name="members"
                options={options}
                onChange={handleChange}
                value={selectedTeam[0]?.value ? selectedTeam : []}
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
