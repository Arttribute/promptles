import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function ImagesDisplay({ images }: { images: string[] }) {
  return (
    <>
      <div className="border p-0.5 m-2 rounded-lg w-96">
        <div className="grid grid-cols-2">
          {images.map((image, index) => (
            <div key={index} className=" p-0.5 col-span-1">
              <Dialog>
                <DialogTrigger>
                  <Image
                    src={image}
                    alt={image}
                    width={200}
                    height={200}
                    className="rounded-lg"
                  />
                </DialogTrigger>
                <DialogContent>
                  <Image
                    src={image}
                    alt={image}
                    width={512}
                    height={512}
                    className="rounded-lg m-1"
                  />
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
