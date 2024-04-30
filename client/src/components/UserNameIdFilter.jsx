import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import customFetch from "../../utils/customFetch";
import { setUserNameIds } from "../features/common/commonSlice";
import { splitErrors } from "../../utils/showErrors";
import AsyncSelect from "react-select/async";
import { useLocation } from "react-router-dom";

const UserNameIdFilter = () => {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const { userNameIds } = useSelector((store) => store.common);
  const user = userNameIds?.find(
    (i) => i.id === Number(queryParams.get("uid"))
  );
  const [form, setForm] = useState({ userId: "", userName: "" });

  const getUsers = async () => {
    try {
      if (userNameIds.length === 0) {
        const response = await customFetch.get(`/user/user-id`);
        dispatch(setUserNameIds(response.data.data.rows));
      }
    } catch (error) {
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  let options = [];
  userNameIds.map((user) => {
    const userElement = { value: user.id, label: user.name };
    options.push(userElement);
  });

  const loadOptions = (searchValue, callback) => {
    setTimeout(() => {
      const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchValue.toLowerCase())
      );
      callback(filteredOptions);
    }, 1000);
  };

  const handleUserChange = (selectedOption) => {
    setForm({
      ...form,
      userId: selectedOption.value,
      userName: selectedOption.label,
    });
  };

  useEffect(() => {
    getUsers();
    setForm({ ...form, userId: user?.id || "", userName: user?.name || "" });
  }, [user]);

  return (
    <AsyncSelect
      loadOptions={loadOptions}
      onChange={handleUserChange}
      name="uid"
      value={{
        value: form.userId,
        label: form.userName,
      }}
    />
  );
};

export default UserNameIdFilter;
