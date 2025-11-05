import { IoNotificationsOutline } from "react-icons/io5";

export default function Header({ title }: { title: string }) {
  return (
    <div className="flex justify-between items-center bg-white p-2 md:p-3 shadow-sm border-b fixed top-0 left-0 w-full h-16 lg:pl-64 xl:pl-72 z-30">
      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold ml-16 lg:ml-0">{title}</h1>
      <IoNotificationsOutline className="text-gray-700 mr-4 md:mr-8" size={28} />
    </div>
  );
}
