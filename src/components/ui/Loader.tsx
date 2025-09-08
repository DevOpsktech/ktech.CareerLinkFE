const Loader = ({ text }: { text?: string }) => {
  return (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">{text}</p>
    </div>
  );
};

export default Loader;
