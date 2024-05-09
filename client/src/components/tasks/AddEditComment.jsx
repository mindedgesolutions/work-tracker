import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SubmitBtn from "../SubmitBtn";
import { splitErrors } from "../../../utils/showErrors";
import customFetch from "../../../utils/customFetch";
import { useParams } from "react-router-dom";
import { updateChangeCount } from "../../features/common/commonSlice";
import { toast } from "react-toastify";
import { unsetRemarkId } from "../../features/task/remarkSlice";

const AddEditComment = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const [form, setForm] = useState({
    startTime: "",
    endTime: "",
    comments: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { remarkId, allRemarks } = useSelector((store) => store.remarks);

  const remark = allRemarks?.find((i) => i.id === remarkId);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    const process = remarkId ? customFetch.patch : customFetch.post;
    const apiUrl = remarkId
      ? `/remarks/remarks/${remarkId}`
      : `/remarks/remarks/${params.id}`;
    const msg = remarkId ? `Comment updated` : `Comment added`;
    try {
      const response = await process(apiUrl, data);

      dispatch(updateChangeCount());
      dispatch(unsetRemarkId());

      setForm({ ...form, startTime: "", endTime: "", comments: "" });

      toast.success(msg);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  const handleReset = () => {
    setForm({ ...form, startTime: "", endTime: "", comments: "" });
    unsetRemarkId();
  };

  useEffect(() => {
    setForm({
      ...form,
      startTime: remark?.start_time || "",
      endTime: remark?.end_time || "",
      comments: remark?.remark || "",
    });
  }, [remark]);

  return (
    <div className="col-12">
      <div className="card">
        <form method="post" onSubmit={handleSubmit} autoComplete="off">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <label htmlFor="name" className="form-label required">
                  Start time
                </label>
                <input
                  type="time"
                  name="startTime"
                  id="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-6 col-sm-12">
                <label htmlFor="name" className="form-label required">
                  End time
                </label>
                <input
                  type="time"
                  name="endTime"
                  id="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 col-sm-12">
                <label htmlFor="name" className="form-label required">
                  Comment
                </label>
                <textarea
                  className="form-control"
                  name="comments"
                  id="comments"
                  value={form.comments}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="mt-2 card-footer">
            <SubmitBtn
              isLoading={isLoading}
              text={remarkId ? `Save changes` : `Add comment`}
            />
            <button
              type="button"
              className="btn btn-md btn-default ms-3"
              onClick={handleReset}
            >
              Reset form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditComment;
