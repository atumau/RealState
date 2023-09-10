import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useParams } from "react-router-dom";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem"
import "../styles/offers.css";
import {AiOutlineReload}from 'react-icons/ai'

const Offers = () => {
    const [listing, setListing] = useState("");
    const [lastFetchListing,setLastFetchListing]=useState(null)
    const [loading, setLoading] = useState(true);
    const params = useParams();
  
    //fetch listing//
    useEffect(() => {
      const fetchListing = async () => {
        try {
          //reference
          const listingsRef = collection(db, "listings");
          //query
          const q = query(
            listingsRef,
            where("offer", "==", true),
            orderBy("timestamp", "desc"),
            limit(10)
          );
          //execute query
          const querySnap = await getDocs(q);
          const lastVisible =querySnap.docs[querySnap.docs.length - 1]
        setLastFetchListing(lastVisible)
          const listings = [];
          querySnap.forEach((doc) => {
            return listings.push({
              id: doc.id,
              data: doc.data(),
            });
          });
          setListing(listings);
          setLoading(false);
        } catch (error) {
          toast.error("Unable To Fetch Data");
        }
      };
      //func call
      fetchListing();
    }, []);
    //load more pagonation
    const fetchLoadMoreListing = async () => {
      try {
        //reference
        const listingsRef = collection(db, "listings");
        //query
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          startAfter(lastFetchListing),
          limit(10)
        );
        //execute query
        const querySnap = await getDocs(q);
        const lastVisible =querySnap.docs[querySnap.docs.length - 1]
      setLastFetchListing(lastVisible)
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListing(prevState => [...prevState, ...listings]);
        setLoading(false);
      } catch (error) {
        toast.error("Unable To Fetch Data");
      }
    };




  return (
    <Layout title="Best Offers on HouseMart">
      <div className="offers pt-3 container-fluid">
        <h1>
         {" "}
         <img 
         src="/assets/offerrpng.png"
         alt=""
         className="offer-img"
         />{" "}
        Best Offers</h1>
        {loading ? (
          <Spinner />
        ) : listing && listing.length > 0 ? (
          <>
            <div>
              {listing.map((list) => (
                <ListingItem listing={list.data} id={list.id} key={list.id}/>
              ))}
            </div>
          </>
        ) : (
          <p>There Are No Current Offers</p>
        )}
      
      <div className="d-flex align-items-center justify-content-center mb-4 mt-4">
        {
          lastFetchListing && (
            <button className="load-btn"
            onClick={fetchLoadMoreListing}
            ><AiOutlineReload/> Load More
            </button>
          )
        }
      </div>
      </div>
    </Layout>
  );
};

export default Offers;
