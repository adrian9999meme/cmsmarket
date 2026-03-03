import React from "react";

const SellerFilter = ({ value, onChange, sellers = [] }) => {
  return (
    <div>
      <label className="form-label  fw-semibold text-muted">
        Seller
      </label>

      <select
        className="form-select form-select-sm w-100"
        value={value || ""}
        onChange={(e) => onChange("sellerId", e.target.value)}
      >
        <option value="">All Sellers</option>

        {sellers?.map((seller) => (
          <option key={seller.id} value={seller.id}>
            {seller.company_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SellerFilter;