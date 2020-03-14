import { State } from "./state";
import { Tabs } from "./tabs";
import { Sidebar } from "./sidebar";
import { Editor } from "./editor";

export module UI {
    export function update(appState: State.AppState) {
        console.log("UI.update", appState);
        Tabs.init(appState);
        Tabs.update(appState);
        Editor.update(appState);

        // temp, for testing, eventually don't need to parse this.

        let currentProject = appState.currentProject();
        let spec = currentProject.processor.extractSpec(currentProject.ast);

        Sidebar.update(spec);
    }
}
