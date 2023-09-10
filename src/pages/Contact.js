import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/contact.css";

const Contact = () => {
  const [message, setMessage] = useState("");
  const [landlord, setLandlord] = useState("");
  const [searchParams, setSearchParams] = useSearchParams(); //eslint-disable-line
  const params = useParams();

  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, "users", params.landlordId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error("Unble to ftech data");
      }
    };
    getLandlord();
  }, [params.landlordId]);
  return (
    <Layout title="Contact Details - HouseMart">
      <div className="row contact-container">
        <div className="col-md-6 contact-container-col-1">
          <img src="/assets/contactimg.svg" alt="contact" />
        </div>
        <div className="col-md-6 contact-container-col-2">
          <h1>CONTACT DETAILS</h1>
          <div>
            {landlord !== "" && (
              <main>
                <h3 className="mb-4">
                  Person Name :{" "}
                  <span style={{ color: "#470d21" }}>
                    {" "}
                    " {landlord?.name} "{" "}
                  </span>
                </h3>

                <div className="form-floating">
                  <textarea
                    className="form-control"
                    placeholder="Leave A Comment Here"
                    value={message}
                    id="message"
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                  />
                  <label
                    htmlFor="floatingTextarea"
                    style={{ color: "lightgray" }}
                  >
                    Type Your Message Here...
                  </label>
                </div>
                <a
                  href={`mailto:${landlord.email}?Subject=${searchParams.get(
                    "listingName"
                  )}&body=${message}`}
                >
                  <button className="btn mt-2">Send Message</button>
                </a>
              </main>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
