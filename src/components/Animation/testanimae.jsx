import React from "react";

const DropdownAnimations = () => {
  return (
    <div>
      <h1>10 Dropdown Animations</h1>

      <div className="menu-container">
        <h3>Animate the Whole Menu</h3>
        <nav>
          <ul className="menu">
            <li className="dropdown dropdown-6">
              Scale Down
              <ul className="dropdown_menu dropdown_menu--animated dropdown_menu-6">
                <li className="dropdown_item-1">Item 1</li>
                <li className="dropdown_item-2">Item 2</li>
                <li className="dropdown_item-3">Item 3</li>
                <li className="dropdown_item-4">Item 4</li>
                <li className="dropdown_item-5">Item 5</li>
              </ul>
            </li>
            <li className="dropdown dropdown-7">
              RotateX
              <ul className="dropdown_menu dropdown_menu--animated dropdown_menu-7">
                <li className="dropdown_item-1">Item 1</li>
                <li className="dropdown_item-2">Item 2</li>
                <li className="dropdown_item-3">Item 3</li>
                <li className="dropdown_item-4">Item 4</li>
                <li className="dropdown_item-5">Item 5</li>
              </ul>
            </li>
            <li className="dropdown dropdown-8">
              TranslateZ
              <ul className="dropdown_menu dropdown_menu--animated dropdown_menu-8">
                <li className="dropdown_item-1">Item 1</li>
                <li className="dropdown_item-2">Item 2</li>
                <li className="dropdown_item-3">Item 3</li>
                <li className="dropdown_item-4">Item 4</li>
                <li className="dropdown_item-5">Item 5</li>
              </ul>
            </li>
            <li className="dropdown dropdown-9">
              Scale
              <ul className="dropdown_menu dropdown_menu--animated dropdown_menu-9">
                <li className="dropdown_item-1">Item 1</li>
                <li className="dropdown_item-2">Item 2</li>
                <li className="dropdown_item-3">Item 3</li>
                <li className="dropdown_item-4">Item 4</li>
                <li className="dropdown_item-5">Item 5</li>
              </ul>
            </li>
            <li className="dropdown dropdown-10">
              Rotate Y
              <ul className="dropdown_menu dropdown_menu--animated dropdown_menu-10">
                <li className="dropdown_item-1">Item 1</li>
                <li className="dropdown_item-2">Item 2</li>
                <li className="dropdown_item-3">Item 3</li>
                <li className="dropdown_item-4">Item 4</li>
                <li className="dropdown_item-5">Item 5</li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>

      <div className="menu-container">
        <h3>Animate Each Menu Items</h3>
        <nav>
          <ul className="menu">
            <li className="dropdown dropdown-1">
              TranslateY
              <ul className="dropdown_menu dropdown_menu-1">
                <li className="dropdown_item-1">Item 1</li>
                <li className="dropdown_item-2">Item 2</li>
                <li className="dropdown_item-3">Item 3</li>
                <li className="dropdown_item-4">Item 4</li>
                <li className="dropdown_item-5">Item 5</li>
              </ul>
            </li>
            
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default DropdownAnimations;
