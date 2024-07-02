import {ClassDeclaration, isDecoratedWith, PropertyDeclaration, walkObjectTree} from "@jamesbenrobb/ts-ast-parser";


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



export function checkPropertyForKeyWithValue(property: PropertyDeclaration, key: string, value: string): boolean {

  if(isDecoratedWith(value, property.modifiers)) {
    return true;
  }

  if (typeof property.initializedValue === 'string') {
    return property.initializedValue === value;
  }

  return findKeyWithValue(property.initializedValue, key, value);
}


function findKeyWithValue(obj: any, key: string, value: string): any {
  let res = false

  walkObjectTree(obj, (ky: string, val: any) => {
    if(ky === key && typeof val === 'string' && val === value) {
      res = true;
    }
  }, key);

  return res;
}
