import {
  ClassDeclaration,
  ConstructorDeclaration,
  DeclarationDefinition,
  GetAccessorDeclaration,
  SetAccessorDeclaration,
  classDeclarationDefinition,
  extendDefinition
} from "@jamesbenrobb/ts-ast-parser";
import {isUIClass} from "../helpers";
import {isInjectedProperty, isInputProperty, isOutputProperty, NgPropertyDeclaration} from "./property";
import {isLifeCycleMethod, NgMethodDeclaration} from "./method";



export type NgClassElement = NgPropertyDeclaration | NgMethodDeclaration | GetAccessorDeclaration | SetAccessorDeclaration | ConstructorDeclaration


export type NgClassDeclaration = ClassDeclaration & {
    isUI: boolean,
    members?: NgClassElement[],
    inputs?: NgPropertyDeclaration[] & {isInput: true}[],
    outputs?: NgPropertyDeclaration[] & {isOutput: true}[],
    lifeCycleMethods?: NgMethodDeclaration[] & {isLifeCycleMethod: true}[],
    injectedDependencies?: NgPropertyDeclaration[] & {injectedDependency: true}[],
}


export const ngClassDeclarationDefinition: DeclarationDefinition<NgClassDeclaration> = extendDefinition(
  classDeclarationDefinition , {
    postProcess: [
      addUIFlag,
      addInjectedProperties,
      addInputs,
      addOutputs,
      addLifeCycleMethods,
      filterProperties,
      filterMethods,
      filterMembers
    ]
  }
);


function addUIFlag(classDeclaration: NgClassDeclaration): NgClassDeclaration {

    if(isUIClass(classDeclaration)) {
        classDeclaration.isUI = true;
    }

    return classDeclaration;
}

function addInjectedProperties(dec: NgClassDeclaration): NgClassDeclaration {
  const injectedDependencies = dec.members?.filter(isInjectedProperty);

  if(injectedDependencies && injectedDependencies.length > 0) {
    dec.injectedDependencies = injectedDependencies
  }

  return dec;
}

function addInputs(dec: NgClassDeclaration): NgClassDeclaration {
  if(!dec.isUI) {
    return dec
  }

  const inputs = dec.properties?.filter(isInputProperty);

  if(inputs && inputs.length > 0) {
    dec.inputs = inputs;
  }

  return dec;
}

function addOutputs(dec: NgClassDeclaration): NgClassDeclaration {
  if(!dec.isUI) {
    return dec
  }

  const outputs = dec.properties?.filter(isOutputProperty);

  if(outputs && outputs.length > 0) {
    dec.outputs = outputs;
  }

  return dec;
}

function addLifeCycleMethods(dec: NgClassDeclaration): NgClassDeclaration {
  if(!dec.isUI) {
    return dec
  }

  const lifeCycleMethods = dec.methods?.filter(isLifeCycleMethod);

  if(lifeCycleMethods && lifeCycleMethods.length > 0) {
    dec.lifeCycleMethods = lifeCycleMethods;
  }

  return dec;
}

function filterProperties(dec: NgClassDeclaration): NgClassDeclaration {
  const properties = dec.properties?.filter(prop => !isInputProperty(prop))
    .filter(prop => !isOutputProperty(prop));

  if(!properties || !properties.length) {
    delete dec.properties;
    return dec;
  }

  dec.properties = properties;

  return dec;
}


function filterMethods(dec: NgClassDeclaration): NgClassDeclaration {
  const methods = dec.methods?.filter(method => !isLifeCycleMethod(method));

  if(!methods || !methods.length) {
    delete dec.methods;
    return dec;
  }

  dec.methods = methods;

  return dec;
}

function filterMembers(dec: NgClassDeclaration): NgClassDeclaration {
  dec.members = dec.members?.filter(arg => !dec.inputs?.includes(arg as any))
    .filter(arg => !dec.outputs?.includes(arg as any))
    .filter(arg => !dec.lifeCycleMethods?.includes(arg as any))
    .filter(arg => !dec.injectedDependencies?.includes(arg as any));

  if(!dec.members || !dec.members.length) {
    delete dec.members;
  }

  return dec;
}
