import {
  checkPropertyForKeyWithValue,
  ClassDeclaration,
  isDecoratedWith,
  PropertyDeclaration,
  walkObjectTree
} from "@jamesbenrobb/ts-ast-parser";


export function isUIClass(classDeclaration: ClassDeclaration): boolean {

  if(!classDeclaration?.modifiers?.decorators) {
    return false;
  }

  return classDeclaration.modifiers.decorators
    .some(modifier => ['Directive', 'Component'].includes(modifier.type));
}

export function isInjectedDependency(property: PropertyDeclaration): boolean {
  return checkPropertyForKeyWithValue(property, 'expression', 'inject');
}

export function isInput(property: PropertyDeclaration): boolean {
  return checkPropertyForKeyWithValue(property, 'expression', 'input');
}

export function isRequiredInput(property: PropertyDeclaration): boolean {
  if(isInput(property)) {
    return checkPropertyForKeyWithValue(property, 'name', 'required');
  }

  return false;
}

export function isOutput(property: PropertyDeclaration): boolean {
  const outputs = ['output', 'outputFromObservable'];
  return outputs.some(output => checkPropertyForKeyWithValue(property, 'expression', output));
}
