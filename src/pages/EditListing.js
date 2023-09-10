import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../components/Layout/Layout";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Spinner from "../components/Spinner";
import { AiOutlineFileAdd } from "react-icons/ai";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db } from "../firebase.config";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import "../styles/editlisting.css";

const EditListing = () => {
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const params = useParams();
  const [geoLocationEnable, setGeoLocationEnable] = useState(false);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;
  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted.current) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData((prevState) => ({
            ...prevState,
            userRef: user.uid,
          }));
        } else {
          navigate("/signin");
        }
      });
    }
    return () => {
      isMounted.current = false;
    };
  }, [auth, navigate]);

  useEffect(() => {
    setLoading(true);
    const fetchListing = async () => {
      try {
        const docRef = doc(db, "listings", params.listingId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setListing(docSnap.data());
          setFormData({ ...docSnap.data() });
          setLoading(false);
        } else {
          toast.error("Listing does not exist");
          navigate("/");
        }
      } catch (error) {
        toast.error("Error fetching listing");
        navigate("/");
      }
    };
    
    fetchListing();
  }, [params.listingId, navigate]);

  if (loading) {
    return <Spinner />;
  }

  const onChangeHandler = (e) => {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  const storeImage = async (image) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage();
      const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
      const storageRef = ref(storage, "images/" + fileName);
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          switch (snapshot.state) {
            case "paused":
              break;
            case "running":
              break;
          }
        },
        (error) => {
          reject(error);
        },
        // success
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleTypeChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      type: e.target.value,
    }));
  };

  const handleOfferChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      offer: e.target.value === "true",
    }));
  };

  const renderCommonFields = () => {
    return (
      <>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={onChangeHandler}
          />
        </div>

        <div className="form-group">
          <label htmlFor="bedrooms">Bedrooms</label>
          <input
            type="number"
            className="form-control"
            id="bedrooms"
            value={bedrooms}
            onChange={onChangeHandler}
          />
        </div>

        <div className="form-group">
          <label htmlFor="bathrooms">Bathrooms</label>
          <input
            type="number"
            className="form-control"
            id="bathrooms"
            value={bathrooms}
            onChange={onChangeHandler}
          />
        </div>

        <div className="form-group">
          <label htmlFor="parking">Parking</label>
          <div className="d-flex align-items-center">
            <div className="form-check mr-3">
              <input
                className="form-check-input"
                type="radio"
                id="parking"
                value="true"
                checked={parking === true}
                onChange={onChangeHandler}
              />
              <label className="form-check-label" htmlFor="parking">
                Yes
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                id="parking"
                value="false"
                checked={parking === false}
                onChange={onChangeHandler}
              />
              <label className="form-check-label" htmlFor="parking">
                No
              </label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="furnished">Furnished</label>
          <div className="d-flex align-items-center">
            <div className="form-check mr-3">
              <input
                className="form-check-input"
                type="radio"
                id="furnished"
                value="true"
                checked={furnished === true}
                onChange={onChangeHandler}
              />
              <label className="form-check-label" htmlFor="furnished">
                Yes
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                id="furnished"
                value="false"
                checked={furnished === false}
                onChange={onChangeHandler}
              />
              <label className="form-check-label" htmlFor="furnished">
                No
              </label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="offer">Offer</label>
          <div className="d-flex align-items-center">
            <div className="form-check mr-3">
              <input
                className="form-check-input"
                type="radio"
                id="offer"
                value="true"
                checked={offer === true}
                onChange={handleOfferChange}
              />
              <label className="form-check-label" htmlFor="offer">
                Yes
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                id="offer"
                value="false"
                checked={offer === false}
                onChange={handleOfferChange}
              />
              <label className="form-check-label" htmlFor="offer">
                No
              </label>
            </div>
          </div>
        </div>

        {offer && (
          <>
            <div className="form-group">
              <label htmlFor="regularPrice">Regular Price</label>
              <input
                type="number"
                className="form-control"
                id="regularPrice"
                value={regularPrice}
                onChange={onChangeHandler}
              />
            </div>

            <div className="form-group">
              <label htmlFor="discountedPrice">Discounted Price</label>
              <input
                type="number"
                className="form-control"
                id="discountedPrice"
                value={discountedPrice}
                onChange={onChangeHandler}
              />
            </div>
          </>
        )}

        {!offer && (
          <div className="form-group">
            <label htmlFor="regularPrice">Regular Price</label>
            <input
              type="number"
              className="form-control"
              id="regularPrice"
              value={regularPrice}
              onChange={onChangeHandler}
            />
          </div>
        )}
      </>
    );
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let imgUrl;
    try {
      imgUrl = await Promise.all([...images].map((image) => storeImage(image)));
      if (imgUrl && imgUrl.length > 0) {
        const formDataCopy = {
          ...formData,
          imgUrl,
          timestamp: serverTimestamp(),
        };
        formDataCopy.location = address;
        delete formDataCopy.images;
        !formDataCopy.offer && delete formDataCopy.discountedPrice;
        const docRef = doc(db, "listings", params.listingId);
        await updateDoc(docRef, formDataCopy);
        setLoading(false);
        toast.success("Listing Updated");
        navigate(`/category/${formDataCopy.type}/${docRef.id}`);
      } else {
        toast.error("No images uploaded");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Images not uploaded");
    }
  };

  return (
    <Layout>
      <div className="class1 container d-flex flex-column align-items-center justify-content-center mb-4">
        <h3 className="class2 mt-3 w-50 bg-dark text-light p-2 text-center">
          Update Listing <AiOutlineFileAdd />
        </h3>

        <form className="class3 w-50 bg-light p-4" onSubmit={handleFormSubmit}>
          <div className="class 4 form-group">
            <label htmlFor="type">Type</label>
            <div className="class5 d-flex">
              <div className="class6 form-check mr-3">
                <input
                  className="class7 form-check-input"
                  type="radio"
                  name="type"
                  id="rent"
                  value="rent"
                  checked={type === "rent"}
                  onChange={handleTypeChange}
                />
                <label className="class8 form-check-label" htmlFor="rent">
                  Rent
                </label>
              </div>
              <div className="class9 form-check">
                <input
                  className="class10 form-check-input"
                  type="radio"
                  name="type"
                  id="sale"
                  value="sale"
                  checked={type === "sale"}
                  onChange={handleTypeChange}
                />
                <label className="class11 form-check-label" htmlFor="sale">
                  Sale
                </label>
              </div>
            </div>
          </div>

          {(type === "rent" || type === "sale") && renderCommonFields()}

          <div className="class12 form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              className="form-control"
              id="address"
              value={address}
              onChange={onChangeHandler}
            />
          </div>

          <div className="class13 form-group">
            <label htmlFor="latitude">Latitude</label>
            <input
              type="number"
              className="class14 form-control"
              id="latitude"
              value={latitude}
              onChange={onChangeHandler}
            />
          </div>

          <div className="class15 form-group">
            <label htmlFor="longitude">Longitude</label>
            <input
              type="number"
              className="class16 form-control"
              id="longitude"
              value={longitude}
              onChange={onChangeHandler}
            />
          </div>

          <div className="class17 form-group">
            <label htmlFor="images">Images</label>
            <input
              type="file"
              className="class18 form-control"
              id="images"
              onChange={onChangeHandler}
              multiple
            />
          </div>

          <div className="class19 mb-10">
            <input
              className="class20 btn btn-primary w-100"
              type="submit"
              value="Update Listing"
            />
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditListing;
