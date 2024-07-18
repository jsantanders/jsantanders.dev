import Image from "next/image";
import path from "path";
import imageSize from "image-size";

export const RoundedImage: React.FC = (props: any) => {
  const { alt, ...rest } = props;
  const isLocalImage = !props.src.startsWith("http");

  if (!rest.width && !rest.height && isLocalImage) {
    const filePath = path.join(process.cwd(), "public", rest.src);
    const dimensions = imageSize(filePath);
    rest.width = dimensions.width;
    rest.height = dimensions.height;
  }

  return <Image alt={alt} className="rounded-lg" {...rest} />;
};
