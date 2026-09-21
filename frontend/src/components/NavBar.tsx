import bakerIcon from "../assets/icons/chefs-hat.png";

export default function NavBar() {
  return (
    <div className="flex h-16 w-full items-center gap-2 shadow-sm bg-white rounded-lg px-6 sm:px-8">
      <img className="w-10 h-10" src={bakerIcon} alt="logo" />
      <span className="text-[30px] font-thin font-serif">ChefMate</span>
    </div>
  );
}
