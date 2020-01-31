export module Models {
  export class AppState {
    selectedTab: string;
    editor: any;
    project: Project;
    services: any;
  }
  export class Service {
    server: string;
    syntax: string;
    code: string;
  }
  export class Project {
    models: Model[];
    requests: [];
  }

  export class Model {
    name: string;
    vars: Variable[];
  }

  export class Variable {
    name: string;
    type: string;
    optional: boolean;
    value?: string;
  }
}
