import img1 from "../assets/img1.jpeg";
import img7 from "../assets/img7.jpeg";
import img9 from "../assets/img9.jpeg";
import img8 from "../assets/img8.jpeg";
import img10 from "../assets/img10.jpeg";
import img6 from "../assets/img6.jpeg";
import img5 from "../assets/img5.jpeg";
import img12 from "../assets/img12.jpeg";

/**
 * Existing brand imagery used as a stand-in when a portfolio project has no cover image.
 * TODO: add a real coverImage URL to each project in Admin → Portfolio; it always wins over these.
 */
export const projectFallbackImages = [img1, img7, img9, img8, img10, img6, img5, img12];

export function projectCover(project, index = 0) {
  return project?.coverImage || projectFallbackImages[index % projectFallbackImages.length];
}
