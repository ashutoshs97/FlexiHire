import React from "react";
import { useNavigate } from "react-router-dom";

const ServiceDetail = ({ service }) => {
  const navigate = useNavigate();

  const handleMakeOrder = () => {
    navigate("/payment", { state: { serviceId: service.id, amount: service.price } });
  };

  return (
    <div className="ServiceDetail">
      <h1>{service.title}</h1>
      <p>{service.description}</p>
      <button onClick={handleMakeOrder}>Make Order</button>
    </div>
  );
};

export default ServiceDetail;
