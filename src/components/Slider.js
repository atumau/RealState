import React, { useState, useEffect } from "react";
import "../styles/slider.css";
import { db } from "../firebase.config";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import SwipeCore, { EffectCoverflow, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import Spinner from "./Spinner";
import {ImLocation2} from 'react-icons/im';

// config
SwipeCore.use([EffectCoverflow, Pagination]);

const Slider = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchListing = async () => {
      const listingRef = collection(db, "listings");
      const q = query(listingRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    };
    fetchListing();
  }, []);
  if (loading) {
    return <Spinner />;
  }
  return (
    <>
    <div style={{ width: "100%" }}>
      {listings === null ? (
        <Spinner />
      ) : (
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={1}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={true}
          className="mySwipe"
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => {
                navigate(`/category/${data.type}/${id}`);
              }}
            >
              <img
                src={data.imgUrl[0]}
                alt={data.name}
                className="slider-img"
              />
              <h4 className="text-light p-4 m-0">
                <ImLocation2 size={20} className="ms-2" /> Recently Added :{" "}
                <br/>
                <span className="ms-4 mt-2">{data.name}</span>
                <span className="ms-2">
                  | Price ( Rs {data.regularPrice} )
                </span>
              </h4>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      </div>
    </>
  );
};

export default Slider;
