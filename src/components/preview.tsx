import Image from "next/image";

interface Props {
  image: string;
  onClose: () => void;
}

const Preview = ({ image, onClose }: Props) => {
  return (
    <div
      className="bg-secondary bg-opacity-70 fixed top-0 right-0 bottom-0 left-0 grid place-items-center"
      onClick={onClose}
    >
      <Image src={image} height={500} width={500} className="" alt="" />
    </div>
  );
};

export default Preview;
