import * as ts from "typescript";
import {
  DeclarationDefinition,
  Parser,
  PropertyDeclaration,
  findChildNodeOfKind,
  extendDefinition,
  propertyDeclarationDefinition,
  DeclarationKind,
  isPropertyDeclaration, Maps
} from "@jamesbenrobb/ts-ast-parser";
import {isInjectedDependency, isInput, isOutput, isRequiredInput} from "../helpers";
import {InjectedDependency} from "./injected-dependency";


export type NgPropertyDeclaration = PropertyDeclaration & {
  injectedDependency?: InjectedDependency
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
  parser: Parser<any, any>,
  maps?: Maps
): NgPropertyDeclaration {

  if(isInjectedDependency(property)) {

    let ty: string = 'type missing',
      typeText: string = 'type missing',
      args: string[] | undefined = [];

    const type = findChildNodeOfKind(
      node,
      sourceFile,
      ts.isTypeNode
    );

    if(type) {

      if(ts.isTypeNode(type)) {

        switch (true) {
          case ts.isTypeReferenceNode(type):
            ty = type.typeName.getText(sourceFile);
            args = type.typeArguments?.map(arg => {
              return arg.getText(sourceFile)
            });
            typeText = type.getText(sourceFile);
            break;
          case ts.isExpressionWithTypeArguments(type):
            ty = type.expression.getText(sourceFile);
            args = type.typeArguments?.map(arg => {
              return arg.getText(sourceFile)
            });
            typeText = type.getText(sourceFile);
            break;
          default:
            console.warn('Unhandled type node');
            console.warn(ts.SyntaxKind[type.kind]);
            console.warn(type.getText(sourceFile));
        }
      }

    } else {

      if(node.initializer && ts.isCallExpression(node.initializer)) {
        if(ts.isIdentifier(node.initializer.arguments[0])) {
          ty = node.initializer.arguments[0].getText(sourceFile);
          typeText = ty;
        }
      }
    }

    property.injectedDependency = {
      type: ty,
      text: typeText,
      args
    }

    if(maps?.imports) {
      const mapElement = maps.imports.find(imp => imp.name === ty);
      if (mapElement) {
        if (mapElement.resolvedModulePath) {
          property.injectedDependency.resolvedPath = mapElement.resolvedModulePath;
        }
        if (mapElement.convertedModulePath) {
          property.injectedDependency.convertedPath = mapElement.convertedModulePath;
        }
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