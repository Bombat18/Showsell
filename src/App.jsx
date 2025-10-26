import React from "react";
import Myfile from "./Myfile.jsx";
import fruit from "./assets/fruit.jpg";

function App() {
  return (
    <div
      style={{
        backgroundImage: `url(${fruit})`,
        backgroundSize: "cover",        // cover entire screen
        backgroundPosition: "center",   // center the image
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",  // keeps image fixed
        minHeight: "100vh",             // full viewport height
      }}
    >
      <Myfile />
    </div>
  );
}

export default App;
