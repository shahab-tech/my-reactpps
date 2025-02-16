import { useState } from "react";

export function CustomAutoComplete({ categories, onSearch }){


    const [searchString, setSearchString] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    const filteredCategories = categories.filter((cat)=> 
        cat.toLowerCase().includes(searchString.toLowerCase())
    
    );


    const handleChange = (e) => {
        setSearchString(e.target.value);
        setShowSuggestions(e.target.value !== "");
      };
    
      const handleSuggestionClick = (suggestion) => {
        setSearchString(suggestion);
        setShowSuggestions(false);
      };
    
      return (
        <div className="input-group" style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search by Category"
            className="form-control"
            value={searchString}
            onChange={handleChange}
            onFocus={() => searchString && setShowSuggestions(true)}
            onBlur={() =>
              setTimeout(() => {
                setShowSuggestions(false);
              }, 100)
            }
          />
          {showSuggestions && filteredCategories.length > 0 && (
            <ul
              className="suggestions"
              style={{
                listStyleType: "none",
                padding: 0,
                margin: 0,
                border: "1px solid #ccc",
                position: "absolute",
                background: "#fff",
                width: "100%",
                top: "38px", // place suggestions just below the input
                left: "0", // align with the left edge of the input
                zIndex: 1000,
                color: "gray"
              }}
            >
              {filteredCategories.map((cat, index) => (
                <li
                  key={index}
                  onMouseDown={() => handleSuggestionClick(cat)}
                  style={{ padding: "5px", cursor: "pointer" }}
                >
                  {cat}
                </li>
              ))}
            </ul>
          )}
          <button className="btn btn-warning"  onClick={() => onSearch(searchString)}>
            <span className="bi bi-search"></span>
          </button>
        </div>
      );
}