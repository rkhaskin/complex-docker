import React from "react";
import { Link } from "react-router-dom";

function otherPage() {
  return (
    <div>
      Some other page
      <Link to="/">Go Home</Link>
    </div>
  );
}

export default otherPage;
