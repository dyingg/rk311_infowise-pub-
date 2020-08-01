import React, { useState, useEffect } from "react";
import Single from "./Single";
import Batch from "./Batch";

function ContentManager({ content }) {
  if (content == 3) {
    return <Batch />;
  } else {
    return <Single />;
  }
}

export default ContentManager;
