import React from "react";

interface HeadingProps {
  title: string;
  description?: string;
}

const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{title} </h1>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Heading;
