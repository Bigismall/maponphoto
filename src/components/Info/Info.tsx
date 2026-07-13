export const Info = () => {
  return (
    <dialog open closedby="any">
      <p>
        Add a map thumbnail to any photo. Use the
        <abbr title="Global Positioning System">GPS</abbr> position stored in
        the photo (<abbr title="Exchangeable Image File Format">EXIF</abbr>
        data) to apply a thumbnail map image to the photo.
      </p>
      <p>
        Your photo does not have a GPS position? No problem, you can set it
        manually! Everything is happen directly in browser and
        <strong>no data is stored</strong> on page.
      </p>
    </dialog>
  );
};
