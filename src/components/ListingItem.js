import React from "react";
import { Link } from "react-router-dom";
import { FaBed } from "react-icons/fa";
import { FaBath } from "react-icons/fa";
import "../styles/listingitem.css";

const ListingItem = ({ listing, id, onDelete, onEdit }) => {
  return (
    <div className="d-flex align-items-center justify-content-center ">
      <div className="card category-link mb-2 item-card" style={{ width: "800px" }}>
        <Link to={`/category/rent/${id}`}>
          <div className="row container p-2 ">
            <div className="col-md-5 item-card-continer1">
              <img
                src={listing.imgUrl[0]}
                className="img-thumbnail"
                alt={listing.name}
                height={200}
                width={300}
              />
            </div>
            <div className="col-md-5 item-card-continer2">
             <h2>{listing.name}</h2>
              <p>{listing.location}</p>
              <p>
                Rs:
                {listing.offer
                  ? listing.discountedPrice
                  : listing.regularPrice}
                {""}
                {listing.type === "rent" && "/Month"}
              </p>
              <p>
                <FaBed /> &nbsp;
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} bedrooms`
                  : "1 Bedroom"}
              </p>
              <p>
                <FaBath /> &nbsp;
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} bathrooms`
                  : "1 Bathroom"}
              </p>
              <div>
                {onDelete && (
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      onDelete(listing.id);
                    }}
                  >
                    Delete List
                  </button>
                )}
                {onEdit && (
                  <button
                    className="btn btn-info ms-3"
                    onClick={() => {
                      onEdit(listing.id);
                    }}
                  >
                    Edit List
                  </button>
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ListingItem;
