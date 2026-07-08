import FullpageCaseStudy from "../components/FullpageCaseStudy";
import slides from "../data/tecnomatixSlides";

export default function Tecnomatix() {
  return (
    <FullpageCaseStudy
      slides={slides}
      projectLabel="TECNOMATIX"
      backPath="/"
      fontClass="font-vt"
    />
  );
}