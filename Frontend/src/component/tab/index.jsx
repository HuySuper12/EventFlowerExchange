import React, { useState } from "react";

const Tabs = ({ children }) => {
  const validChildren = React.Children.toArray(children);
  const firstChild = validChildren[0];

  const [activeTab, setActiveTab] = useState(
    firstChild ? firstChild.props.label : ""
  );

  const handleClick = (e, newActiveTab) => {
    e.preventDefault();
    setActiveTab(newActiveTab);
  };

  return (
    <div className="tabs">
      <div className="flex border-b border-gray-300">
        {validChildren.map(
          (child) =>
            child &&
            child.props && (
              <button
                key={child.props.label}
                className={`${
                  activeTab === child.props.label
                    ? "border-b-2 border-purple-500"
                    : ""
                } flex-1 text-gray-700 font-medium py-2`}
                onClick={(e) => handleClick(e, child.props.label)}
              >
                {child.props.label}
              </button>
            )
        )}
      </div>
      <div className="py-4">
        {validChildren.map((child) => {
          if (child && child.props && child.props.label === activeTab) {
            return <div key={child.props.label}>{child.props.children}</div>;
          }
          return null;
        })}
      </div>
    </div>
  );
};

const Tab = ({ label, children }) => {
  return (
    <div label={label} className="hidden">
      {children}
    </div>
  );
};

export { Tabs, Tab };
