import * as React from 'react';
import { ChangeEvent, useState } from 'react';
import { RecipesStrings } from "../strings";
import { NetworkService } from "../NetworkService";

import './AddTag.scss'

export const AddTag = () => {

  const [tag, setTag] = useState<string>("");

  const onTagChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const textContent = event.target.value
    setTag(textContent)
  }

  const onSaveTagClick = () => {
    NetworkService.addTag(tag)
      .then(() => setTag(""))
      .catch(() => alert("Wywaliło się :("))
  }

  return (
    <div className={"AddTag"}>
      <input
        className={"AddTag-input"}
        data-testid={"AddTag-input"}
        placeholder={RecipesStrings.ADD_TAG_INPUT_PLACEHOLDER}
        onChange={onTagChange}
        value={tag}
      />
      <button className={"AddTag-save"} onClick={onSaveTagClick}>
        {RecipesStrings.ADD_TAGE_SAVE}
      </button>
    </div>
  );
};
