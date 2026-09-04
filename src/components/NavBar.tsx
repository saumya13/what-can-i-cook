import bakerIcon from "../assets/icons/chefs-hat.png";

export default function NavBar() {
  return (
    <div className="flex w-full h-24 items-center justify-center shadow-sm bg-white rounded-lg ">
      <div className="flex flex-row items-center gap-2">
        <img className="w-10 h-10" src={bakerIcon} alt="logo" />
        <span className="text-[30px] font-light"> Chef Claude</span>
      </div>
    </div>
  );
}
