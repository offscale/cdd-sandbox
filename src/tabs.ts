import { State } from "./state";
import { UI } from "./ui";
import { Processors } from "./processors/processors";

let tabsContainerSelector = ".tab-bar";
let tabsSelector = ".tab-bar--tab";
let activeTabSelector = ".tab-bar--tab.active";
const maxProjects = 4;

// todo: this should not write to state

export module Tabs {
    export function init(state: State.AppState) {
        document.querySelector(tabsContainerSelector).textContent = '';

        for (let project of state.projects.slice().reverse()) { // slice because reverse mutates (dumb)
            // add tabs
            document
              .querySelector(tabsContainerSelector)
              .insertAdjacentHTML(
                "afterbegin",
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

        Tabs.update(state);

        if (state.projects.length < maxProjects) {
          document
          .querySelector(tabsContainerSelector)
          .insertAdjacentHTML(
            "beforeend",
            `<div class='column tab-bar--tab new-project'>+</div>`
          );
          document.querySelector('.tab-bar--tab.new-project')
          .addEventListener("click", event => {
            console.log("new project clicked");
            state.projects.push({
              name: "typescript",
              description: "Web Frontend (Typescript)",
              loading: true,
              processor: Processors.processors["typescript-client"],
              syntax: "typescript",
              ast: {},
              code: "function main() { }",
            });
            state.save();
            Tabs.update(state);
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