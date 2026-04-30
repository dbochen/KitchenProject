import { ChangeEvent, useEffect, useRef, useState } from "react";
import './Search.scss'

type SearchItem = {
  id: number,
  name: string,
}

interface Props<T extends SearchItem> {
  onItemClick: (item: T) => void;
  getItems: (query: string, limit: number) => Promise<T[]>
  inputPlaceholder: string;
}

export const Search = <T extends SearchItem,>({ onItemClick, getItems, inputPlaceholder }: Props<T>): JSX.Element => {

  const inputRef = useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [foundItems, setFoundItems] = useState<T[]>([]);

  const fetchItems = async (query: string): Promise<void> => {
    const response = await getItems(query, 5);
    setFoundItems(response)
  }

  useEffect(() => {
    fetchItems(searchQuery);
  }, [searchQuery]);

  const onSearchResultClick = (item: T): void => {
    onItemClick(item)
    setSearchQuery("")
    inputRef.current && inputRef.current.focus()
  }

  const onQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const textContent = event.target.value
    setSearchQuery(textContent)
  }


  return (
    <div className={"Search"}>
      <i className="gg-search"/>
      <input
        className={"Search-input"}
        data-testid={"Search-input"}
        placeholder={inputPlaceholder}
        onChange={onQueryChange}
        value={searchQuery}
        ref={inputRef}
      />
      {searchQuery !== "" &&
        <div className={"Search-searchResults"}>
          {foundItems.map(item =>
            <div
              className={"Search-searchResults--ingredient"}
              onClick={() => onSearchResultClick(item)}
              key={item.id}
            >
              {item.name}
            </div>
          )}
        </div>}
    </div>
  )
}
