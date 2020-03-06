import { State } from "./state";
import { Tabs } from "./tabs";
import { Sidebar } from "./sidebar";
import { Editor } from "./editor";

export module UI {
    export function update(appState: State.AppState) {
        console.log("UI.update", appState);
        Tabs.update(appState);
        Editor.update(appState);
        Sidebar.update(appState);
    }
}
