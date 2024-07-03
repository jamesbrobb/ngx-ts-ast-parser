import * as ts from "typescript";
import {
  DeclarationDefinition,
  Parser,
  PropertyDeclaration,
  findChildNodeOfKind,
  extendDefinition,
  propertyDeclarationDefinition,
  DeclarationKind,
  isPropertyDeclaration
} from "@jamesbenrobb/ts-ast-parser";
import {isInjectedDependency, isInput, isOutput, isRequiredInput} from "../helpers";


export type NgPropertyDeclaration = PropertyDeclaration & {
  injectedDependency?: {
    type: string,
    text: string,
    args?: string[]
  }
  isInput?: boolean
  isRequired?: boolean
  isOutput?: boolean
  isPublic?: boolean
}


export const ngPropertyDeclarationDefinition: DeclarationDefinition<NgPropertyDeclaration> = extendDefinition(
  propertyDeclarationDefinition, {
    postProcess: [
      addInjectedFlag,
      addInputFlags,
      addOutputFlag
    ]
  }
)


export function isNgPropertyDeclaration(dec: DeclarationKind<any>): dec is NgPropertyDeclaration {
  return isPropertyDeclaration(dec);
}

export function isInputProperty(dec: DeclarationKind<any>): dec is NgPropertyDeclaration & {isInput: true} {
  return isNgPropertyDeclaration(dec) && !!dec.isInput;
}

export function isOutputProperty(dec: DeclarationKind<any>): dec is NgPropertyDeclaration & {isOutput: true} {
  return isNgPropertyDeclaration(dec) && !!dec.isOutput;
}

export function isInjectedProperty(dec: DeclarationKind<any>): dec is NgPropertyDeclaration & {injectedDependency: true} {
  return isNgPropertyDeclaration(dec) && !!dec.injectedDependency;
}


function addInjectedFlag(
  property: NgPropertyDeclaration,
  node: ts.PropertyDeclaration,
  sourceFile: ts.SourceFile,
  _parser: Parser<any, any>
): NgPropertyDeclaration {

  if(isInjectedDependency(property)) {

    const type = findChildNodeOfKind(
      node,
      sourceFile,
      ts.isTypeNode
    );

    if(type && ts.isTypeNode(type)) {

      let ty: string = 'type missing',
        args: string[] | undefined = [];

      switch(true) {
        case ts.isTypeReferenceNode(type):
          ty = type.typeName.getText(sourceFile);
          args = type.typeArguments?.map(arg => {
            return arg.getText(sourceFile)
          });
          break;
        case ts.isExpressionWithTypeArguments(type):
          ty = type.expression.getText(sourceFile);
          args = type.typeArguments?.map(arg => {
            return arg.getText(sourceFile)
          });
          break;
      }

      property.injectedDependency = {
        type: ty,
        text: type.getText(sourceFile),
        args
      }
    }
  }

  return property;
}


function addInputFlags(property: NgPropertyDeclaration): NgPropertyDeclaration {
  let addFlag = isInput(property);
  let isRequired = isRequiredInput(property);

  if(addFlag) {
    property.isInput = true;
  }

  if(isRequired) {
    property.isRequired = true;
  }

  return property;
}

function addOutputFlag(property: NgPropertyDeclaration): NgPropertyDeclaration {
  let addFlag = isOutput(property);

  if(addFlag) {
    property.isOutput = true;
  }

  return property;
}