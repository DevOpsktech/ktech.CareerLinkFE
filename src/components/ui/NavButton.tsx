// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NavButton = ({ active, label, Icon, color, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300
      ${
        active
          ? `bg-gradient-to-r ${color} text-white shadow-md scale-105`
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </button>
);

export default NavButton;
