import React, { useState, useEffect } from "react";
import Single from "./Single";
import Batch from "./Batch";
import CloudSettings from "./CloudSettings";
import LogSearch from "./Search";
import LogRecent from "./Recents";

function ContentManager({ content }) {
  if (content == 3) {
    return <Batch />;
  } else if (content == 9) {
    return <CloudSettings />;
  } else if (content == 5) {
    return <LogSearch />;
  } else if (content == 6) {
    return <LogRecent />;
  } else {
    return <Single />;
  }
}

export default ContentManager;
