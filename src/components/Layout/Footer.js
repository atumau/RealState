import React from "react";
import { BsGithub, BsInstagram, BsTelegram, BsYoutube } from "react-icons/bs";
import { Link } from "react-router-dom";
import "../../styles/footer.css";

const Footer = () => {
  return (
    <div className="footer pt-4 d-flex flex-column align-items-center justify-content-center bg-dark text-light p-4">
      <h3>
        Made For
        <img
          src="./assets/excited-dance.gif"
          alt="love"
          height={60}
          width={80}
          className="mx-3 footer-gif"
        />
        From A T U L
      </h3>
      <h6>All Right Reserved &copy; atulTech - 2023</h6>
      <div className="d-flex flex-row p-2">
        <p className="me-4" title="Github">
          <Link to="https://github.com/">
            <BsGithub color="rgba" size={30} />
          </Link>
        </p>
        <p className="me-4" title="Instagram">
          <Link to="https://www.instagram.com/">
            <BsInstagram color="rgba" size={30} />
          </Link>
        </p>
        <p className="me-4" title="Telegram">
          <Link to="https://t.me/+lLmvjxG26fgyYWE1">
            <BsTelegram color="rgba" size={30} />
          </Link>
        </p>
        <p className="me-4" title="Youtube">
          <Link to="https://www.youtube.com/">
            <BsYoutube color="rgba" size={30} />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Footer;
