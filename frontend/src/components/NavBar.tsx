import bakerIcon from "../assets/icons/chefs-hat.png";

export default function NavBar() {
  return (
    <div className="bg-white flex h-16 w-full items-center gap-2 border-b border-[#E7E4D0] px-6 sm:px-8 items-center">
      <img className="w-10 h-10" src={bakerIcon} alt="logo" />
      <span className="font-serif text-[28px] font-medium tracking-wide translate-y-[2px]">
        ChefMate
      </span>
    </div>
  );
}
