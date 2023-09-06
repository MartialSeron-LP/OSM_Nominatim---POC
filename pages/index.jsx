import dynamic from "next/dynamic";

const OpenStreetMap = dynamic(() => import("../component/OpenStreetMap"), {
  ssr: false,
});

const index = () => {
  return (
    <>
      <h1 className="text-center">
        OpenStreetMap/Nominatim - Proof of Concept
      </h1>
      <OpenStreetMap />
    </>
  );
};

export default index;
