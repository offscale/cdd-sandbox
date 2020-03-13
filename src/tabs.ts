import { DOM } from "./dom";
import { Models } from "./models";
import { State } from "./state";
import { UI } from "./ui";

let tabsContainerSelector = ".tab-bar";
let tabsSelector = ".tab-bar--tab";
let activeTabSelector = ".tab-bar--tab.active";

// todo: this should not write to state

export module Tabs {
    export function init(state: State.AppState) {
        for (let project of state.projects) {
            // add tabs
            document
              .querySelector(".tab-bar")
              .insertAdjacentHTML(
                "beforeend",
                `<div class='column tab-bar--tab ${project.name}'>${project.description}</div>`
              );
      
            // add click even to tabs
            document
              .querySelector(`.tab-bar--tab.${project.name}`)
              .addEventListener("click", event => {
                state.clickTab(project.name);
                UI.update(state);
              });
        }
    }

    export function update(state: State.AppState) {
        document.querySelectorAll(activeTabSelector).forEach(value => {
            value.classList.remove("active");
          });
          if (state.selectedTab) {
            document
              .querySelector(`${tabsSelector}.${state.selectedTab}`)
              .classList.add("active");
          }
    }

    export function click(tab: string) {

    }
}