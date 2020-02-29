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
    requests: Request[];
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

  export class Request {
    name: string;
    method: string;
    path: string;
    params: Variable[];
    return_type: string;
    response_type: string;
  }
  
}
