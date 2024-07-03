import {
  DeclarationDefinition,
  MethodDeclaration,
  extendDefinition,
  methodDeclarationDefinition, isMethodDeclaration, DeclarationKind
} from "@jamesbenrobb/ts-ast-parser";



export type NgMethodDeclaration = MethodDeclaration & {
  isLifeCycleMethod?: boolean
}


export const ngMethodDeclarationDefinition: DeclarationDefinition<NgMethodDeclaration> = extendDefinition(
  methodDeclarationDefinition, {
    postProcess: [
      addLifeCycleFlag
    ]
  }
);


export function isNgMethodDeclaration(dec: DeclarationKind<any>): dec is NgMethodDeclaration {
  return isMethodDeclaration(dec);
}

export function isLifeCycleMethod(dec: DeclarationKind<any>): dec is NgMethodDeclaration & {isLifeCycleMethod: true} {
  return isNgMethodDeclaration(dec) && !!dec.isLifeCycleMethod;
}



const LIFE_CYCLE_METHODS = [
  'ngOnInit',
  'ngOnChanges',
  'ngDoCheck',
  'ngAfterContentInit',
  'ngAfterContentChecked',
  'ngAfterViewInit',
  'ngAfterViewChecked',
  'ngOnDestroy'
]


function addLifeCycleFlag(method: NgMethodDeclaration): NgMethodDeclaration {

  const addFlag = LIFE_CYCLE_METHODS.includes(method.name);

  if(addFlag) {
    method.isLifeCycleMethod = true;
  }

  return method;
}